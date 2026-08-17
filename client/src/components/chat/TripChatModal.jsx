import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  MapPin, 
  CheckCheck, 
  Phone, 
  Sparkles,
  Car,
  Clock
} from 'lucide-react';
import styles from './TripChatModal.module.css';

export default function TripChatModal({ isOpen, onClose, ride, user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'pilot',
      senderName: ride?.driverName || 'Rahul Sharma',
      text: 'Namaste! I will arrive at the pickup spot 5 mins before departure in my MG ZS EV.',
      time: '10:15 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'user',
      senderName: user?.name || 'You',
      text: 'Great, thanks! I am waiting near the main Expressway Entry Gate.',
      time: '10:18 AM',
      isMe: true
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen || !ride) return null;

  const quickReplies = [
    '📍 Reached pickup point / Food Mall',
    '⏱️ Running 5 mins behind due to traffic',
    '🚗 Waiting near Gate 2 / Service Lane',
    '🎒 Have 1 backpack & 1 trolley luggage'
  ];

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      senderName: user?.name || 'You',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate Pilot Quick Reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'pilot',
          senderName: ride.driverName,
          text: 'Acknowledged! AC is set to 22°C and FASTag lane is cleared.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false
        }
      ]);
    }, 1500);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerPilotInfo}>
            <img
              src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
              alt={ride.driverName}
              className={styles.pilotAvatar}
            />
            <div>
              <h3 className={styles.pilotName}>{ride.driverName}</h3>
              <span className={styles.pilotSub}>{ride.vehicle?.make} {ride.vehicle?.model} • 🟢 Online</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href={`tel:${ride.driverPhone || '+919820112345'}`} className={styles.callIconBtn} title="Call Pilot">
              <Phone size={15} />
            </a>
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={styles.messagesBox}>
          <div className={styles.securityNotice}>
            <span>🔒 End-to-end encrypted commuter chat for route #{ride.id?.slice(-6)}</span>
          </div>

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${msg.isMe ? styles.myMessageRow : styles.pilotMessageRow}`}
            >
              <div className={`${styles.bubble} ${msg.isMe ? styles.myBubble : styles.pilotBubble}`}>
                <div className={styles.bubbleSender}>{msg.senderName}</div>
                <div className={styles.bubbleText}>{msg.text}</div>
                <div className={styles.bubbleTime}>
                  <span>{msg.time}</span>
                  {msg.isMe && <CheckCheck size={12} color="#059669" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies Strip */}
        <div className={styles.quickRepliesStrip}>
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(reply)}
              className={styles.quickReplyPill}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className={styles.inputBar}
        >
          <input
            type="text"
            placeholder="Type message to pilot..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={styles.chatInput}
          />
          <button type="submit" className={styles.sendBtn}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
