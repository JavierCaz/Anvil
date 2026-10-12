#!/usr/bin/env node
// Generates every app icon / splash / favicon asset from the master artwork at
// assets/icon/source.png (1254×1254, anvil + dumbbell on a dark gradient).
//
// The master has a decorative rounded-square frame baked in, which would show up
// as a double border once the OS applies its own mask. The frame is painted out
// by blending the artwork over a matching dark gradient outside an inset
// rounded rect, then each platform variant is cut from that clean image.
//
// Usage: npm run icons   (requires ImageMagick `magick` on PATH)

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'assets/icon/source.png');
const imgDir = join(root, 'assets/images');
const tmp = mkdtempSync(join(tmpdir(), 'anvil-icons-'));
const t = (name) => join(tmp, name);
const magick = (...args) => execFileSync('magick', args.flat(), { stdio: 'inherit' });

// Geometry of the master (px). The frame line runs at ~91..1162.
const SIZE = 1254;
const FRAME = { x: 92, size: 1070 };
// Artwork is kept only inside these boxes (plates row + anvil body), well clear
// of the frame's large-radius corners; everything else becomes plain gradient.
const KEEP_BOXES = [
  'roundrectangle 125,440 1129,800 40,40',
  'roundrectangle 260,300 994,920 80,80',
];
const MARK = { x: 120, y: 370, w: 1014, h: 500 }; // bounding box of anvil + dumbbell
// Background gradient that matches the artwork behind the frame (top → bottom).
const BG_TOP = '#17181B';
const BG_BOTTOM = '#07080A';
// Solid colour for the splash screen / adaptive-icon fallback; matches the
// artwork background around the mark. Keep in sync with app.config.js.
const BG_SOLID = '#0E0F12';

// 1. Clean master: artwork inside the keep boxes, gradient outside.
magick('-size', `${SIZE}x${SIZE}`, `gradient:${BG_TOP}-${BG_BOTTOM}`, t('bg.png'));
magick(
  '-size', `${SIZE}x${SIZE}`, 'xc:black', '-fill', 'white',
  KEEP_BOXES.flatMap((box) => ['-draw', box]),
  '-blur', '0x40', '-alpha', 'off', t('keep-mask.png'),
);
// The mask must have no alpha channel or ImageMagick ignores it.
magick(t('bg.png'), source, '(', t('keep-mask.png'), '-alpha', 'off', ')', '-composite', t('clean.png'));

// 2. Full-bleed square icon (iOS, Expo Go, web) + favicon.
magick(t('clean.png'), '-crop', `${FRAME.size}x${FRAME.size}+${FRAME.x}+${FRAME.x}`, '+repage', t('square.png'));
magick(t('square.png'), '-resize', '1024x1024', '-alpha', 'off', '-strip', `PNG24:${join(imgDir, 'icon.png')}`);
magick(t('square.png'), '-resize', '48x48', '-strip', `PNG32:${join(imgDir, 'favicon.png')}`);

// 3. Mark cut-out with feathered edges (splash + Android).
magick(
  '-size', `${MARK.w}x${MARK.h}`, 'xc:black', '-fill', 'white',
  '-draw', `roundrectangle 40,40 ${MARK.w - 41},${MARK.h - 41} 120,120`,
  '-blur', '0x24', t('mark-mask.png'),
);
magick(
  t('clean.png'), '-crop', `${MARK.w}x${MARK.h}+${MARK.x}+${MARK.y}`, '+repage',
  t('mark-mask.png'), '-alpha', 'off', '-compose', 'CopyOpacity', '-composite', t('mark.png'),
);
magick(t('mark.png'), '-resize', '1024x', '-strip', `PNG32:${join(imgDir, 'splash-icon.png')}`);

// 4. Android adaptive icon. Only the centre 66dp of 108dp is guaranteed visible,
//    so the mark is scaled to ~58% of the canvas width. The foreground is opaque
//    (gradient + mark) so the feathered edges always blend into the right colour.
const ANDROID = 512;
const ANDROID_MARK_W = Math.round(ANDROID * 0.58);
magick('-size', `${ANDROID}x${ANDROID}`, `gradient:${BG_TOP}-${BG_BOTTOM}`, '-strip', `PNG24:${join(imgDir, 'android-icon-background.png')}`);
magick(
  join(imgDir, 'android-icon-background.png'),
  '(', t('mark.png'), '-resize', `${ANDROID_MARK_W}x`, ')',
  '-gravity', 'center', '-composite', '-strip', `PNG32:${join(imgDir, 'android-icon-foreground.png')}`,
);

// 5. Android monochrome (themed icons): white silhouette of the mark.
const MONO = 432;
magick(
  t('clean.png'), '-crop', `${MARK.w}x${MARK.h}+${MARK.x}+${MARK.y}`, '+repage',
  '-colorspace', 'gray', '-blur', '0x3', '-threshold', '17%',
  '-morphology', 'Close', 'Disk:6', '-morphology', 'Open', 'Disk:3',
  '-alpha', 'off', t('mono-alpha.png'),
);
magick(
  t('mono-alpha.png'), '-alpha', 'copy', '-channel', 'RGB', '-evaluate', 'set', '100%', '+channel',
  '-resize', `${Math.round(MONO * 0.58)}x`,
  '-background', 'none', '-gravity', 'center', '-extent', `${MONO}x${MONO}`,
  '-strip', `PNG32:${join(imgDir, 'android-icon-monochrome.png')}`,
);

rmSync(tmp, { recursive: true, force: true });
console.log(`Icons generated. Splash / adaptive background colour: ${BG_SOLID}`);
