const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// AlhazenPDF Professional Icon (HTML design implemented)
function createPDFIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Deep space dark blue gradient background
  const bgGradient = ctx.createRadialGradient(size * 0.35, size * 0.30, 0, size/2, size/2, size * 0.7);
  bgGradient.addColorStop(0, '#1e2d5a');
  bgGradient.addColorStop(0.4, '#0d1630');
  bgGradient.addColorStop(1, '#060c1e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, size, size);

  // Subtle stars (15 stars)
  const stars = [
    [0.15, 0.08, 2], [0.72, 0.12, 1.5], [0.88, 0.20, 2], [0.05, 0.30, 1],
    [0.45, 0.05, 2.5], [0.10, 0.75, 1.5], [0.80, 0.82, 2], [0.55, 0.90, 1],
    [0.92, 0.65, 1.5], [0.30, 0.15, 3], [0.03, 0.50, 1], [0.96, 0.40, 2],
    [0.25, 0.95, 1.5], [0.88, 0.58, 2], [0.62, 0.18, 1.5]
  ];
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  stars.forEach(([x, y, starSize]) => {
    ctx.beginPath();
    ctx.arc(size * x, size * y, starSize, 0, Math.PI * 2);
    ctx.fill();
  });

  const centerX = size / 2;
  const centerY = size / 2;

  // Ring 1 - Outer gold ring
  ctx.strokeStyle = '#C9A84C';
  ctx.lineWidth = size * 0.006;
  ctx.shadowColor = 'rgba(201, 168, 76, 0.4)';
  ctx.shadowBlur = size * 0.035;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.43, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Ring 2 - Main blue ring
  ctx.strokeStyle = '#3a6ef5';
  ctx.lineWidth = size * 0.010;
  ctx.shadowColor = 'rgba(58, 110, 245, 0.5)';
  ctx.shadowBlur = size * 0.043;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.386, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Ring 3 - Inner light blue
  ctx.strokeStyle = 'rgba(120, 160, 255, 0.4)';
  ctx.lineWidth = size * 0.004;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.342, 0, Math.PI * 2);
  ctx.stroke();

  // Ring 4 - Innermost gold
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
  ctx.lineWidth = size * 0.003;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.303, 0, Math.PI * 2);
  ctx.stroke();

  // Orbit glow dots
  const drawOrbitDot = (x, y, dotSize, color) => {
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, dotSize * 3);
    glowGradient.addColorStop(0, color);
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, dotSize * 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  };

  drawOrbitDot(centerX, size * 0.066, size * 0.010, '#F0D060');
  drawOrbitDot(size * 0.30, size * 0.934, size * 0.007, '#C9A84C');
  drawOrbitDot(size * 0.824, size * 0.082, size * 0.008, '#7BAAFF');

  // Sparkle stars
  const drawSparkle = (x, y, sparkleSize, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - sparkleSize * 0.1, y - sparkleSize, sparkleSize * 0.2, sparkleSize * 2);
    ctx.fillRect(x - sparkleSize, y - sparkleSize * 0.1, sparkleSize * 2, sparkleSize * 0.2);
  };

  drawSparkle(size * 0.391, size * 0.102, size * 0.014, '#F0D060');
  drawSparkle(size * 0.883, size * 0.195, size * 0.014, '#9BBFFF');
  drawSparkle(size * 0.805, size * 0.863, size * 0.014, '#F0D060');
  drawSparkle(size * 0.117, size * 0.805, size * 0.014, '#9BBFFF');
  drawSparkle(size * 0.941, size * 0.352, size * 0.014, '#F0D060');

  // White inner circle
  const innerRadius = size * 0.264;
  const innerGradient = ctx.createRadialGradient(
    centerX - innerRadius * 0.3, centerY - innerRadius * 0.3, 0,
    centerX, centerY, innerRadius
  );
  innerGradient.addColorStop(0, '#ffffff');
  innerGradient.addColorStop(1, '#e8eeff');
  
  ctx.shadowColor = 'rgba(100, 140, 255, 0.3)';
  ctx.shadowBlur = size * 0.078;
  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // PDF Document
  const docWidth = size * 0.254;
  const docHeight = size * 0.3125;
  const docX = centerX - docWidth / 2;
  const docY = centerY - docHeight / 2;
  const docRadius = size * 0.027;

  // Document shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = size * 0.039;
  ctx.shadowOffsetX = size * 0.008;
  ctx.shadowOffsetY = size * 0.012;
  
  // Document body
  const docGradient = ctx.createLinearGradient(docX, docY, docX + docWidth, docY + docHeight);
  docGradient.addColorStop(0, '#ffffff');
  docGradient.addColorStop(1, '#e8eeff');
  ctx.fillStyle = docGradient;
  ctx.beginPath();
  ctx.roundRect(docX, docY, docWidth, docHeight, docRadius);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Folded corner
  const foldSize = size * 0.070;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(docX + docWidth - foldSize, docY);
  ctx.lineTo(docX + docWidth, docY);
  ctx.lineTo(docX + docWidth, docY + foldSize);
  ctx.closePath();
  ctx.clip();
  
  const foldGradient = ctx.createLinearGradient(
    docX + docWidth - foldSize, docY,
    docX + docWidth, docY + foldSize
  );
  foldGradient.addColorStop(0.5, '#c8d4f0');
  foldGradient.addColorStop(0.5, '#e0e8ff');
  ctx.fillStyle = foldGradient;
  ctx.fillRect(docX + docWidth - foldSize, docY, foldSize, foldSize);
  ctx.restore();

  // PDF red badge
  const badgeWidth = size * 0.176;
  const badgeHeight = size * 0.078;
  const badgeX = centerX - badgeWidth / 2;
  const badgeY = centerY - badgeHeight / 2 - size * 0.039;
  const badgeRadius = size * 0.020;
  
  ctx.shadowColor = 'rgba(224, 48, 16, 0.5)';
  ctx.shadowBlur = size * 0.023;
  
  const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY);
  badgeGradient.addColorStop(0, '#f05a28');
  badgeGradient.addColorStop(1, '#e03010');
  ctx.fillStyle = badgeGradient;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeRadius);
  ctx.fill();
  ctx.shadowBlur = 0;

  // "PDF" text
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${size * 0.055}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PDF', centerX, badgeY + badgeHeight / 2);

  // Document lines
  const linesY = docY + docHeight - size * 0.043;
  const lineSpacing = size * 0.012;
  const lineHeight = size * 0.010;
  const lineX = docX + size * 0.031;
  
  const lineGradient = ctx.createLinearGradient(lineX, 0, lineX + docWidth * 0.85, 0);
  lineGradient.addColorStop(0, '#c0c8e0');
  lineGradient.addColorStop(1, '#e0e6f5');
  ctx.fillStyle = lineGradient;
  
  ctx.beginPath();
  ctx.roundRect(lineX, linesY, docWidth * 0.85, lineHeight, size * 0.006);
  ctx.fill();
  
  ctx.beginPath();
  ctx.roundRect(lineX, linesY + lineSpacing, docWidth * 0.65, lineHeight, size * 0.006);
  ctx.fill();
  
  ctx.beginPath();
  ctx.roundRect(lineX, linesY + lineSpacing * 2, docWidth * 0.75, lineHeight, size * 0.006);
  ctx.fill();

  // "AlhazenPDF" watermark
  ctx.fillStyle = 'rgba(79, 110, 247, 0.35)';
  ctx.font = `700 ${size * 0.021}px Georgia`;
  ctx.textAlign = 'right';
  ctx.fillText('AlhazenPDF', docX + docWidth - size * 0.020, docY + docHeight - size * 0.012);

  return canvas.toBuffer('image/png');
}

