import webpush from 'web-push';
import { logger } from '../utils/logger.js';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BJJ7drgA8NaqTyr_YgeGa-1IrSqrwEVKIWpZW7cmINDkVPkxyTCdV_KEGYtQiq7VHA7lBIa6z00YI3xRIX-M3uI';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'VZVUvgAylneG092ZGrM-D6fpwFQJtDVQFNlviaFTWqU';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:support@driveit.in';

try {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  logger.info('[WebPush Service] VAPID configuration initialized.');
} catch (e) {
  logger.warn('[WebPush Service] VAPID initialization notice:', e.message);
}

export class PushService {
  constructor() {
    this.subscriptions = new Map(); // userId -> Set<Subscription>
  }

  getPublicKey() {
    return VAPID_PUBLIC_KEY;
  }

  saveSubscription(userId, subscription) {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set());
    }
    this.subscriptions.get(userId).add(subscription);
    logger.info(`[WebPush] Subscription saved for user: ${userId}`);
    return true;
  }

  async sendNotification(userId, { title, body, icon, badge, data }) {
    const userSubs = this.subscriptions.get(userId);
    if (!userSubs || userSubs.size === 0) {
      logger.debug(`[WebPush] No active push subscriptions for user: ${userId}`);
      return { sent: 0 };
    }

    const payload = JSON.stringify({
      title: title || 'DriveIT Highway Update',
      body: body || 'You have an active corridor notification.',
      icon: icon || '/favicon.ico',
      badge: badge || '/favicon.ico',
      data: data || {}
    });

    let sent = 0;
    const errors = [];

    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          userSubs.delete(sub); // Expired subscription
        }
        errors.push(err.message);
      }
    }

    logger.info(`[WebPush] Notification dispatched to user ${userId} (${sent} delivered, ${errors.length} failed)`);
    return { sent, errors };
  }
}

export const pushService = new PushService();
export default pushService;
