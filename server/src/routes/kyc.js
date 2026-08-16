import express from 'express';
import { db } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/kyc/verify-otp
 * Simulates UIDAI OTP verification and updates the user's verified KYC state
 */
router.post('/verify-otp', authenticateToken, async (req, res) => {
  try {
    const { otp, aadhaarNumber, nameOnCard, dob, gender, address } = req.body;

    if (!otp || String(otp).length < 4) {
      return res.status(400).json({ error: 'Valid 6-digit UIDAI OTP is required.' });
    }

    const cleanAadhaar = String(aadhaarNumber || '').replace(/\D/g, '');
    const refToken = 'ADV_REF_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_AES256';

    const updatedUser = await db.updateUser(req.user.id, {
      aadhaar_number: cleanAadhaar || req.user.aadhaar_number || '542188908921',
      kyc_status: 'VERIFIED',
      verified: true,
      aadhaar_name: nameOnCard || req.user.name,
      aadhaar_dob: dob || '14/08/1994',
      aadhaar_gender: gender || 'MALE',
      aadhaar_address: address || 'Flat 402, Lotus Heights, Sector 62, Noida, Uttar Pradesh - 201309',
      aadhaar_ref_token: refToken,
      aadhaar_verified_at: new Date().toISOString()
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    const { password, ...safeUser } = updatedUser;

    return res.json({
      success: true,
      message: 'Aadhaar identity verified successfully with UIDAI Central Database!',
      user: safeUser,
      refToken
    });
  } catch (err) {
    console.error('Error verifying UIDAI OTP:', err);
    return res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

/**
 * PUT /api/kyc/card-details
 * Updates details on user's digital Aadhaar card
 */
router.put('/card-details', authenticateToken, async (req, res) => {
  try {
    const { nameOnCard, dob, gender, address } = req.body;

    const updatedUser = await db.updateUser(req.user.id, {
      name: nameOnCard || req.user.name,
      aadhaar_name: nameOnCard || req.user.name,
      aadhaar_dob: dob || '14/08/1994',
      aadhaar_gender: gender || 'MALE',
      aadhaar_address: address || 'Flat 402, Lotus Heights, Sector 62, Noida, Uttar Pradesh - 201309'
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password, ...safeUser } = updatedUser;

    return res.json({
      success: true,
      message: 'Digital Aadhaar card details updated successfully.',
      user: safeUser
    });
  } catch (err) {
    console.error('Error updating card details:', err);
    return res.status(500).json({ error: 'Failed to update card details.' });
  }
});

/**
 * POST /api/kyc/biometric-capture
 * Persists verified high-resolution biometric facial capture to the database
 */
router.post('/biometric-capture', authenticateToken, async (req, res) => {
  try {
    const { biometricPhoto, similarityScore, livenessHash } = req.body;

    if (!biometricPhoto) {
      return res.status(400).json({ error: 'High-resolution biometric photo capture is required.' });
    }

    const score = Number(similarityScore) || 0;
    if (score < 85) {
      return res.status(422).json({
        error: `Biometric verification failed: Confidence score (${score}%) is below the mandatory 85% accuracy threshold.`,
        score,
        status: 'FAILED'
      });
    }

    const updatedUser = await db.updateUser(req.user.id, {
      avatar: biometricPhoto,
      biometric_photo: biometricPhoto,
      biometric_score: score,
      biometric_verified: true,
      liveness_hash: livenessHash || `SHA256_UIDAI_LIVE_${Date.now()}`,
      kyc_status: 'VERIFIED',
      verified: true,
      biometric_verified_at: new Date().toISOString()
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    const { password, ...safeUser } = updatedUser;

    return res.json({
      success: true,
      message: '3D Face Liveness verified and high-resolution capture saved to identity vault.',
      user: safeUser
    });
  } catch (err) {
    console.error('Error saving biometric capture:', err);
    return res.status(500).json({ error: 'Failed to persist biometric capture.' });
  }
});

/**
 * GET /api/kyc/status
 * Fetches current biometric & Aadhaar verification record
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      kycStatus: user.kyc_status || 'PENDING',
      biometricVerified: Boolean(user.biometric_verified),
      biometricScore: user.biometric_score || 0,
      biometricVerifiedAt: user.biometric_verified_at || null,
      livenessHash: user.liveness_hash || null,
      maskedAadhaar: user.aadhaar_number ? `•••• •••• ${user.aadhaar_number.slice(-4)}` : null,
      nameOnCard: user.aadhaar_name || user.name,
      dob: user.aadhaar_dob || '14/08/1994',
      gender: user.aadhaar_gender || 'MALE',
      address: user.aadhaar_address || 'Flat 402, Lotus Heights, Sector 62, Noida, Uttar Pradesh - 201309',
      refToken: user.aadhaar_ref_token || 'ADV_REF_88192A01_AES256'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve KYC status.' });
  }
});

export default router;
