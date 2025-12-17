/**
 * Meeting App Context (Composed)
 * Composes all sub-contexts into a single provider for convenience
 */

import React from 'react';
import { DeviceProvider } from './DeviceContext';
import { UIProvider } from './UIContext';
import { ParticipantsProvider } from './ParticipantsContext';

interface MeetingAppProviderProps {
  children: React.ReactNode;
}

export const MeetingAppProvider: React.FC<MeetingAppProviderProps> = ({ children }) => {
  return (
    <DeviceProvider>
      <UIProvider>
        <ParticipantsProvider>
          {children}
        </ParticipantsProvider>
      </UIProvider>
    </DeviceProvider>
  );
};

// Re-export hooks for convenience
export { useDeviceContext } from './DeviceContext';
export { useUIContext } from './UIContext';
export { useParticipantsContext } from './ParticipantsContext';
