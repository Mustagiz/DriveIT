import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Users, Search, SlidersHorizontal, Zap, Dog, DollarSign, X } from 'lucide-react';

export default function SearchWidget({ onSearch, initialFilters = {} }) {
  const [origin, setOrigin] = useState(initialFilters.origin || '');
  const [destination, setDestination] = useState(initialFilters.destination || '');
  const [date, setDate] = useState(initialFilters.date || '');
  const [seats, setSeats] = useState(initialFilters.seats || '1');
  const [showFilters, setShowFilters] = useState(false);
  const [electricOnly, setElectricOnly] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      origin,
      destination,
      date,
      seats,
      electricOnly,
      petsAllowed,
      maxPrice: maxPrice ? maxPrice : undefined
    });
  };

  const handlePopularRoute = (from, to) => {
    setOrigin(from);
    setDestination(to);
    onSearch({
      origin: from,
      destination: to,
      date,
      seats,
      electricOnly,
      petsAllowed,
      maxPrice
    });
  };

  const handleClear = () => {
    setOrigin('');
    setDestination('');
    setDate('');
    setSeats('1');
    setElectricOnly(false);
    setPetsAllowed(false);
    setMaxPrice('');
    onSearch({});
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '28px', border: '1px solid rgba(255, 200, 0, 0.25)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Origin */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FFD600', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              Leaving From (City / Hub)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={18} color="#FFC800" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                className="glass-input"
                placeholder="e.g. Mumbai, BKC, Silk Board"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: origin ? '32px' : '12px' }}
              />
              {origin && (
                <button
                  type="button"
                  onClick={() => setOrigin('')}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Destination */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FFD600', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              Going To (City / Dropoff)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Navigation size={18} color="#06B6D4" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                className="glass-input"
                placeholder="e.g. Pune, Hinjewadi, Chennai"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: destination ? '32px' : '12px' }}
              />
              {destination && (
                <button
                  type="button"
                  onClick={() => setDestination('')}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Date */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FFD600', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              Travel Date
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={18} color="#A855F7" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="date"
                className="glass-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {/* Seats & Search Button */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FFD600', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              Passenger Seats
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: '1', display: 'flex', alignItems: 'center' }}>
                <Users size={18} color="#34D399" style={{ position: 'absolute', left: '12px' }} />
                <select
                  className="glass-input"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  style={{ paddingLeft: '38px', cursor: 'pointer' }}
                >
                  <option value="1" style={{ background: '#0F172A' }}>1 Seat</option>
                  <option value="2" style={{ background: '#0F172A' }}>2 Seats</option>
                  <option value="3" style={{ background: '#0F172A' }}>3 Seats</option>
                  <option value="4" style={{ background: '#0F172A' }}>4+ Seats</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Toggle & Popular Indian Corridor Chips */}
        <div style={{
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Quick Route Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#FFD600', fontWeight: '700' }}>Express Corridors:</span>
            <button
              type="button"
              onClick={() => handlePopularRoute('Mumbai', 'Pune')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Mumbai ➔ Pune
            </button>
            <button
              type="button"
              onClick={() => handlePopularRoute('Bengaluru', 'Chennai')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Bengaluru ➔ Chennai
            </button>
            <button
              type="button"
              onClick={() => handlePopularRoute('Delhi', 'Jaipur')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Delhi ➔ Jaipur
            </button>
            <button
              type="button"
              onClick={() => handlePopularRoute('Hyderabad', 'Vijayawada')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Hyd ➔ Vijayawada
            </button>
            <button
              type="button"
              onClick={() => handlePopularRoute('Pune', 'Goa')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Pune ➔ Goa
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? 'rgba(255, 200, 0, 0.2)' : 'transparent',
                borderColor: showFilters ? '#FFC800' : 'rgba(255, 255, 255, 0.15)',
                color: showFilters ? '#FFD600' : '#CBD5E1',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '600'
              }}
            >
              <SlidersHorizontal size={13} />
              <span>More Filters</span>
            </button>

            {(origin || destination || date || electricOnly || petsAllowed || maxPrice) && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FB7185',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: '4px',
                  fontWeight: '600'
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        {showFilters && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '14px',
              padding: '14px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 200, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {/* Electric Only toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={electricOnly}
                onChange={(e) => setElectricOnly(e.target.checked)}
                style={{ accentColor: '#FFC800', width: '16px', height: '16px' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFD600', fontWeight: '600' }}>
                <Zap size={14} fill="#FFD600" /> Tata / MG EV Only
              </span>
            </label>

            {/* Pets Allowed */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={(e) => setPetsAllowed(e.target.checked)}
                style={{ accentColor: '#FFC800', width: '16px', height: '16px' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#CBD5E1' }}>
                <Dog size={14} /> Pet Friendly
              </span>
            </label>

            {/* Max Fare in Rupees */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Max Fare (₹):</span>
              <div style={{ position: 'relative', width: '110px' }}>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  className="glass-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
