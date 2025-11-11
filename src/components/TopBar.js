import { OutlinedButton } from "../components/buttons/OutlinedButton";
import liveHLS from "../static/animations/live-hls.json";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import { MobileIconButton } from "../components/buttons/MobileIconButton";
import OutlineIconTextButton from "../components/buttons/OutlineIconTextButton";
import useIsHls from "../hooks/useIsHls";
import LiveIcon from "../icons/LiveIcon";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { meetingTypes, participantModes } from "../utils/common";
import recordingBlink from "../static/animations/recording-blink.json";
import useIsRecording from "../hooks/useIsRecording";
import RecordingIcon from "../icons/Bottombar/RecordingIcon";


export function TopBar({ topBarHeight }) {
  const { setParticipantMode, meetingType, participantMode } = useMeetingAppContext();

  const isHls = useIsHls()

  const RecordingBTN = () => {
    const { startRecording, stopRecording, recordingState } = useMeeting();
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: recordingBlink,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
      height: 64,
      width: 160,
    };

    const isRecording = useIsRecording();
    const isRecordingRef = useRef(isRecording);

    useEffect(() => {
      isRecordingRef.current = isRecording;
    }, [isRecording]);

    const { isRequestProcessing } = useMemo(
      () => ({
        isRequestProcessing:
          recordingState === Constants.recordingEvents.RECORDING_STARTING ||
          recordingState === Constants.recordingEvents.RECORDING_STOPPING,
      }),
      [recordingState]
    );


    return (
      <OutlinedButton
        Icon={RecordingIcon}
        isFocused={isRecording}
        lottieOption={isRecording ? defaultOptions : null}
        isRequestProcessing={isRequestProcessing}
      />
    );
  };



  const WebrtcViewerSwitchBTN = ({ isMobile, isTab }) => {
    const { meeting, changeMode } = useMeeting({
      onParticipantModeChanged: ({ mode, participantId }) => {
        if (participantId === meeting.localParticipant.id) {
          setParticipantMode(mode)
        }
      }
    });

    const _handleClick = () => {
      if (meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV) {
        if (meetingType === meetingTypes.ILS) {
          changeMode(Constants.modes.RECV_ONLY);
        } else {
          changeMode(Constants.modes.SIGNALLING_ONLY)
        }
      } else {
        changeMode(Constants.modes.SEND_AND_RECV);
      }
    };

    return isMobile || isTab ? (
      <MobileIconButton
        onClick={_handleClick}
        tooltipTitle={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? meetingType === meetingTypes.ILS ? "Switch to RECV_ONLY Mode" : "Switch to SIGNALLING_ONLY Mode"
            : "Switch to SEND_AND_RECV Mode"
        }
        Icon={LiveIcon}
        buttonText={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? meetingType === meetingTypes.ILS ? "Switch to RECV_ONLY Mode" : "Switch to SIGNALLING_ONLY Mode"
            : "Switch to SEND_AND_RECV Mode"
        }
      />
    ) : (
      <OutlineIconTextButton
        onClick={_handleClick}
        buttonText={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? meetingType === meetingTypes.ILS ? "Switch to RECV_ONLY Mode" : "Switch to SIGNALLING_ONLY Mode"
            : "Switch to SEND_AND_RECV Mode"
        }
      />
    );
  };


  const HLSBTN = ({ isMobile, isTab }) => {
    const { hlsState } = useMeeting({});

    const isHls = useIsHls();

    const { isRequestProcessing } = useMemo(
      () => ({
        isRequestProcessing:
          hlsState === Constants.hlsEvents.HLS_STARTING ||
          hlsState === Constants.hlsEvents.HLS_STOPPING,
      }),
      [hlsState]
    );

    const { type, priority, gridSize } = useMemo(
      () => ({
        type: "SPOTLIGHT",
        priority: "PIN",
        gridSize: "12",
      }),
      []
    );

    const typeRef = useRef(type);
    const priorityRef = useRef(priority);
    const gridSizeRef = useRef(gridSize);
    const isHlsRef = useRef(isHls);

    useEffect(() => {
      typeRef.current = type;
    }, [type]);

    useEffect(() => {
      priorityRef.current = priority;
    }, [priority]);

    useEffect(() => {
      gridSizeRef.current = gridSize;
    }, [gridSize]);

    useEffect(() => {
      isHlsRef.current = isHls;
    }, [isHls]);

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: liveHLS,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
      height: 64,
      width: 170,
    };

    return isMobile || isTab ? (
      <MobileIconButton
        isFocused={isHls}
        lottieOption={isHls ? defaultOptions : null}
      />
    ) : (
      <OutlineIconTextButton
      
        buttonText={
          hlsState === Constants.hlsEvents.HLS_STARTED ||
          hlsState === Constants.hlsEvents.HLS_PLAYABLE
            ? "Stop HLS"
            : hlsState === Constants.hlsEvents.HLS_STARTING
            ? "Starting HLS"
            : hlsState === Constants.hlsEvents.HLS_STOPPED
            ? "Start HLS"
            : hlsState === Constants.hlsEvents.HLS_STOPPING
            ? "Stopping HLS"
            : "Start HLS"
        }
        lottieOption={isHls ? defaultOptions : null}
        isRequestProcessing={isRequestProcessing}
      />
    );
  };

  const isRecording = useIsRecording()
  return (
    <div className=" w-full justify-end items-center flex md:flex md:items-center md:justify-end xl:pt-2  lg:px-2 xl:px-6 pb-0 px-2 ">
      {/* <RecordingBTN /> */}
      {isRecording && <RecordingBTN />}
      {meetingType === meetingTypes.HLS && isHls && <HLSBTN />}
      {meetingType != meetingTypes.MEETING && <WebrtcViewerSwitchBTN />}
    </div>
  );
}
