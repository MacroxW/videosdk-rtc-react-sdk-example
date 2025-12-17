/**
 * Participants Context
 * Manages participants state (raised hands)
 */

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { RaisedHandParticipant } from '../types';
import { TIMEOUTS } from '../constants';

interface ParticipantsContextType {
  raisedHandsParticipants: RaisedHandParticipant[];
  setRaisedHandsParticipants: (participants: RaisedHandParticipant[]) => void;
  useRaisedHandParticipants: () => {
    participantRaisedHand: (participantId: string) => void;
  };
}

interface ParticipantsProviderProps {
  children: React.ReactNode;
}

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(undefined);

export const useParticipantsContext = (): ParticipantsContextType => {
  const context = useContext(ParticipantsContext);
  if (!context) {
    throw new Error('useParticipantsContext must be used within ParticipantsProvider');
  }
  return context;
};

export const ParticipantsProvider: React.FC<ParticipantsProviderProps> = ({ children }) => {
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<RaisedHandParticipant[]>([]);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<RaisedHandParticipant[]>([]);

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return raisedHandOn + TIMEOUTS.RAISED_HAND_DURATION > now;
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  return (
    <ParticipantsContext.Provider
      value={{
        raisedHandsParticipants,
        setRaisedHandsParticipants,
        useRaisedHandParticipants,
      }}
    >
      {children}
    </ParticipantsContext.Provider>
  );
};
