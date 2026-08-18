import express from 'express';
import { ROLES } from '../config/constants.js';
import { db } from '../data/db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

// Get active promo banners
router.get('/', optionalAuth, async (req, res) => {
  const banners = await db.getBanners();
  const bannerList = Array.isArray(banners) ? banners : [];
  const activeBanners = bannerList.filter(b => b.active !== false);
  res.json({ total: activeBanners.length, banners: activeBanners });
});

// Admin / Support: Get all banners
router.get('/all', authenticateToken, requireRole([ROLES.SUPPORT, ROLES.ADMIN]), async (req, res) => {
  const banners = await db.getBanners();
  const bannerList = Array.isArray(banners) ? banners : [];
  res.json({ total: bannerList.length, banners: bannerList });
});

// Admin / Support: Create new banner
router.post('/', authenticateToken, requireRole([ROLES.SUPPORT, ROLES.ADMIN]), validate(schemas.createBanner), (req, res) => {
  const { title, tagline, description, badge, active } = req.body;

  const newBanner = db.createBanner({
    title,
    tagline: tagline || '',
    description: description || '',
    badge: badge || 'Special Promo',
    active: active !== undefined ? active : true
  });

  res.status(201).json({
    message: 'Promo banner created successfully',
    banner: newBanner
  });
});

// Admin / Support: Update banner
router.patch('/:id', authenticateToken, requireRole([ROLES.SUPPORT, ROLES.ADMIN]), validate(schemas.createBanner.partial()), (req, res) => {
  const updated = db.updateBanner(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Banner not found' });
  }
  res.json({ message: 'Banner updated', banner: updated });
});

// Admin / Support: Delete banner
router.delete('/:id', authenticateToken, requireRole([ROLES.SUPPORT, ROLES.ADMIN]), (req, res) => {
  const deleted = db.deleteBanner(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Banner not found' });
  }
  res.json({ message: 'Banner removed successfully' });
});

export default router;
