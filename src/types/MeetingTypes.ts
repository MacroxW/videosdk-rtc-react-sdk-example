/**
 * Meeting Types
 * Types related to meeting state, configuration, and events
 */

export interface MeetingConfig {
  meetingId: string;
  micEnabled: boolean;
  webcamEnabled: boolean;
  name: string;
  multiStream?: boolean;
  customCameraVideoTrack?: MediaStream | null;
  customMicrophoneAudioTrack?: MediaStream | null;
}

export interface MeetingError {
  code: number;
  message: string;
}

export type MeetingState = 
  | 'CONNECTING'
  | 'CONNECTED'
  | 'FAILED'
  | 'DISCONNECTED'
  | 'CLOSING'
  | 'CLOSED';

export type RecordingStatus = 
  | 'RECORDING_STARTED'
  | 'RECORDING_STOPPED'
  | 'RECORDING_STARTING'
  | 'RECORDING_STOPPING';

export interface RecordingStateChanged {
  status: RecordingStatus;
}

export interface MeetingJoinedData {
  meetingId: string;
  participants: Map<string, any>;
}

export interface MeetingLeftData {
  meetingId: string;
}

export interface EntryResponse {
  participantId: string;
  name: 'allowed' | 'denied';
}

export type SideBarMode = 'PARTICIPANTS' | 'CHAT' | null;

export interface RaisedHandParticipant {
  participantId: string;
  raisedHandOn: number;
}
