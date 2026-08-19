/**
 * High-Performance In-Memory LRU Cache with Time-To-Live (TTL)
 * Used for caching expensive geocoding coordinates, distance calculations, and route stops.
 */
export class LRUCache {
  constructor(maxSize = 500, defaultTTLMs = 15 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTLMs;
    this.cache = new Map();
  }

  /**
   * Generates a normalized cache key.
   */
  _normalizeKey(key) {
    return String(key).toLowerCase().trim();
  }

  get(key) {
    const k = this._normalizeKey(key);
    if (!this.cache.has(k)) return null;

    const entry = this.cache.get(k);

    // Check expiration
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(k);
      return null;
    }

    // Refresh LRU order (delete & re-insert to move to tail)
    this.cache.delete(k);
    this.cache.set(k, entry);

    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTTL) {
    const k = this._normalizeKey(key);

    if (this.cache.has(k)) {
      this.cache.delete(k);
    } else if (this.cache.size >= this.maxSize) {
      // Evict oldest (first key in map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const expiry = ttlMs > 0 ? Date.now() + ttlMs : null;
    this.cache.set(k, { value, expiry });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}

// Singleton instances for shared domains
export const geocodeCache = new LRUCache(1000, 30 * 60 * 1000); // 30 mins TTL
export const routeStopCache = new LRUCache(500, 15 * 60 * 1000); // 15 mins TTL
export const pricingCache = new LRUCache(500, 5 * 60 * 1000);    // 5 mins TTL
