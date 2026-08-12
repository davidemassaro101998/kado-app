import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgPath = path.join(process.cwd(), 'public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const publicDir = path.join(process.cwd(), 'public');
  const assetsDir = path.join(process.cwd(), 'public', 'assets');

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 180x180 for iOS Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'));

  // 192x192 for PWA
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // 512x512 for PWA & High Res
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  // Favicon (64x64 PNG saved as favicon.ico)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // OG Social Preview Banner (1200x630)
  const iconOnDark = await sharp(svgBuffer).resize(300, 300).toBuffer();
  
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 36, g: 66, b: 95, alpha: 1 } // Navy Blue #24425F
    }
  })
    .composite([
      { input: iconOnDark, top: 165, left: 450 }
    ])
    .png()
    .toFile(path.join(assetsDir, 'og-preview.png'));

  console.log('✅ Icons & OG Social Preview image generated!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
