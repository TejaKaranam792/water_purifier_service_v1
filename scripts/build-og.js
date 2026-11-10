/**
 * Generate 1200x630 Social Share Open Graph Image (og-image.jpg)
 * Uses sharp to render SVG with gradients, typography, and vector technician art.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function buildOgImage() {
  const width = 1200;
  const height = 630;

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1F44"/>
      <stop offset="50%" stop-color="#08285C"/>
      <stop offset="100%" stop-color="#004D99"/>
    </linearGradient>

    <!-- Cyan Ambient Glow -->
    <radialGradient id="ogGlow" cx="75%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00B4D8" stop-opacity="0.38"/>
      <stop offset="60%" stop-color="#00B4D8" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#0A1F44" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF8A00"/>
      <stop offset="100%" stop-color="#FF6B00"/>
    </linearGradient>

    <linearGradient id="purifierBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#D5E8F8"/>
    </linearGradient>

    <linearGradient id="techSkin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D99B5E"/>
      <stop offset="100%" stop-color="#A26428"/>
    </linearGradient>

    <linearGradient id="techShirt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F2E62"/>
      <stop offset="100%" stop-color="#040e1fff"/>
    </linearGradient>

    <filter id="ogShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#001432" flood-opacity="0.45"/>
    </filter>
  </defs>

  <style>
    .title-main { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 800; fill: #FFFFFF; }
    .title-cyan { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 800; fill: #7FE5F6; }
    .text-sub { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 500; fill: #D3E4F8; }
    .text-badge { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 800; fill: #FFFFFF; }
    .text-chip { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 700; fill: #FFFFFF; }
  </style>

  <!-- 1. Background Fill -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>

  <!-- 2. Ambient Cyan Glow -->
  <circle cx="880" cy="315" r="340" fill="url(#ogGlow)"/>

  <!-- 3. Water Waves along bottom -->
  <path d="M 0,550 C 300,520 600,590 900,540 C 1050,515 1150,560 1200,545 L 1200,630 L 0,630 Z" fill="#00B4D8" fill-opacity="0.12"/>
  <path d="M 0,575 C 250,550 550,600 850,570 C 1050,550 1150,580 1200,570 L 1200,630 L 0,630 Z" fill="#0077B6" fill-opacity="0.18"/>

  <!-- Floating Water Bubbles -->
  <circle cx="120" cy="180" r="8" fill="#FFFFFF" opacity="0.15"/>
  <circle cx="240" cy="90" r="14" fill="#00B4D8" opacity="0.25"/>
  <circle cx="560" cy="140" r="10" fill="#FFFFFF" opacity="0.2"/>
  <circle cx="680" cy="520" r="16" fill="#00B4D8" opacity="0.2"/>
  <circle cx="1120" cy="160" r="12" fill="#FFFFFF" opacity="0.15"/>

  <!-- ============================================== -->
  <!-- LEFT COLUMN: BRANDING, TITLE, PRICING & TRUST  -->
  <!-- ============================================== -->

  <!-- Top Brand Eyebrow Pill -->
  <g transform="translate(80, 70)">
    <rect x="0" y="0" width="370" height="42" rx="21" fill="rgba(0,180,216,0.18)" stroke="rgba(0,180,216,0.4)" stroke-width="1.5"/>
    <circle cx="24" cy="21" r="10" fill="#00B4D8"/>
    <!-- Water droplet inside -->
    <path d="M 24,15 C 22,17 20,19.5 24,24 C 28,19.5 26,17 24,15 Z" fill="#FFFFFF"/>
    <text x="44" y="27" class="text-chip" font-size="14" letter-spacing="0.5">HMT AQUA · VISAKHAPATNAM</text>
  </g>

  <!-- Big Catchy Headline (Under 60 chars) -->
  <text x="80" y="180" class="title-main" font-size="52" letter-spacing="-1">RO Water Purifier</text>
  <text x="80" y="240" class="title-cyan" font-size="52" letter-spacing="-1">Service in Visakhapatnam</text>

  <!-- Subtitle -->
  <text x="80" y="295" class="text-sub" font-size="22">Doorstep service in 30–60 min · All brands · Genuine parts</text>

  <!-- Pricing Highlight Pill (Rs 399) -->
  <g transform="translate(80, 335)" filter="url(#ogShadow)">
    <rect x="0" y="0" width="260" height="60" rx="30" fill="url(#badgeGrad)"/>
    <text x="130" y="40" class="text-badge" font-size="26" text-anchor="middle">Visit Charge ₹399</text>
  </g>

  <!-- Brand Chips Row -->
  <g transform="translate(80, 425)">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="125" height="36" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="62" y="23" class="text-chip" font-size="13" text-anchor="middle">Aquaguard</text>
    </g>
    <g transform="translate(135, 0)">
      <rect x="0" y="0" width="85" height="36" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="42" y="23" class="text-chip" font-size="13" text-anchor="middle">Kent</text>
    </g>
    <g transform="translate(230, 0)">
      <rect x="0" y="0" width="115" height="36" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="57" y="23" class="text-chip" font-size="13" text-anchor="middle">AO Smith</text>
    </g>
    <g transform="translate(355, 0)">
      <rect x="0" y="0" width="95" height="36" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="47" y="23" class="text-chip" font-size="13" text-anchor="middle">Pureit</text>
    </g>
    <g transform="translate(460, 0)">
      <rect x="0" y="0" width="110" height="36" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="55" y="23" class="text-chip" font-size="13" text-anchor="middle">&amp; All Brands</text>
    </g>
  </g>

  <!-- Google Review & Contact Footer Strip -->
  <g transform="translate(80, 485)">
    <!-- Google Rating -->
    <rect x="0" y="0" width="220" height="42" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
    <text x="20" y="27" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="18" fill="#4285F4">G<tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan></text>
    <text x="100" y="27" class="text-chip" font-size="15" fill="#FFB703">★ 4.8</text>
    <text x="146" y="27" class="text-sub" font-size="13">(266+)</text>

    <!-- Phone Number Callout -->
    <rect x="235" y="0" width="240" height="42" rx="10" fill="rgba(46,196,182,0.18)" stroke="rgba(46,196,182,0.4)"/>
    <circle cx="255" cy="21" r="10" fill="#2EC4B6"/>
    <path d="M 251,17 L 254,17 L 256,19 L 254,21 C 255,23 257,25 259,26 L 261,24 L 263,26 L 263,29 C 263,29.5 262.5,30 262,30 C 256,30 249,24 249,18 C 249,17.5 249.5,17 250,17 Z" fill="#0A1F44"/>
    <text x="274" y="27" class="text-chip" font-size="15">+91 98453 31753</text>
  </g>

  <!-- ============================================== -->
  <!-- RIGHT COLUMN: VECTOR TECHNICIAN & PURIFIER ART -->
  <!-- ============================================== -->
  <g transform="translate(710, 60)" filter="url(#ogShadow)">
    <!-- Wall Mounted Purifier (Left of Character) -->
    <g transform="translate(0, 40)">
      <!-- Main Cabinet -->
      <rect x="0" y="0" width="165" height="260" rx="20" fill="url(#purifierBody)" stroke="#E0EDF8" stroke-width="2"/>
      <path d="M 0,20 Q 0,0 20,0 L 145,0 Q 165,0 165,20 L 165,48 L 0,48 Z" fill="#004D99"/>
      <!-- LED indicators -->
      <circle cx="130" cy="24" r="4" fill="#2EC4B6"/>
      <circle cx="145" cy="24" r="4" fill="#00B4D8"/>
      <!-- Pure Water Tank with Blue Level -->
      <rect x="14" y="110" width="137" height="135" rx="12" fill="#0A2540" fill-opacity="0.1"/>
      <rect x="14" y="150" width="137" height="95" rx="10" fill="#00B4D8" fill-opacity="0.7"/>
      <!-- Tap & drop -->
      <rect x="75" y="248" width="14" height="6" rx="2" fill="#004D99"/>
      <ellipse cx="82" cy="260" rx="3" ry="5" fill="#00B4D8"/>
    </g>

    <!-- Friendly Technician Character (Right) -->
    <g transform="translate(140, 20)">
      <!-- Torso in Navy Uniform -->
      <path d="M 70,360 L 80,180 Q 80,140 140,140 Q 200,140 200,180 L 210,360 Z" fill="url(#techShirt)"/>
      <path d="M 125,140 L 140,180 L 155,140" fill="#0A1F44" stroke="#00B4D8" stroke-width="2"/>
      <rect x="95" y="195" width="28" height="18" rx="3" fill="#0A1F44" stroke="#00B4D8" stroke-width="1.2"/>
      <rect x="100" y="200" width="18" height="4" rx="1" fill="#2EC4B6"/>

      <!-- Neck & Head -->
      <rect x="130" y="120" width="20" height="25" rx="4" fill="url(#techSkin)"/>
      <circle cx="140" cy="85" r="38" fill="url(#techSkin)"/>

      <!-- Friendly Smile & Eyes -->
      <ellipse cx="128" cy="82" rx="4" ry="5" fill="#1A1A1A"/>
      <ellipse cx="152" cy="82" rx="4" ry="5" fill="#1A1A1A"/>
      <circle cx="127" cy="80" r="1.5" fill="#FFFFFF"/>
      <circle cx="151" cy="80" r="1.5" fill="#FFFFFF"/>
      <path d="M 126,96 Q 140,110 154,96 Z" fill="#781D1D"/>
      <path d="M 129,96 Q 140,102 151,96 Z" fill="#FFFFFF"/>

      <!-- Service Cap -->
      <path d="M 100,75 C 100,32 180,32 180,75 Z" fill="#004D99"/>
      <path d="M 94,75 Q 140,64 186,75" stroke="#00B4D8" stroke-width="4" fill="none"/>
      <circle cx="140" cy="52" r="4" fill="#00B4D8"/>

      <!-- Holding Filter Cartridge in Left Hand -->
      <g transform="translate(25, 170) rotate(15)">
        <rect x="0" y="0" width="28" height="12" rx="3" fill="#00B4D8"/>
        <rect x="2" y="10" width="24" height="110" rx="3" fill="#FFFFFF" stroke="#BEDAF5" stroke-width="1.5"/>
        <rect x="0" y="118" width="28" height="12" rx="3" fill="#00B4D8"/>
      </g>
      <ellipse cx="50" cy="225" rx="14" ry="12" fill="#76CCE8"/>

      <!-- Right Arm Waving Hand -->
      <g transform="translate(195, 120)">
        <ellipse cx="18" cy="18" rx="14" ry="12" fill="#76CCE8"/>
        <rect x="8" y="2" width="6" height="14" rx="3" fill="#76CCE8"/>
        <rect x="16" y="-2" width="6" height="16" rx="3" fill="#76CCE8"/>
        <rect x="24" y="0" width="6" height="15" rx="3" fill="#76CCE8"/>
      </g>
    </g>

    <!-- Sparkles -->
    <circle cx="120" cy="20" r="5" fill="#2EC4B6"/>
    <circle cx="360" cy="90" r="6" fill="#00B4D8"/>
    <circle cx="40" cy="320" r="4" fill="#FFFFFF"/>
  </g>
</svg>
  `;

  const outputPath = path.join(__dirname, '..', 'assets', 'images', 'og-image.jpg');

  console.log('Rendering 1200x630 og-image.jpg using sharp...');
  await sharp(Buffer.from(svgContent))
    .jpeg({
      quality: 90,
      chromaSubsampling: '4:4:4'
    })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Successfully generated ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
}

buildOgImage().catch(err => {
  console.error('Error generating og-image:', err);
  process.exit(1);
});
