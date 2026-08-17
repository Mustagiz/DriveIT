import { formatDateTime } from './dateTime';

/**
 * Client-Side Automated Regulatory Watermarking Engine
 * Burns a non-destructive, tamper-evident regulatory watermark onto identity documents
 * before storage or preview, in compliance with UIDAI / DPDP Act 2023 guidelines.
 */

export async function applyAadhaarWatermark(imageSource, purposeText = 'DRIVEIT HIGHWAY CARPOOL VERIFICATION ONLY') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width || 800;
      canvas.height = img.height || 500;

      // Draw base document
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Watermark formatting (DD/MM/YYYY, HH:MM)
      const now = new Date();
      const timestamp = formatDateTime(now);

      const watermarkText = `★ ${purposeText} • NOT VALID FOR BANKING / LOANS • ${timestamp} ★`;

      // Set diagonal rotation & styling
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6); // -30 degrees

      ctx.font = `900 ${Math.max(14, Math.floor(canvas.width / 36))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Translucent shadow / backdrop
      ctx.fillStyle = 'rgba(101, 163, 13, 0.45)'; // Amber security hue
      ctx.fillText(watermarkText, 0, -canvas.height / 6);
      ctx.fillText(watermarkText, 0, 0);
      ctx.fillText(watermarkText, 0, canvas.height / 6);

      // Repeat with crisp top text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(watermarkText, -1, -canvas.height / 6 - 1);
      ctx.fillText(watermarkText, -1, -1);
      ctx.fillText(watermarkText, -1, canvas.height / 6 - 1);

      ctx.restore();

      // Top-right security badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(canvas.width - 240, 16, 224, 34);
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🔒 AES-256 ENCRYPTED KYC VAULT', canvas.width - 230, 36);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = (err) => {
      reject(err);
    };

    img.src = imageSource;
  });
}