// Icon'ları oluştur
console.log('🎨 AlhazenPDF Professional Icon\'ları oluşturuluyor...');

const assetsDir = path.join(__dirname, '..', 'assets');

// Ana icon (1024x1024)
console.log('📦 icon.png (1024x1024) oluşturuluyor...');
const icon1024 = createPDFIcon(1024, 'icon.png');
fs.writeFileSync(path.join(assetsDir, 'icon.png'), icon1024);
console.log('✅ icon.png oluşturuldu');

// Adaptive icon (1024x1024)
console.log('📦 adaptive-icon.png (1024x1024) oluşturuluyor...');
const iconAdaptive = createPDFIcon(1024, 'adaptive-icon.png');
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), iconAdaptive);
console.log('✅ adaptive-icon.png oluşturuldu');

// Splash screen (1284x2778)
console.log('📦 splash.png (1284x2778) oluşturuluyor...');
const splashCanvas = createCanvas(1284, 2778);
const splashCtx = splashCanvas.getContext('2d');

// Dark space gradient
const splashGradient = splashCtx.createRadialGradient(642, 1389, 0, 642, 1389, 1400);
splashGradient.addColorStop(0, '#1e2d5a');
splashGradient.addColorStop(0.5, '#0d1630');
splashGradient.addColorStop(1, '#060c1e');
splashCtx.fillStyle = splashGradient;
splashCtx.fillRect(0, 0, 1284, 2778);

