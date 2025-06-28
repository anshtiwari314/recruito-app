import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useData } from '../context/DataWrapper';

const WS_URL = 'http://localhost:3000';
const INTERVAL_MS = 2000;
const RECONNECT_DELAY = 60000;

const WINDOW_SIZE = 10;
const VIDEO_THRESHOLD = 1.5;
const AUDIO_THRESHOLD = 0.3;
const JITTER_THRESHOLD = 3.0;

const PACKET_SIZES = [4 * 1024, 8 * 1024, 16 * 1024];

const DEBUG = false; // 🔕 set to true to see logs

const useNetworkMonitor = () => {
  const { setConnStatus }: any = useData();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const historyRef = useRef<number[]>([]);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastStatus = useRef<string | null>(null);
  const sameStatusCount = useRef<number>(0);
  const currentSizeIndex = useRef(0);

  const debugLog = (...args: any[]) => {
    if (DEBUG) console.log(...args);
  };

  const applyConnStatus = (newStatus: 'stable' | 'unstable' | 'critical') => {
    if (lastStatus.current === newStatus) {
      sameStatusCount.current++;
    } else {
      sameStatusCount.current = 1;
      lastStatus.current = newStatus;
    }

    if (sameStatusCount.current >= 2) {
      debugLog('📶 Updated connStatus:', newStatus);
      setConnStatus(newStatus);
    }
  };

  const scheduleReconnect = () => {
    if (reconnectTimeout.current) return;
    reconnectTimeout.current = setTimeout(() => {
      reconnectTimeout.current = null;
      debugLog('🔁 Attempting socket reconnect...');
      connectSocket();
    }, RECONNECT_DELAY);
  };

  const connectSocket = () => {
    if (socket?.connected) return;

    if (socket) {
      socket.disconnect();
    }

    const sock = io(WS_URL, {
      transports: ['websocket'],
      reconnection: false,
    });

    sock.on('connect', () => {
      debugLog('✅ Connected to server');
      setConnected(true);
      applyConnStatus('stable');
    });

    sock.on('disconnect', () => {
      debugLog('❌ Disconnected from server');
      setConnected(false);
      applyConnStatus('critical');
      scheduleReconnect();
    });

    sock.on('speed-pong', (data) => {
      const sentTime = data.timestamp;
      const now = performance.now();
      const duration = (now - sentTime) / 1000;

      const packetSizeBits = (data.size || 16 * 1024) * 8;
      const mbps = packetSizeBits / duration / 1024 / 1024;

      const next = [...historyRef.current.slice(-WINDOW_SIZE + 1), mbps];
      historyRef.current = next;

      const avg = next.reduce((a, b) => a + b, 0) / next.length;
      const max = Math.max(...next);
      const min = Math.min(...next);
      const jitter = max - min;

      debugLog(
        `📡 Speed: ${mbps.toFixed(2)} Mbps | Avg: ${avg.toFixed(2)} | Jitter: ${jitter.toFixed(2)}`
      );

      if (avg < AUDIO_THRESHOLD) {
        applyConnStatus('critical');
      } else if (avg < VIDEO_THRESHOLD || jitter > JITTER_THRESHOLD) {
        applyConnStatus('unstable');
      } else {
        applyConnStatus('stable');
      }
    });

    setSocket(sock);
  };

  useEffect(() => {
    connectSocket();
    return () => {
      socket?.disconnect();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        debugLog('⚠️ navigator.onLine = false');
        applyConnStatus('critical');
        return;
      }

      if (!socket || !socket.connected) {
        applyConnStatus('critical');
        return;
      }

      const currentSize = PACKET_SIZES[currentSizeIndex.current];
      socket.emit('speed-ping', {
        timestamp: performance.now(),
        size: currentSize,
      });

      debugLog('📤 Sent speed-ping with size:', currentSize);

      currentSizeIndex.current =
        (currentSizeIndex.current + 1) % PACKET_SIZES.length;
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket]);

  useEffect(() => {
    const handleOffline = () => {
      debugLog('🌐 Browser detected offline');
      applyConnStatus('critical');
    };
    const handleOnline = () => {
      debugLog('🌐 Browser back online');
      applyConnStatus('unstable');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};

export default useNetworkMonitor;
