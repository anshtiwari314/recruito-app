import { useEffect, useRef, useState, useCallback } from 'react';
import { useData } from '../context/DataWrapper';


const DOWNLOAD_TEST_FILE = 'https://kxytpwitbuwkchaj.public.blob.vercel-storage.com/speed-test-500kb-NVk9REqSp88VepQoOcMrPuv022R0es.txt';
const DOWNLOAD_FILE_SIZE_BITS = 500 * 1024 * 8; 
const UPLOAD_TEST_ENDPOINT = 'http://localhost:8080/api/upload-test';
const UPLOAD_FILE_SIZE_BITS = 1 * 1024 * 1024 * 8; 
const INTERVAL = 8000; 

const SPEED_THRESHOLDS = {
  CRITICAL: 1.5, 
  UNSTABLE: 5,   
};

export default function useNetworkMonitor() {
  const { setConnStatus: setGlobalConnStatus, connStatus: globalConnStatus }: any = useData();
  
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0); 
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);

 
  const setConnStatus = useCallback((status: string) => {
    setGlobalConnStatus(status);
    console.log(`Connection status: ${status}`);
  }, [setGlobalConnStatus]);

  const measureDownloadSpeed = useCallback(async () => {
    try {
      const startTime = Date.now();
  
      const response = await fetch(DOWNLOAD_TEST_FILE + '?_=' + Date.now());
      
      if (!response.ok) {
        throw new Error(`HTTP error during download test! Status: ${response.status}`);
      }

      await response.blob(); 
      
      const endTime = Date.now();
      const durationSeconds = (endTime - startTime) / 1000; 
      if (durationSeconds < 0.1) { 
          setConnStatus('stable'); 
          setDownloadSpeed(100); 
          return;
      }

     
      const calculatedDownloadSpeed = DOWNLOAD_FILE_SIZE_BITS / durationSeconds / 1_000_000; 
      
      setDownloadSpeed(parseFloat(calculatedDownloadSpeed.toFixed(2)));

      if (calculatedDownloadSpeed < SPEED_THRESHOLDS.CRITICAL) {
        setConnStatus('critical');
      } else if (calculatedDownloadSpeed < SPEED_THRESHOLDS.UNSTABLE) {
        setConnStatus('unstable');
      } else {
        setConnStatus('stable');
      }
    } catch (error) {
      setConnStatus('critical');
      setDownloadSpeed(0);
      console.error('Download speed test failed:', error);
    }
  }, [setConnStatus]); 

  const measureUploadSpeed = useCallback(async () => {
    try {
      const startTime = Date.now();

    
      const uploadData = new Blob([new ArrayBuffer(UPLOAD_FILE_SIZE_BITS / 8)], { type: 'application/octet-stream' });

      const response = await fetch(UPLOAD_TEST_ENDPOINT + '?_=' + Date.now(), {
        method: 'POST',
        body: uploadData, 
        headers: {
          'Content-Type': 'application/octet-stream', 
        },
      });

      if (!response.ok) {
        throw new Error(`Upload HTTP error! Status: ${response.status}`);
      }

      const endTime = Date.now();
      const durationSeconds = (endTime - startTime) / 1000; 
      if (durationSeconds < 0.1) {
        setUploadSpeed(100); 
        return;
      }

      const calculatedUploadSpeed = UPLOAD_FILE_SIZE_BITS / durationSeconds / 1_000_000;
      setUploadSpeed(parseFloat(calculatedUploadSpeed.toFixed(2)));

      if (calculatedUploadSpeed < SPEED_THRESHOLDS.CRITICAL) {
        setConnStatus('critical'); 
      } else if (calculatedUploadSpeed < SPEED_THRESHOLDS.UNSTABLE && globalConnStatus !== 'critical') {
        setConnStatus('unstable');
      }

    } catch (error) {
      setUploadSpeed(0);
      setConnStatus('critical'); 
      console.error('Upload speed test failed:', error);
    }
  }, [setConnStatus, globalConnStatus]); 


  useEffect(() => {
    const handleOffline = () => {
      setConnStatus('critical'); // Set overall status to critical
      setDownloadSpeed(0);        // Reset download speed
      setUploadSpeed(0);          // Reset upload speed
    };

    const handleOnline = () => {
      setConnStatus('unstable'); // On reconnect, assume unstable initially
      measureDownloadSpeed();    // Immediately test download speed
      measureUploadSpeed();      // Immediately test upload speed
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    const iv = setInterval(() => {
      if (!navigator.onLine) {
        handleOffline();
      } else {
        measureDownloadSpeed();
        measureUploadSpeed();
      }
    }, INTERVAL);
    
    if (navigator.onLine) {
        measureDownloadSpeed();
        measureUploadSpeed();
    } else {
        handleOffline(); // If already offline on mount, set critical
    }

    return () => {
      clearInterval(iv);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [measureDownloadSpeed, measureUploadSpeed, setConnStatus]); // Dependencies for useEffect: ensures effect re-runs if these functions change (due to useCallback dependencies)

  return { statuss: globalConnStatus, downloadSpeed, uploadSpeed };
}


