#!/usr/bin/env node
// Generates every app icon / splash / favicon asset from the vector master mark
// at assets/icon/mark.svg (anvil + dumbbell, transparent background).
//
// Each variant is composed as a small SVG (background + the mark nested at the
// right size) and rasterised straight to its target resolution, so there is no
// bitmap resampling and every edge stays crisp.
//
// Usage: npm run icons   (requires ImageMagick `magick` built with librsvg)

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'assets/images');
const tmp = mkdtempSync(join(tmpdir(), 'anvil-icons-'));
const magick = (...args) => execFileSync('magick', args.flat(), { stdio: 'inherit' });

// Master mark: keep its inner markup and aspect ratio so it can be nested.
const markSvg = readFileSync(join(root, 'assets/icon/mark.svg'), 'utf8');
const [vbX, vbY, vbW, vbH] = markSvg.match(/viewBox="([^"]+)"/)[1].trim().split(/[\s,]+/).map(Number);
const markInner = markSvg.slice(markSvg.indexOf('>') + 1, markSvg.lastIndexOf('</svg>'));

// Background gradient (top → bottom) and the solid colour used for the splash
// screen / adaptive-icon fallback. Keep BG_SOLID in sync with app.config.js.
const BG_TOP = '#0E0F13';
const BG_BOTTOM = '#0A0B0F';
const BG_SOLID = '#0C0D11';

const background = (size) => `
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${BG_TOP}"/><stop offset="1" stop-color="${BG_BOTTOM}"/>
  </linearGradient></defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>`;

/** The mark scaled to `scale` × canvas width, centred on a `w`×`h` canvas. */
const mark = (w, h, scale) => {
  const mw = w * scale;
  const mh = (mw * vbH) / vbW;
  return `<svg x="${(w - mw) / 2}" y="${(h - mh) / 2}" width="${mw}" height="${mh}" viewBox="${vbX} ${vbY} ${vbW} ${vbH}">${markInner}</svg>`;
};

/** Writes an SVG document of `w`×`h` px and rasterises it to `out`. */
const render = (name, w, h, body, out, ...flags) => {
  const file = join(tmp, `${name}.svg`);
  writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
  magick('-background', 'none', file, flags, '-strip', out);
};

// 1. Full-bleed square icon (iOS, Expo Go, web). The OS applies its own mask,
//    so the mark sits at ~82% width with room for the rounded corners.
const ICON = 1024;
const ICON_SCALE = 0.82;
render('icon', ICON, ICON, background(ICON) + mark(ICON, ICON, ICON_SCALE), `PNG24:${join(imgDir, 'icon.png')}`, '-alpha', 'off');

// 2. Favicon: same composition, rendered natively at 48 px.
render('favicon', 48, 48, background(48) + mark(48, 48, ICON_SCALE), `PNG32:${join(imgDir, 'favicon.png')}`);

// 3. Splash: the mark alone on transparency (splash background is BG_SOLID).
render('splash', 1024, (1024 * vbH) / vbW, mark(1024, (1024 * vbH) / vbW, 1), `PNG32:${join(imgDir, 'splash-icon.png')}`);

// 4. Android adaptive icon. Only the centre 66dp of 108dp is guaranteed visible
//    (and may be masked to a circle), so the mark is kept at 54% of the canvas.
const ANDROID = 512;
const ANDROID_SCALE = 0.54;
render('android-bg', ANDROID, ANDROID, background(ANDROID), `PNG24:${join(imgDir, 'android-icon-background.png')}`, '-alpha', 'off');
render('android-fg', ANDROID, ANDROID, mark(ANDROID, ANDROID, ANDROID_SCALE), `PNG32:${join(imgDir, 'android-icon-foreground.png')}`);

// 5. Android monochrome (themed icons): white silhouette of the mark. The
//    system tints it, so only the alpha channel matters.
const MONO = 432;
render(
  'android-mono', MONO, MONO, mark(MONO, MONO, ANDROID_SCALE),
  `PNG32:${join(imgDir, 'android-icon-monochrome.png')}`,
  '-channel', 'RGB', '-evaluate', 'set', '100%', '+channel',
);

rmSync(tmp, { recursive: true, force: true });
console.log(`Icons generated. Splash / adaptive background colour: ${BG_SOLID}`);
