// Generate favicons & app icons for all web Next.js apps
//
// Usage:
//   pnpm generate:favicons
//
// This script:
// - Takes a single master source icon (square PNG)
// - Generates common favicon / app-icon sizes
// - Writes them into each app's `public/` folder
//
// To update branding, just replace the source file and re-run the script.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');

// Single master icon source (square PNG, ideally 1024x1024)
const SOURCE_ICON = path.join(rootDir, 'packages', 'assets', 'app-icon.png');

// Target Next.js apps that need favicons
const APPS = [
  {
    name: 'web-app',
    publicDir: path.join(rootDir, 'apps', 'web-app', 'public'),
  },
  {
    name: 'landing',
    publicDir: path.join(rootDir, 'apps', 'landing', 'public'),
  },
];

// Output sizes / filenames we generate per app
const OUTPUT_FILES = [
  // Standard favicons
  { width: 16, height: 16, filename: 'favicon-16x16.png' },
  { width: 32, height: 32, filename: 'favicon-32x32.png' },
  { width: 48, height: 48, filename: 'favicon-48x48.png' },

  // App icons / PWA icons
  { width: 180, height: 180, filename: 'apple-touch-icon.png' },
  { width: 192, height: 192, filename: 'icon-192x192.png' },
  { width: 512, height: 512, filename: 'icon-512x512.png' },
];

async function ensureSourceExists() {
  if (!fs.existsSync(SOURCE_ICON)) {
    throw new Error(
      [
        `Source icon not found at: ${SOURCE_ICON}`,
        '',
        'Add a square PNG (e.g. 1024x1024) at that path,',
        'then re-run: pnpm generate:favicons',
      ].join('\n')
    );
  }
}

async function generateForApp(app) {
  if (!fs.existsSync(app.publicDir)) {
    console.warn(`[favicons] Skipping ${app.name}: public dir not found at ${app.publicDir}`);
    return;
  }

  console.log(`[favicons] Generating icons for ${app.name} → ${app.publicDir}`);

  await Promise.all(
    OUTPUT_FILES.map(async ({ width, height, filename }) => {
      const targetPath = path.join(app.publicDir, filename);
      await sharp(SOURCE_ICON)
        .resize(width, height, { fit: 'cover' })
        .toFile(targetPath);
    })
  );

  // Generate favicon.ico (multi-size) – browsers still look for this
  const icoPath = path.join(app.publicDir, 'favicon.ico');
  await sharp(SOURCE_ICON)
    .resize(32, 32, { fit: 'cover' })
    .toFile(icoPath);

  console.log(`[favicons] Done for ${app.name}`);
}

async function main() {
  try {
    await ensureSourceExists();
    for (const app of APPS) {
      // eslint-disable-next-line no-await-in-loop
      await generateForApp(app);
    }
    console.log('[favicons] All done.');
  } catch (err) {
    console.error('[favicons] Error:', err.message || err);
    process.exitCode = 1;
  }
}

main();

