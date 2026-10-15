import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from './WorkoutShareCard';

/**
 * Capture + delivery for the workout share image. All three paths render the
 * transparent `WorkoutShareCard` to a 1080×1920 PNG (PNG keeps the alpha
 * channel), entirely on-device.
 */

const CAPTURE_SCALE = 3;

export class ShareImageError extends Error {
  constructor(public readonly reason: 'permissionDenied' | 'unavailable') {
    super(reason);
    this.name = 'ShareImageError';
  }
}

function capture(target: RefObject<View | null>, result: 'tmpfile' | 'base64'): Promise<string> {
  return captureRef(target, {
    format: 'png',
    result,
    width: SHARE_CARD_WIDTH * CAPTURE_SCALE,
    height: SHARE_CARD_HEIGHT * CAPTURE_SCALE,
  });
}

/**
 * Put the image on the clipboard. iOS Instagram/Facebook stories paste a
 * clipboard PNG as a movable sticker, transparency included.
 */
export async function copyShareImage(target: RefObject<View | null>): Promise<void> {
  const base64 = await capture(target, 'base64');
  await Clipboard.setImageAsync(base64);
}

/** Save the PNG to the photo library (write-only access). */
export async function saveShareImage(target: RefObject<View | null>): Promise<void> {
  const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) {
    throw new ShareImageError('permissionDenied');
  }
  const uri = await capture(target, 'tmpfile');
  await MediaLibrary.Asset.create(uri);
}

/** Hand the PNG to the OS share sheet. */
export async function shareShareImage(target: RefObject<View | null>): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new ShareImageError('unavailable');
  }
  const uri = await capture(target, 'tmpfile');
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
}
