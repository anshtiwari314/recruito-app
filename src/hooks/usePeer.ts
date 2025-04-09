import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const usePeer = (peerId = null, options = {}) => {
  const peerRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    // Initialize PeerJS instance
    const peer = new Peer(peerId, options);
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("Peer connected with ID:", id);
      setIsConnected(true);
    });

    peer.on("connection", (conn) => {
      console.log("Incoming connection:", conn.peer);
      setConnections((prev) => [...prev, conn]);

      conn.on("data", (data) => {
        console.log("Received data:", data);
      });

      conn.on("close", () => {
        console.log("Connection closed with peer:", conn.peer);
        setConnections((prev) => prev.filter((c) => c.peer !== conn.peer));
      });
    });

    peer.on("disconnected", () => {
      console.log("Peer disconnected");
      setIsConnected(false);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    // Cleanup function
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [peerId, options]);

  const connectToPeer = (remotePeerId) => {
    if (!peerRef.current) return null;
    const conn = peerRef.current.connect(remotePeerId);
    conn.on("open", () => {
      console.log("Connection established with peer:", remotePeerId);
      setConnections((prev) => [...prev, conn]);
    });

    conn.on("data", (data) => {
      console.log("Received data from peer:", data);
    });

    conn.on("close", () => {
      console.log("Connection closed with peer:", remotePeerId);
      setConnections((prev) => prev.filter((c) => c.peer !== remotePeerId));
    });

    return conn;
  };

  const sendToPeer = (data, conn) => {
    if (conn && conn.open) {
      conn.send(data);
    } else {
      console.error("Connection is not open");
    }
  };

  return {
    peer: peerRef.current,
    isConnected,
    connections,
    connectToPeer,
    sendToPeer,
  };
};

export default usePeer;
