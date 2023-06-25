'use-client';

import Peer, { MediaConnection } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';

export const usePeerJs = () => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [userId: string]: HTMLVideoElement | null }>({});
  const [localMedia, setLocalMedia] = useState<MediaStream | null>(null);
  const [calls, setCalls] = useState<{ [userId: string]: MediaConnection }>({});

  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalMedia(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const initializePeer = () => {
      const newPeer = new Peer();
      setPeer(newPeer);

      newPeer.on('connection', (conn) => {
        console.log('connection');
      });

      newPeer.on('open', (id) => {
        console.log('open', id);
      });

      newPeer.on('error', (err) => {
        console.log('error', err);
      });

      newPeer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          const userId = call.peer;
          const existingCall = calls[userId];
          if (existingCall) {
            existingCall.close();
          }

          setCalls((prevCalls) => ({ ...prevCalls, [userId]: call }));

          call.answer(stream);
          setLocalMedia(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
          }
          call.on('stream', (stream) => {
            const remoteVideoRef = remoteVideoRefs.current[userId];
            if (remoteVideoRef) {
              remoteVideoRef.srcObject = stream;
              remoteVideoRef.play();
            }
          });
        });
      });
    };

    initializePeer();

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  const connectPeer = useCallback(
    async (callId: string, remoteVideoRef: HTMLVideoElement) => {
      if (peer) {
        const conn = peer.connect(callId);
        const localMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const call = peer.call(callId, localMedia);
        setLocalMedia(localMedia);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localMedia;
          localVideoRef.current.play();
        }
        call.on('stream', (stream) => {
          remoteVideoRef.srcObject = stream;
          remoteVideoRef.play();
        });

        setCalls((prevCalls) => ({ ...prevCalls, [callId]: call }));
        remoteVideoRefs.current[callId] = remoteVideoRef;
      } else {
        console.log('peer is null', callId);
      }
    },
    [peer],
  );

  const toggleVideo = () => {
    if (localMedia) {
      const videoTrack = localMedia.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleAudio = () => {
    if (localMedia) {
      const audioTrack = localMedia.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  return {
    peer,
    connectPeer,
    localVideoRef,
    remoteVideoRefs,
    toggleVideo,
    toggleAudio,
  };
};
