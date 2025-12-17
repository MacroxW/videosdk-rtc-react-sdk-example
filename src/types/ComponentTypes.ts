/**
 * Component Props Types
 * Types for component props throughout the application
 */

import { Device } from './DeviceTypes';
import { SideBarMode } from './MeetingTypes';

// App Component
export interface AppProps {}

// Meeting Container
export interface MeetingContainerProps {
  onMeetingLeave: () => void;
  setIsMeetingLeft: (left: boolean) => void;
}

// Joining Screen
export interface JoiningScreenProps {
  participantName: string;
  setParticipantName: (name: string) => void;
  setMeetingId: (id: string) => void;
  setToken: (token: string) => void;
  micOn: boolean;
  setMicOn: (on: boolean) => void;
  webcamOn: boolean;
  setWebcamOn: (on: boolean) => void;
  customAudioStream: MediaStream | null;
  setCustomAudioStream: (stream: MediaStream | null) => void;
  customVideoStream: MediaStream | null;
  setCustomVideoStream: (stream: MediaStream | null) => void;
  onClickStartMeeting: () => void;
  startMeeting: boolean;
  setIsMeetingLeft: (left: boolean) => void;
}

// Leave Screen
export interface LeaveScreenProps {
  setIsMeetingLeft: (left: boolean) => void;
}

// Bottom Bar
export interface BottomBarProps {
  bottomBarHeight: number;
  setIsMeetingLeft: (left: boolean) => void;
}

// Sidebar Container
export interface SidebarContainerProps {
  height: number;
  sideBarContainerWidth: number;
}

// Participant View
export interface ParticipantViewProps {
  isPresenting: boolean;
}

export interface ParticipantGridProps {
  isPresenting: boolean;
}

// Presenter View
export interface PresenterViewProps {
  height: number;
}

// Confirm Box
export interface ConfirmBoxProps {
  open: boolean;
  successText: string;
  onSuccess: () => void;
  title: string;
  subTitle: string;
  rejectText?: string;
  onReject?: () => void;
}

// Dropdown Components
export interface DropDownProps {
  options: Device[];
  value: Device;
  onChange: (device: Device) => void;
}

// Button Components
export interface MobileIconButtonProps {
  onClick: () => void;
  Icon: React.ComponentType<any>;
  buttonText?: string;
  isFocused?: boolean;
  bgColor?: string;
  focusBGColor?: string;
  disabled?: boolean;
  large?: boolean;
}

export interface OutlinedButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  large?: boolean;
}

// Network Stats
export interface NetworkStatsProps {
  participantId?: string;
}

// Waiting Screen
export interface WaitingToJoinScreenProps {}

// Meeting Details Screen
export interface MeetingDetailsScreenProps {
  onClickJoin: () => void;
  _handleOnCreateMeeting: () => void;
  participantName: string;
  setParticipantName: (name: string) => void;
  videoTrack: MediaStreamTrack | null;
  setVideoTrack: (track: MediaStreamTrack | null) => void;
  onClickStartMeeting: () => void;
  setMeetingMode: (mode: string) => void;
  meetingMode: string;
}
