const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'assets', 'images');

async function processPhoto({ input, output, width, height, fit = 'cover', position = 'center' }) {
  const inPath = path.join(imgDir, input);
  const outPath = path.join(imgDir, output);

  if (!fs.existsSync(inPath)) {
    console.warn(`File not found: ${input}`);
    return;
  }

  await sharp(inPath)
    .resize(width, height, {
      fit: fit,
      position: position,
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({
      sigma: 1.1,
      m1: 1.0,
      m2: 2.0
    })
    .webp({
      quality: 92,
      effort: 6
    })
    .toFile(outPath);

  console.log(`Sharpened & enhanced ${output} (${width}x${height})`);
}

async function main() {
  // Hero photo: High resolution 900x900 for retina clarity
  await processPhoto({
    input: 'water service with bags.webp',
    output: 'hero-photo.webp',
    width: 900,
    height: 900,
    fit: 'cover',
    position: 'top'
  });

  // Services (800x600 at 92 quality with Lanczos3 + unsharp mask)
  await processPhoto({
    input: 'ro mebrance change.jpg',
    output: 'service-membrane.webp',
    width: 800,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'ro filter installation.jpg',
    output: 'service-installation.webp',
    width: 800,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'tds check.webp',
    output: 'service-tds.webp',
    width: 800,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'filters.jpg',
    output: 'service-filters.webp',
    width: 800,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'Clean Ro water.jpg',
    output: 'service-drinking.webp',
    width: 800,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'water service with bag.jpg',
    output: 'service-doorstep.webp',
    width: 800,
    height: 600,
    fit: 'cover'
  });

  // Steps (600x600)
  await processPhoto({
    input: 'booking online.jpg',
    output: 'step-booking.webp',
    width: 600,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'Technician on the way.jpg',
    output: 'step-dispatch.webp',
    width: 600,
    height: 600,
    fit: 'cover'
  });

  await processPhoto({
    input: 'Clean Ro water.jpg',
    output: 'step-pure-water.webp',
    width: 600,
    height: 600,
    fit: 'cover'
  });

  // Before & After comparison filters (matching aspect ratios 700x850)
  await processPhoto({
    input: 'dirty aqua filter.avif',
    output: 'filter-before.webp',
    width: 700,
    height: 850,
    fit: 'cover'
  });

  await processPhoto({
    input: 'clean aqua filter.png',
    output: 'filter-after.webp',
    width: 700,
    height: 850,
    fit: 'cover'
  });

  console.log('All photos successfully sharpened and enhanced!');
}

main().catch(console.error);
