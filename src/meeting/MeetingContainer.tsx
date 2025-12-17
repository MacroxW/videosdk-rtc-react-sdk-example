import React, { useState, useEffect, useRef, createRef, memo } from "react";
import { Constants, useMeeting, useParticipant, usePubSub } from "@videosdk.live/react-sdk";
import { BottomBar } from "./components/BottomBar";
import { SidebarConatiner } from "../components/sidebar/SidebarContainer";
import MemorizedParticipantView from "./components/ParticipantView";
import { PresenterView } from "../components/PresenterView";
import { nameTructed, trimSnackBarText } from "../utils/helper";
import WaitingToJoinScreen from "../components/screens/WaitingToJoinScreen";
import ConfirmBox from "../components/ConfirmBox";
import useIsMobile from "../hooks/useIsMobile";
import useIsTab from "../hooks/useIsTab";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import { useDeviceContext, useParticipantsContext } from "../contexts";
import { NotificationService } from "../services/notificationService";
import { LAYOUT, TIMEOUTS, ERROR_CODES } from "../constants";
import type { MeetingContainerProps, MeetingError } from "../types";

export function MeetingContainer({
  onMeetingLeave,
  setIsMeetingLeft,
}: MeetingContainerProps): React.ReactElement {
  const {
    setSelectedMic,
    setSelectedWebcam,
    setSelectedSpeaker,
  } = useDeviceContext();

  const [participantsData, setParticipantsData] = useState<string[]>([]);

  const ParticipantMicStream = memo(({ participantId }: { participantId: string }) => {
    // Individual hook for each participant
    const { micStream, isLocal } = useParticipant(participantId);

    useEffect(() => {

      if (micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        const audioElement = new Audio();
        audioElement.srcObject = mediaStream;
        audioElement.muted = isLocal
        audioElement.play();

      }
    }, [micStream, participantId]);

    return null;
  });

  const { useRaisedHandParticipants } = useParticipantsContext();
  const bottomBarHeight = LAYOUT.BOTTOM_BAR_HEIGHT;

  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] = useState<boolean | null>(null);
  const [meetingErrorVisible, setMeetingErrorVisible] = useState<boolean>(false);
  const [meetingError, setMeetingError] = useState<MeetingError | null>(null);

  const mMeetingRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeightRef = useRef<number>(0);
  const containerWidthRef = useRef<number>(0);

  useEffect(() => {
    containerHeightRef.current = containerHeight;
    containerWidthRef.current = containerWidth;
  }, [containerHeight, containerWidth]);

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  const sideBarContainerWidth = isXLDesktop
    ? 400
    : isLGDesktop
      ? 360
      : isTab
        ? 320
        : isMobile
          ? 280
          : 240;

  useEffect(() => {
    containerRef.current?.offsetHeight &&
      setContainerHeight(containerRef.current.offsetHeight);
    containerRef.current?.offsetWidth &&
      setContainerWidth(containerRef.current.offsetWidth);

    window.addEventListener("resize", ({ target }) => {
      containerRef.current?.offsetHeight &&
        setContainerHeight(containerRef.current.offsetHeight);
      containerRef.current?.offsetWidth &&
        setContainerWidth(containerRef.current.offsetWidth);
    });
  }, [containerRef]);

  const { participantRaisedHand } = useRaisedHandParticipants();

  const _handleMeetingLeft = () => {
    setIsMeetingLeft(true);
  };

  const _handleOnRecordingStateChanged = ({ status }: { status: string }) => {
    const isStarted = status === Constants.recordingEvents.RECORDING_STARTED;
    if (isStarted || status === Constants.recordingEvents.RECORDING_STOPPED) {
      NotificationService.recordingStateChanged(isStarted);
    }
  };

  function onParticipantJoined(participant) {
    // Change quality to low, med or high based on resolution
    participant && participant.setQuality("high");
  }


  function onEntryResponded({ participantId, decision }: { participantId: string; decision: string }) {
    if (mMeetingRef.current?.localParticipant?.id === participantId) {
      if (decision === "allowed") {
        setLocalParticipantAllowedJoin(true);
      } else {
        setLocalParticipantAllowedJoin(false);
        setTimeout(() => {
          _handleMeetingLeft();
        }, TIMEOUTS.DENIED_ENTRY_REDIRECT);
      }
    }
  }

  function onMeetingJoined() {
    console.log("onMeetingJoined");
  }

  function onMeetingLeft() {
    setSelectedMic({ id: null, label: null })
    setSelectedWebcam({ id: null, label: null })
    setSelectedSpeaker({ id: null, label: null })
    onMeetingLeave();
  }

  const _handleOnError = ({ code, message }: { code: string; message: string }) => {
    console.log("meetingErr", code, message)

    const codeNum = parseInt(code);
    const isJoiningError = ERROR_CODES.JOINING_ERRORS.includes(codeNum as any);
    const isCriticalError = code.startsWith(ERROR_CODES.CRITICAL_ERROR_PREFIX);

    NotificationService.error(
      isJoiningError ? "Unable to join meeting!" : message,
      isCriticalError
    );

    setMeetingErrorVisible(true);
    setMeetingError({
      code: codeNum,
      message: isJoiningError ? "Unable to join meeting!" : message,
    });
  };

  const mMeeting = useMeeting({
    onParticipantJoined,
    onEntryResponded,
    onMeetingJoined,
    onMeetingStateChanged: ({state}) => {
      NotificationService.meetingStateChanged(state);
    },
    onMeetingLeft,
    onError: _handleOnError,
    onRecordingStateChanged: _handleOnRecordingStateChanged,
  });

  const isPresenting = mMeeting.presenterId ? true : false;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const participantIds = Array.from(mMeeting.participants.keys());
      console.log("Debounced participantIds", participantIds);

      setParticipantsData(participantIds);
      console.log("Setting participants");
    }, TIMEOUTS.PARTICIPANT_DEBOUNCE);


    return () => clearTimeout(debounceTimeout);
  }, [mMeeting.participants]);


  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);


  usePubSub("RAISE_HAND", {
    onMessageReceived: (data) => {
      const localParticipantId = mMeeting?.localParticipant?.id;
      const { senderId, senderName } = data;
      const isLocal = senderId === localParticipantId;

      const displayName = isLocal ? "You" : nameTructed(senderName, 15);
      NotificationService.raiseHand(displayName);
      participantRaisedHand(senderId);
    },
  });

  usePubSub("CHAT", {
    onMessageReceived: (data) => {
      const localParticipantId = mMeeting?.localParticipant?.id;
      const { senderId, senderName, message } = data;
      const isLocal = senderId === localParticipantId;

      if (!isLocal) {
        NotificationService.chatMessage(nameTructed(senderName, 15), trimSnackBarText(message));
      }
    },
  });

  return (
    <div className="fixed inset-0">
      <div ref={containerRef} className="h-full flex flex-col bg-gray-800">
        {typeof localParticipantAllowedJoin === "boolean" ? (
          localParticipantAllowedJoin ? (
            <>
              <div className={` flex flex-1 flex-row bg-gray-800 `}>
                <div className={`flex flex-1 `}>
                  {isPresenting ? (
                    <PresenterView height={containerHeight - bottomBarHeight} />
                  ) : null}
                  {isPresenting && isMobile ? (
                    participantsData.map((participantId) => (
                      <ParticipantMicStream key={participantId} participantId={participantId} />
                    ))
                  ) : (
                    <MemorizedParticipantView isPresenting={isPresenting} />
                  )}
                </div>

                <SidebarConatiner
                  height={containerHeight - bottomBarHeight}
                  sideBarContainerWidth={sideBarContainerWidth}
                />
              </div>

              <BottomBar
                bottomBarHeight={bottomBarHeight}
                setIsMeetingLeft={setIsMeetingLeft}
              />
            </>
          ) : (
            <></>
          )
        ) : (
          <WaitingToJoinScreen />
        )}
        {meetingError && (
          <ConfirmBox
            open={meetingErrorVisible}
            successText="OKAY"
            onSuccess={() => {
              setMeetingErrorVisible(false);
            }}
            title={`Error Code: ${meetingError.code}`}
            subTitle={meetingError.message}
            rejectText=""
            onReject={() => {}}
            subTitleColor=""
          />
        )}
      </div>
    </div>
  );
}
