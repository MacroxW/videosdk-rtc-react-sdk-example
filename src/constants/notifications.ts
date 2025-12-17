/**
 * Notification Constants
 * Centralized configuration for toast notifications and audio alerts
 */

import { ToastOptions } from 'react-toastify';

export const NOTIFICATION_SOUNDS = {
  RAISE_HAND: 'https://static.videosdk.live/prebuilt/notification.mp3',
  CHAT: 'https://static.videosdk.live/prebuilt/notification.mp3',
  ERROR: 'https://static.videosdk.live/prebuilt/notification_err.mp3',
  CRITICAL_ERROR: 'https://static.videosdk.live/prebuilt/notification_critical_err.mp3',
} as const;

export const TOAST_DEFAULT_CONFIG: ToastOptions = {
  position: 'bottom-left',
  autoClose: 4000,
  hideProgressBar: true,
  closeButton: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
} as const;

export const NOTIFICATION_MESSAGES = {
  RECORDING_STARTED: 'Meeting recording is started',
  RECORDING_STOPPED: 'Meeting recording is stopped.',
  RAISED_HAND: (name: string) => `${name} raised hand 🖐🏼`,
  CHAT_MESSAGE: (name: string, message: string) => `${name} says: ${message}`,
  MEETING_STATE: (state: string) => `Meeting is in ${state} state`,
  JOIN_ERROR: 'Unable to join meeting!',
} as const;
