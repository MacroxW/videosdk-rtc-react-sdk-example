import { createCameraVideoTrack , createMicrophoneAudioTrack } from "@videosdk.live/react-sdk";

const useMediaStream = () => {

  type videTrackProps = {
    webcamId: string,
    encoderConfig?:
    | 'h90p_w160p'
    | 'h180p_w320p'
    | 'h216p_w384p'
    | 'h360p_w640p'
    | 'h360p_w640p_150kbps'
    | 'h540p_w960p'
    | 'h720p_w1280p'
    | 'h1080p_w1920p'
    | 'h1440p_w2560p'
    | 'h2160p_w3840p'
    | 'h120p_w160p'
    | 'h180p_w240p'
    | 'h240p_w320p'
    | 'h360p_w480p'
    | 'h480p_w640p'
    | 'h540p_w720p'
    | 'h720p_w960p'
    | 'h1080p_w1440p'
    | 'h1440p_w1920p'
    | undefined;
  }

  const getVideoTrack = async ({ webcamId, encoderConfig = "h540p_w960p" }: videTrackProps) => {
    try {
      const track = await createCameraVideoTrack({
        cameraId: webcamId ,
        encoderConfig,
        optimizationMode: "motion",
        multiStream: false,
      });

      return track;
    } catch(error) {
      return null;
    }
  };

  const getAudioTrack = async ({micId}) => {
    try{
      const track = await createMicrophoneAudioTrack({
        microphoneId: micId
      });
      return track;
    } catch(error) {
      return null;
    }
  };

  return { getVideoTrack,getAudioTrack };
};

export default useMediaStream;
