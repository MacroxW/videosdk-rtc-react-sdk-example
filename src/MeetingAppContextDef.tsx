import { useContext, createContext, useState, useEffect, useRef } from "react";
import type { MeetingAppContextType, MeetingAppProviderProps, Device, SideBarMode, RaisedHandParticipant } from "./types";

export const MeetingAppContext = createContext<MeetingAppContextType | undefined>(undefined);

export const useMeetingAppContext = (): MeetingAppContextType => {
  const context = useContext(MeetingAppContext);
  if (!context) {
    throw new Error('useMeetingAppContext must be used within MeetingAppProvider');
  }
  return context;
};

export const MeetingAppProvider: React.FC<MeetingAppProviderProps> = ({ children }) => {
  const [selectedMic, setSelectedMic] = useState<Device>({ id: null, label: null });
  const [selectedWebcam, setSelectedWebcam] = useState<Device>({ id: null, label: null });
  const [selectedSpeaker, setSelectedSpeaker] = useState<Device>({ id: null, label: null });
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = useState<boolean | null>(null);
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = useState<boolean | null>(null);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<RaisedHandParticipant[]>([]);
  const [sideBarMode, setSideBarMode] = useState<SideBarMode>(null);
  const [pipMode, setPipMode] = useState<boolean>(false);

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
        return raisedHandOn + 15000 > now;
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
    <MeetingAppContext.Provider
      value={{
        // states

        raisedHandsParticipants,
        selectedMic,
        selectedWebcam,
        selectedSpeaker,
        sideBarMode,
        pipMode,
        isCameraPermissionAllowed,
        isMicrophonePermissionAllowed,

        // setters

        setRaisedHandsParticipants,
        setSelectedMic,
        setSelectedWebcam,
        setSelectedSpeaker,
        setSideBarMode,
        setPipMode,
        useRaisedHandParticipants,
        setIsCameraPermissionAllowed,
        setIsMicrophonePermissionAllowed,
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};
