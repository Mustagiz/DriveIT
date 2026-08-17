import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShieldAlert, Sparkles, User, Headset } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function SupportChatDrawer() {
  const { user, isAuthenticated, token } = useAuth();
  const { addToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAuthenticated, user]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });

      if (res.ok) {
        fetchMessages();
      } else {
        addToast('Failed to send message', 'error');
      }
    } catch (err) {
      addToast('Chat connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
          color: '#0E240B',
          borderRadius: '50px',
          padding: '12px 20px',
          border: 'none',
          boxShadow: '0 8px 25px rgba(132, 204, 22, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '800',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-heading)',
          cursor: 'pointer',
          zIndex: 1500,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)';
        }}
      >
        <Headset size={18} />
        <span>Driveit Support</span>
      </button>

      {/* Slide-in Chat Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '84px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          height: '520px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1600,
          overflow: 'hidden'
        }} className="animate-fade-in">
          {/* Top Bar */}
          <div style={{
            background: '#ECFCCB',
            borderBottom: '1px solid #BEF264',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#84CC16',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0E240B'
              }}>
                <Headset size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0F172A' }}>
                  Driveit Support Desk
                </div>
                <div style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                  <span>Operations Live 24/7</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Feed */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#F8FAFC'
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '40px', fontSize: '0.85rem' }}>
                <Headset size={36} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontWeight: '700', color: '#64748B' }}>Connecting to Active Ops Agent</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem' }}>Ask anything about your bookings, route telemetry, or payment settlements.</p>
              </div>
            ) : (
              messages.map(m => {
                const isMe = m.senderId === user?.id;
                return (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#64748B', marginBottom: '2px', fontWeight: '600' }}>
                      {m.senderName}
                    </div>
                    <div style={{
                      background: isMe ? '#ECFCCB' : '#FFFFFF',
                      color: isMe ? '#166534' : '#0F172A',
                      padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: isMe ? '1px solid #BEF264' : '1px solid #E2E8F0',
                      fontSize: '0.84rem',
                      lineHeight: 1.4,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {m.message}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '2px' }}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px 16px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask Driveit Support Desk..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#0F172A',
                background: '#F8FAFC'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              style={{
                background: '#84CC16',
                border: '1px solid #65A30D',
                color: '#0E240B',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
