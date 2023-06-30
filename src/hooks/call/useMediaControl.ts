import { useEffect, useState } from 'react';

export const useMediaControl = (options: {
  defaultVideoEnabled?: boolean;
  defaultAudioEnabled?: boolean;
}) => {
  const [videoEnabled, setVideoEnabled] = useState<boolean>(options.defaultVideoEnabled ?? true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(options.defaultAudioEnabled ?? true);
  const [localMedia, setLocalMedia] = useState<MediaStream | null>(null);
  const toggleVideo = () => {
    localMedia!.getVideoTracks()[0].enabled = !videoEnabled;
    setVideoEnabled(!videoEnabled);
  };
  const toggleAudio = () => {
    localMedia!.getAudioTracks()[0].enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
  };

  useEffect(() => {
    if (localMedia) {
      localMedia.getVideoTracks()[0].enabled = options.defaultVideoEnabled ?? true;
      localMedia.getAudioTracks()[0].enabled = options.defaultAudioEnabled ?? true;
    }
  }, [localMedia, options.defaultAudioEnabled, options.defaultVideoEnabled]);

  return {
    videoEnabled,
    audioEnabled,
    toggleVideo,
    toggleAudio,
    localMedia,
    setLocalMedia,
  };
};
