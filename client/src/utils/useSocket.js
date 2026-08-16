import { useEffect, useRef, useState } from 'react';

export function useSocket(url) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        const { io } = await import('socket.io-client');
        const socket = io(url || 'http://localhost:5050', {
          transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
          if (mounted) {
            setConnected(true);
            console.log('Socket connected:', socket.id);
          }
        });

        socket.on('disconnect', () => {
          if (mounted) setConnected(false);
        });

        socket.on('message', (msg) => {
          if (mounted) {
            setMessages(prev => [...prev, msg]);
          }
        });

        socketRef.current = socket;
      } catch (err) {
        console.warn('Socket.io not available, falling back to polling', err);
      }
    };

    connect();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url]);

  const sendMessage = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', data);
      return true;
    }
    return false;
  };

  return { messages, connected, sendMessage };
}
