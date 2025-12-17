/**
 * UI Context
 * Manages UI state (sidebar mode, PiP mode)
 */

import { createContext, useContext, useState } from 'react';
import type { SideBarMode } from '../types';

interface UIContextType {
  sideBarMode: SideBarMode;
  setSideBarMode: (mode: SideBarMode) => void;
  pipMode: boolean;
  setPipMode: (enabled: boolean) => void;
}

interface UIProviderProps {
  children: React.ReactNode;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIProvider');
  }
  return context;
};

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [sideBarMode, setSideBarMode] = useState<SideBarMode>(null);
  const [pipMode, setPipMode] = useState<boolean>(false);

  return (
    <UIContext.Provider
      value={{
        sideBarMode,
        setSideBarMode,
        pipMode,
        setPipMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
