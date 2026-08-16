import express from 'express';
import { ROLES } from '../config/constants.js';
import { db } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticateToken);

// Get messages
router.get('/messages', (req, res) => {
  const isSupport = req.user.roles.includes(ROLES.SUPPORT) || req.user.roles.includes(ROLES.ADMIN);
  const threadId = isSupport && req.query.threadId ? req.query.threadId : req.user.id;

  const messages = db.getMessages(threadId);
  res.json({
    threadId,
    messages
  });
});

// Send a chat message
router.post('/messages', validate(schemas.createMessage), (req, res) => {
  const { message, threadId: requestedThreadId } = req.body;

  const isSupport = req.user.roles.includes(ROLES.SUPPORT) || req.user.roles.includes(ROLES.ADMIN);
  const threadId = isSupport && requestedThreadId ? requestedThreadId : req.user.id;

  const newMsg = db.createMessage({
    threadId,
    senderId: req.user.id,
    senderName: isSupport ? `${req.user.name} (Support Desk)` : req.user.name,
    senderRole: isSupport ? 'support' : req.user.roles[0] || 'booker',
    recipientId: isSupport ? threadId : 'SUPPORT_QUEUE',
    message: message.trim()
  });

  res.status(201).json({
    success: true,
    message: newMsg
  });
});

// Support Team: List all active chat threads
router.get('/threads', (req, res) => {
  if (!req.user.roles.includes(ROLES.SUPPORT) && !req.user.roles.includes(ROLES.ADMIN)) {
    return res.status(403).json({ error: 'Unauthorized to view support chat inbox' });
  }

  const threads = db.getChatThreads();
  res.json({
    total: threads.length,
    threads
  });
});

export default router;
