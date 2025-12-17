/**
 * Contexts Index
 * Central export point for all React contexts
 */

// Main composed provider
export { MeetingAppProvider, useMeetingAppContext } from './MeetingAppContext';

// Individual context providers and hooks
export { DeviceProvider, useDeviceContext } from './DeviceContext';
export { UIProvider, useUIContext } from './UIContext';
export { ParticipantsProvider, useParticipantsContext } from './ParticipantsContext';
