import { useContext, createContext, useState, useEffect, useRef } from "react";
import { meetingTypes, participantModes } from "./utils/common";

export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

export const MeetingAppProvider = ({ children }) => {
  const [meetingType, setMeetingType] = useState(meetingTypes.MEETING);
  const [participantMode, setParticipantMode] = useState(participantModes.SEND_AND_RECV)
  const [selectedMic, setSelectedMic] = useState({ id: null, label: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null, label: null });
  const [selectedSpeaker, setSelectedSpeaker] = useState({ id: null, label: null });
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = useState(null);
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = useState(null);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);
  const [sideBarMode, setSideBarMode] = useState(null);
  const [pipMode, setPipMode] = useState(false);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef();

    const participantRaisedHand = (participantId) => {
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
        return parseInt(raisedHandOn) + 15000 > parseInt(now);
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
        meetingType,
        participantMode,

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
        setMeetingType,
        setParticipantMode
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};
