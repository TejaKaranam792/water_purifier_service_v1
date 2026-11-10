const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, 'assets', 'images', 'brands');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const brands = {
  'aquaguard': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 44" fill="none" role="img" aria-label="Aquaguard">
    <g fill="#0066B2">
      <path d="M22 8 C22 8 12 20 12 26 C12 31.5 16.5 36 22 36 C27.5 36 32 31.5 32 26 C32 20 22 8 22 8 Z" fill="#00A3E0"/>
      <path d="M19 19 C19 19 15 24 15 28 C15 30.5 17 33 19.5 33 C18 31 17.5 28 19.5 23 Z" fill="#FFFFFF" opacity="0.7"/>
      <text x="38" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="18" font-weight="800" fill="#0A3B73" letter-spacing="-0.4">Aquaguard</text>
    </g>
  </svg>`,

  'kent': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 44" fill="none" role="img" aria-label="Kent RO">
    <rect x="2" y="6" width="136" height="32" rx="6" fill="#E31E24"/>
    <text x="12" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF" letter-spacing="1">KENT</text>
    <text x="78" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="8.5" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">MINERAL RO</text>
    <text x="78" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="7.5" font-weight="600" fill="#FFFFFF" opacity="0.95">Water Purifiers</text>
  </svg>`,

  'ao-smith': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 44" fill="none" role="img" aria-label="A. O. Smith">
    <rect x="2" y="7" width="146" height="30" rx="15" fill="#008542"/>
    <text x="18" y="27" font-family="Georgia, Cambria, 'Times New Roman', serif" font-size="16" font-weight="bold" fill="#FFFFFF" letter-spacing="0.8">A. O. Smith</text>
  </svg>`,

  'pureit': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 44" fill="none" role="img" aria-label="Pureit">
    <path d="M18 10 C25 10 30 15 30 22 C30 29 23 34 16 34 C13.5 34 11 33 9 32 C16 31 20 26 20 20 C20 15 17 12 18 10 Z" fill="#0055A5"/>
    <text x="34" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="21" font-weight="800" fill="#0055A5" letter-spacing="-0.5">pureit</text>
    <circle cx="85" cy="16" r="3" fill="#00A3E0"/>
  </svg>`,

  'havells': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145 44" fill="none" role="img" aria-label="Havells">
    <text x="6" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="21" font-weight="900" fill="#ED1C24" letter-spacing="1.5">HAVELLS</text>
  </svg>`,

  'livpure': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 44" fill="none" role="img" aria-label="Livpure">
    <path d="M16 10 C16 10 9 19 9 25 C9 29.5 12 33 16 33 C20 33 23 29.5 23 25 C23 19 16 10 16 10 Z" fill="#00A8E8"/>
    <text x="29" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="800" fill="#1B365D" letter-spacing="-0.3">Livpure</text>
  </svg>`,

  'lg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 44" fill="none" role="img" aria-label="LG">
    <circle cx="22" cy="22" r="16" fill="#A50034"/>
    <circle cx="17.5" cy="17" r="2.2" fill="#FFFFFF"/>
    <path d="M26 13.5 C29 16 30.5 19 30.5 22 C30.5 27 26.5 31 21.5 31 C16.5 31 12.5 27 12.5 22 C12.5 17.5 15.5 14 19.5 13.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M21.5 18 L21.5 25.5 L26.5 25.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="48" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="24" font-weight="800" fill="#555555" letter-spacing="0.5">LG</text>
  </svg>`,

  'blue-star': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 155 44" fill="none" role="img" aria-label="Blue Star">
    <path d="M14 11 L16.5 17 L22.5 17 L17.5 21 L19.5 27 L14 23 L8.5 27 L10.5 21 L5.5 17 L11.5 17 Z" fill="#003366"/>
    <text x="28" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="900" fill="#003366" letter-spacing="1">BLUE STAR</text>
  </svg>`,

  'v-guard': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145 44" fill="none" role="img" aria-label="V-Guard">
    <path d="M8 12 L17 32 L23 32 L33 12 L25.5 12 L20 24.5 L14.5 12 Z" fill="#E31837"/>
    <text x="38" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="17" font-weight="900" fill="#222222" letter-spacing="0.5">V-GUARD</text>
  </svg>`
};

async function main() {
  for (const [key, svg] of Object.entries(brands)) {
    const svgPath = path.join(targetDir, `${key}.svg`);
    fs.writeFileSync(svgPath, svg.trim(), 'utf8');

    // Also generate high-DPI 2x WebP versions so <img> tags pointing to .webp or .svg load with razor-sharp quality
    const webpPath = path.join(targetDir, `${key}.webp`);
    const pngPath = path.join(targetDir, `${key}.png`);

    const svgBuffer = Buffer.from(svg.trim());
    await sharp(svgBuffer, { density: 300 })
      .resize({ height: 88 }) // 2x height for 44px display
      .webp({ quality: 95 })
      .toFile(webpPath);

    await sharp(svgBuffer, { density: 300 })
      .resize({ height: 88 })
      .png()
      .toFile(pngPath);

    console.log(`Generated SVG + 2x WebP/PNG for ${key}`);
  }
}

main().catch(console.error);
