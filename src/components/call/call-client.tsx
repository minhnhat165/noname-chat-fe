import { useEffect, useState } from 'react';

import { Peer } from 'peerjs';

const CallClient = () => {
  const [peerId, setPeerId] = useState<string>('');
  useEffect(() => {
    if (!peerId) return;
    const peer = new Peer(peerId);
    const conn = peer.connect('another-peers-id');
    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
    });
    peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
      });
      conn.send('Hello!');
    });
  }, [peerId]);

  return (
    <div>
      {peerId}
      <button
        onClick={() => {
          const peerId = prompt('Enter peer id');
          setPeerId(peerId || '');
        }}
      >
        Call
      </button>
    </div>
  );
};
