/**
 * AlhazenPDF Ultimate Icon Generator
 * HTML'den 1024x1024 PNG icon oluşturur
 */

const fs = require('fs');
const path = require('path');

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: transparent;
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    width: 1024px;
    height: 1024px;
    border-radius: 225px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 38% 32%, #172048 0%, #0C1228 45%, #060A18 100%);
    box-shadow: 0 0 0 2px rgba(201,168,76,0.15), 0 80px 200px rgba(0,0,0,0.8);
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: white;
  }
  .nebula {
    position: absolute;
    border-radius: 50%;
  }
  .hex-svg {
    position: absolute;
    width: 870px;
    height: 870px;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
  .beam {
    position: absolute;
    height: 4px;
    border-radius: 4px;
    transform-origin: left center;
  }
  .eye-container {
    position: absolute;
    width: 256px;
    height: 133px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -205px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .eye-outer {
    position: absolute;
    width: 256px;
    height: 128px;
    border: 5px solid #C9A84C;
    border-radius: 50%;
    box-shadow: 0 0 36px 8px rgba(201,168,76,0.3), inset 0 0 36px 8px rgba(201,168,76,0.08);
  }
  .eye-iris {
    position: absolute;
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 32%, #5A9AFF 0%, #1E4AB0 55%, #0A1A60 100%);
    border: 4px solid rgba(79,142,247,0.4);
    box-shadow: 0 0 46px 15px rgba(79,110,247,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .eye-pupil {
    width: 31px;
    height: 31px;
    border-radius: 50%;
    background: #04081A;
    position: relative;
  }
  .eye-shine {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    top: 3px;
    right: 3px;
    opacity: 0.95;
  }
  .big-a {
    position: absolute;
    font-family: 'Arial Black', sans-serif;
    font-size: 333px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -10px;
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(200,215,255,0.85) 40%, rgba(79,110,247,0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -30%);
    z-index: 2;
    filter: drop-shadow(0 0 51px rgba(79,110,247,0.3));
  }
  .a-line {
    position: absolute;
    width: 460px;
    height: 6px;
    background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.8) 20%, #F0D060 50%, rgba(201,168,76,0.8) 80%, transparent 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, 46px);
    border-radius: 4px;
    z-index: 3;
    box-shadow: 0 0 26px 5px rgba(201,168,76,0.3);
  }
  .pdf-badge {
    position: absolute;
    bottom: 133px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #E04020 0%, #B02800 100%);
    border-radius: 26px;
    padding: 13px 41px 15px;
    z-index: 4;
    box-shadow: 0 10px 41px rgba(180,40,0,0.5), inset 0 3px 0 rgba(255,255,255,0.2);
  }
  .pdf-text {
    font-family: 'Arial Black', sans-serif;
    font-size: 51px;
    font-weight: 900;
    color: white;
    letter-spacing: 8px;
    line-height: 1;
    text-shadow: 0 3px 8px rgba(0,0,0,0.4);
  }
  .glow-dot {
    position: absolute;
    border-radius: 50%;
    z-index: 5;
  }
  .sparkle {
    position: absolute;
    z-index: 5;
  }
  .sparkle::before,
  .sparkle::after {
    content: '';
    position: absolute;
    border-radius: 4px;
    transform: translate(-50%, -50%);
  }
  .sparkle.gold::before { width: 5px; height: 46px; background: #F0D060; top: 0; left: 0; }
  .sparkle.gold::after  { width: 46px; height: 5px; background: #F0D060; top: 0; left: 0; }
  .sparkle.blue::before { width: 5px; height: 36px; background: #9BBFFF; top: 0; left: 0; }
  .sparkle.blue::after  { width: 36px; height: 5px; background: #9BBFFF; top: 0; left: 0; }
  .sparkle.sm::before { width: 4px; height: 28px; background: #F0D060; top: 0; left: 0; }
  .sparkle.sm::after  { width: 28px; height: 4px; background: #F0D060; top: 0; left: 0; }
</style>
</head>
<body>
<div class="icon">
  <div class="star" style="width:5px;height:5px;top:6%;left:12%;opacity:0.9;"></div>
  <div class="star" style="width:4px;height:4px;top:10%;left:70%;opacity:0.7;"></div>
  <div class="star" style="width:6px;height:6px;top:4%;left:43%;opacity:0.8;"></div>
  <div class="star" style="width:3px;height:3px;top:28%;left:3%;opacity:0.6;"></div>
  <div class="star" style="width:5px;height:5px;top:18%;left:86%;opacity:0.75;"></div>
  <div class="star" style="width:4px;height:4px;top:73%;left:8%;opacity:0.65;"></div>
  <div class="star" style="width:5px;height:5px;top:80%;left:78%;opacity:0.7;"></div>
  <div class="star" style="width:3px;height:3px;top:88%;left:52%;opacity:0.5;"></div>
  <div class="star" style="width:4px;height:4px;top:63%;left:90%;opacity:0.6;"></div>
  <div class="star" style="width:8px;height:8px;top:13%;left:28%;opacity:0.5;"></div>
  <div class="star" style="width:5px;height:5px;top:38%;left:94%;opacity:0.6;"></div>
  <div class="star" style="width:3px;height:3px;top:92%;left:22%;opacity:0.55;"></div>
  
  <div class="nebula" style="width:717px;height:512px;top:-77px;right:-128px;background:radial-gradient(ellipse,rgba(79,110,247,0.14) 0%,transparent 70%);"></div>
  <div class="nebula" style="width:563px;height:410px;bottom:-51px;left:-77px;background:radial-gradient(ellipse,rgba(201,168,76,0.09) 0%,transparent 70%);"></div>
  
  <svg class="hex-svg" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="170,10 318,95 318,245 170,330 22,245 22,95" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.8"/>
    <polygon points="170,30 298,107 298,233 170,310 42,233 42,107" fill="none" stroke="#3A6EF5" stroke-width="3.5" style="filter:drop-shadow(0 0 8px rgba(58,110,245,0.6))"/>
    <polygon points="170,52 278,121 278,219 170,288 62,219 62,121" fill="none" stroke="rgba(100,150,255,0.25)" stroke-width="1.5"/>
    <polygon points="170,76 258,127 258,209 170,260 82,209 82,127" fill="rgba(79,110,247,0.04)" stroke="rgba(201,168,76,0.12)" stroke-width="1"/>
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C9A84C"/>
        <stop offset="35%" stop-color="#F0D060"/>
        <stop offset="70%" stop-color="#C9A84C"/>
        <stop offset="100%" stop-color="#9A7A2E"/>
      </linearGradient>
    </defs>
  </svg>
  
  <div class="beam" style="width:179px;top:31%;left:54%;transform:rotate(0deg);background:linear-gradient(90deg,rgba(201,168,76,0.7),transparent);"></div>
  <div class="beam" style="width:149px;top:27%;left:54%;transform:rotate(-20deg);background:linear-gradient(90deg,rgba(201,168,76,0.5),transparent);"></div>
  <div class="beam" style="width:149px;top:36%;left:54%;transform:rotate(20deg);background:linear-gradient(90deg,rgba(201,168,76,0.5),transparent);"></div>
  <div class="beam" style="width:113px;top:22%;left:54%;transform:rotate(-38deg);background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);"></div>
  <div class="beam" style="width:113px;top:41%;left:54%;transform:rotate(38deg);background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);"></div>
  
  <div class="eye-container">
    <div class="eye-outer"></div>
    <div class="eye-iris">
      <div class="eye-pupil">
        <div class="eye-shine"></div>
      </div>
    </div>
  </div>
  
  <div class="big-a">A</div>
  <div class="a-line"></div>
  
  <div class="pdf-badge">
    <div class="pdf-text">PDF</div>
  </div>
  
  <div class="glow-dot" style="width:26px;height:26px;background:#F0D060;box-shadow:0 0 41px 13px rgba(240,208,96,0.8);top:21px;left:50%;transform:translateX(-50%);"></div>
  <div class="glow-dot" style="width:21px;height:21px;background:#C9A84C;box-shadow:0 0 31px 10px rgba(201,168,76,0.7);bottom:26px;left:50%;transform:translateX(-50%);"></div>
  <div class="glow-dot" style="width:18px;height:18px;background:#7BAAFF;box-shadow:0 0 31px 10px rgba(123,170,255,0.8);top:26%;right:7%;"></div>
  <div class="glow-dot" style="width:15px;height:15px;background:#C9A84C;box-shadow:0 0 26px 8px rgba(201,168,76,0.6);bottom:24%;left:7%;"></div>
  <div class="glow-dot" style="width:15px;height:15px;background:#7BAAFF;box-shadow:0 0 26px 8px rgba(123,170,255,0.6);top:24%;left:7%;"></div>
  <div class="glow-dot" style="width:18px;height:18px;background:#C9A84C;box-shadow:0 0 31px 10px rgba(201,168,76,0.7);bottom:26%;right:7%;"></div>
  
  <div class="sparkle gold" style="top:36px;left:405px;"></div>
  <div class="sparkle blue" style="top:143px;right:97px;transform:rotate(25deg);"></div>
  <div class="sparkle gold" style="bottom:113px;right:184px;transform:rotate(15deg);"></div>
  <div class="sparkle blue" style="bottom:164px;left:97px;transform:rotate(40deg);"></div>
  <div class="sparkle sm"   style="top:307px;right:41px;transform:rotate(10deg);"></div>
  <div class="sparkle sm"   style="top:72px;left:138px;transform:rotate(20deg);"></div>
</div>
</body>
</html>
`;

const outputPath = path.join(__dirname, '..', 'assets', 'icon-ultimate.html');
fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
console.log('✅ Ultimate icon HTML oluşturuldu:', outputPath);
console.log('\n📸 Chrome ile aç ve ekran görüntüsü al (1024x1024)');
console.log('💾 Sonra icon.png, adaptive-icon.png, favicon.png olarak kaydet\n');
