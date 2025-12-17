/**
 * Notification Service
 * Centralized service for handling notifications and audio alerts
 */

import { toast } from 'react-toastify';
import { NOTIFICATION_SOUNDS, TOAST_DEFAULT_CONFIG } from '../constants';

export class NotificationService {
  /**
   * Play an audio notification
   */
  static playSound(soundUrl: string): void {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.error('Error creating audio element:', error);
    }
  }

  /**
   * Show a toast notification
   */
  static showToast(message: string, options = {}): void {
    toast(message, {
      ...TOAST_DEFAULT_CONFIG,
      ...options,
    });
  }

  /**
   * Show success notification with sound
   */
  static success(message: string): void {
    this.showToast(message);
    this.playSound(NOTIFICATION_SOUNDS.CHAT);
  }

  /**
   * Show error notification with sound
   */
  static error(message: string, isCritical = false): void {
    this.showToast(message);
    this.playSound(
      isCritical ? NOTIFICATION_SOUNDS.CRITICAL_ERROR : NOTIFICATION_SOUNDS.ERROR
    );
  }

  /**
   * Show info notification with sound
   */
  static info(message: string): void {
    this.showToast(message);
  }

  /**
   * Show notification for raised hand
   */
  static raiseHand(participantName: string): void {
    this.showToast(`${participantName} raised hand 🖐🏼`);
    this.playSound(NOTIFICATION_SOUNDS.RAISE_HAND);
  }

  /**
   * Show notification for chat message
   */
  static chatMessage(senderName: string, message: string): void {
    this.showToast(`${senderName} says: ${message}`);
    this.playSound(NOTIFICATION_SOUNDS.CHAT);
  }

  /**
   * Show notification for recording state change
   */
  static recordingStateChanged(isStarted: boolean): void {
    const message = isStarted
      ? 'Meeting recording is started'
      : 'Meeting recording is stopped.';
    this.showToast(message);
  }

  /**
   * Show notification for meeting state change
   */
  static meetingStateChanged(state: string): void {
    this.showToast(`Meeting is in ${state} state`);
  }
}
