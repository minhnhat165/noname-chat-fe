'use-client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Peer from 'peerjs';
import { useCallAction } from './use-call-action';
import { useMediaControl } from './useMediaControl';
import { useSocketStore } from '@/stores/socket';

type CallPayload = {
  _id: string;
  host: string;
  peerId: string;
  participants: string[];
};
type Options = {
  onRejected?: () => void;
  onAccepted?: () => void;
  onEnded?: () => void;
};
export const usePeerJs = (
  callId: string,
  isCaller: boolean,
  userId: string,
  participants: string[],
  isAccepted?: boolean,
  options?: Options,
) => {
  const socket = useSocketStore((state) => state.socket);
  const [hasRemoteStream, setHasRemoteStream] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { acceptCall, rejectCall, endCall, acceptCallLoading, endCallLoading, rejectCallLoading } =
    useCallAction({
      onEndSuccess: () => {
        peer?.destroy();
      },
      onAcceptSuccess: () => {
        connectPeer(peerId!);
      },
    });
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
          setPeerId(peerIdFromServer);
        }
      });
      socket.on('call-rejected', () => {
        options?.onRejected?.();
      });
      socket.on('call-ended', () => {
        setIsEnded(true);
        options?.onEnded?.();
      });
    }
    return () => {
      if (socket) {
        socket.off(`join-call`);
        socket.off(`signal`);
        socket.off(`user-joined`);
        socket.off('call-rejected');
        socket.off('call-ended');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    acceptCall,
    rejectCall,
    acceptCallLoading,
    rejectCallLoading,
    endCallLoading,
    isEnded,
    setIsEnded,
  };
};