// Grid pattern
splashCtx.strokeStyle = 'rgba(79, 110, 247, 0.03)';
splashCtx.lineWidth = 1;
for (let i = 0; i < 1284; i += 40) {
  splashCtx.beginPath();
  splashCtx.moveTo(i, 0);
  splashCtx.lineTo(i, 2778);
  splashCtx.stroke();
}
for (let i = 0; i < 2778; i += 40) {
  splashCtx.beginPath();
  splashCtx.moveTo(0, i);
  splashCtx.lineTo(1284, i);
  splashCtx.stroke();
}

// Center icon
const iconSize = 700;
const iconBuffer = createPDFIcon(iconSize, 'temp');
const { Image } = require('canvas');
const iconImage = new Image();
iconImage.src = iconBuffer;
const iconX = (1284 - iconSize) / 2;
const iconY = (2778 - iconSize) / 2 - 100;
splashCtx.drawImage(iconImage, iconX, iconY, iconSize, iconSize);

// "AlhazenPDF" text with gradient
splashCtx.font = 'bold 90px Arial, sans-serif';
splashCtx.textAlign = 'center';
splashCtx.textBaseline = 'middle';

const textGradient = splashCtx.createLinearGradient(300, 0, 984, 0);
textGradient.addColorStop(0, '#4F6EF7');
textGradient.addColorStop(0.5, '#7B8EF9');
textGradient.addColorStop(1, '#C9A84C');
splashCtx.fillStyle = textGradient;

splashCtx.shadowColor = 'rgba(79, 110, 247, 0.5)';
splashCtx.shadowBlur = 30;
splashCtx.shadowOffsetY = 5;
splashCtx.fillText('AlhazenPDF', 642, iconY + iconSize + 150);
splashCtx.shadowColor = 'transparent';

// Tagline
splashCtx.font = '32px Arial, sans-serif';
splashCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
splashCtx.fillText('Create Beautiful PDF Albums', 642, iconY + iconSize + 230);

// Sparkles
const drawSplashSparkle = (x, y, sparkSize, color) => {
  const glowGradient = splashCtx.createRadialGradient(x, y, 0, x, y, sparkSize * 3);
  glowGradient.addColorStop(0, color);
  glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  splashCtx.fillStyle = glowGradient;
  splashCtx.beginPath();
  splashCtx.arc(x, y, sparkSize * 3, 0, Math.PI * 2);
  splashCtx.fill();
  
  splashCtx.strokeStyle = color;
  splashCtx.lineWidth = sparkSize * 0.2;
  splashCtx.lineCap = 'round';
  splashCtx.beginPath();
  splashCtx.moveTo(x - sparkSize * 1.5, y);
  splashCtx.lineTo(x + sparkSize * 1.5, y);
  splashCtx.stroke();
  splashCtx.beginPath();
  splashCtx.moveTo(x, y - sparkSize * 1.5);
  splashCtx.lineTo(x, y + sparkSize * 1.5);
  splashCtx.stroke();
};

drawSplashSparkle(180, 2500, 15, 'rgba(79, 110, 247, 0.6)');
drawSplashSparkle(1100, 2550, 12, 'rgba(201, 168, 76, 0.6)');
drawSplashSparkle(520, 2600, 10, 'rgba(79, 110, 247, 0.5)');

const splashBuffer = splashCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuffer);
console.log('✅ splash.png oluşturuldu');

console.log('');
console.log('🎉 Tüm AlhazenPDF professional icon\'ları başarıyla oluşturuldu!');
console.log('📁 Konum: ' + assetsDir);
console.log('');
console.log('📱 Oluşturulan dosyalar:');
console.log('   • icon.png (1024x1024) - Ana uygulama ikonu');
console.log('   • adaptive-icon.png (1024x1024) - Android adaptive icon');
console.log('   • splash.png (1284x2778) - Başlangıç ekranı');
console.log('');
console.log('🎨 Tasarım özellikleri:');
console.log('   • Deep space blue gradient background');
console.log('   • 4 orbital rings (gold + blue)');
console.log('   • Glowing orbit dots');
console.log('   • Sparkle stars');
console.log('   • White inner circle with PDF document');
console.log('   • Red PDF badge');
console.log('   • AlhazenPDF watermark');
