'use-client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Peer from 'peerjs';
import { useMediaControl } from './useMediaControl';
import { useSocketStore } from '@/stores/socket';

type CallPayload = {
  _id: string;
  host: string;
  peerId: string;
  participants: string[];
};
export const usePeerJs = (
  callId: string,
  isCaller: boolean,
  userId: string,
  participants: string[],
  isAccepted?: boolean,
) => {
  const socket = useSocketStore((state) => state.socket);
  const [hasRemoteStream, setHasRemoteStream] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localMedia, setLocalMedia, audioEnabled, toggleAudio, toggleVideo, videoEnabled } =
    useMediaControl({
      defaultVideoEnabled: true,
      defaultAudioEnabled: false,
    });

  const getUserMedia = useCallback(
    async (constraints: MediaStreamConstraints): Promise<MediaStream | null> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalMedia(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }
        return stream;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const initializePeer = async () => {
    const localMedia = await getUserMedia({ video: true, audio: true });
    if (!localMedia) {
      return;
    }
    const newPeer = new Peer();
    setPeer(newPeer);

    newPeer.on('connection', (conn) => {
      console.log('connection');
    });

    newPeer.on('open', (id) => {
      setPeerId(id);
      if (isCaller) {
        const callPayload: CallPayload = {
          _id: callId,
          host: userId,
          peerId: id,
          participants,
        };
        socket?.emit('create-call', callPayload);
      }
    });

    newPeer.on('error', (err) => {
      console.log('error', err);
    });

    newPeer.on('call', (call) => {
      const userId = call.peer;
      call.answer(localMedia);
      call.on('stream', (stream) => {
        if (remoteVideoRef.current) {
          setHasRemoteStream(true);
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play();
        }
      });
    });
  };

  useEffect(() => {
    initializePeer();
    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit(`join-call`, {
        callId,
        userId,
      });
      socket.on('receive-peer-id', (peerIdFromServer) => {
        if (peerIdFromServer) {
          console.log('receive-peer-id', peerIdFromServer);
          setPeerId(peerIdFromServer);
        }
      });
      socket.on('call-ended', () => {
        setIsEnded(true);
        console.log('call-ended');
      });
    }
    return () => {
      if (socket) {
        socket.off(`join-call`);
        socket.off(`signal`);
        socket.off(`user-joined`);
        socket.emit(`leave-call`, callId);
      }
    };
  }, [callId, isCaller, peerId, socket, userId]);

  const connectPeer = async (peerIds: string) => {
    if (peer && peerId) {
      const conn = peer.connect(peerId);
      const call = peer.call(peerId, localMedia!);
      call.on('stream', (stream) => {
        if (remoteVideoRef.current) {
          setHasRemoteStream(true);
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play();
        }
      });
    } else {
      console.log('peer is null', callId);
    }
  };

  const endCall = () => {
    if (peer) {
      socket?.emit('end-call', callId);
      peer.destroy();
    }
  };

  useEffect(() => {
    if (isAccepted && peer && peerId) {
      if (peerId) {
        connectPeer(peerId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccepted, peer, peerId]);

  return {
    peer,
    peerId,
    connectPeer,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    videoEnabled,
    audioEnabled,
    hasRemoteStream,
    endCall,
    isEnded,
    setIsEnded,
  };
};
