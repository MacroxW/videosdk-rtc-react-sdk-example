/**
 * Participant Types
 * Types related to meeting participants
 */

export interface ParticipantStream {
  id: string;
  track: MediaStreamTrack;
  codec?: string;
}

export interface Participant {
  id: string;
  displayName: string;
  isLocal: boolean;
  mode?: 'CONFERENCE' | 'VIEWER';
  quality?: 'low' | 'med' | 'high';
  micStream?: ParticipantStream | null;
  webcamStream?: ParticipantStream | null;
  shareStream?: ParticipantStream | null;
  micOn?: boolean;
  webcamOn?: boolean;
  screenShareOn?: boolean;
  isActiveSpeaker?: boolean;
  pinState?: {
    cam: boolean;
    share: boolean;
  };
}

export interface ParticipantJoinedData {
  participant: Participant;
}

export interface ParticipantLeftData {
  participantId: string;
}

export interface StreamEnabledData {
  participantId: string;
  stream: ParticipantStream;
}

export interface StreamDisabledData {
  participantId: string;
  streamId: string;
}

export interface PubSubMessage {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
  topic: string;
}

export interface ChatMessage extends PubSubMessage {
  topic: 'CHAT';
}

export interface RaiseHandMessage {
  senderId: string;
  senderName: string;
  topic: 'RAISE_HAND';
}
