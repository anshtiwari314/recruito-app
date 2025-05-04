import type React from "react";
import { v4 as uuidv4 } from "uuid";
import type { UserType } from "../reducers/usersReducer";
import { utils } from "@ricky0123/vad-react"

//@ts-ignore
import vad from "voice-activity-detection";
import { getTimestamp, processRecordedAudio } from "./mettingsUtils";
import WavToMp3 from "./wavToMp3";
import { PostReq } from "./requests";

export  function downsampleToWav(file: Blob, callback: CallableFunction): void {
  //@ts-ignore
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const fileReader1 = new FileReader();
  fileReader1.onload = (ev) => {
    //@ts-ignore
    audioContext.decodeAudioData(ev.target?.result, (buffer) => {
      const usingWebkit = !window.OfflineAudioContext;

      //@ts-ignore
          const OfflineAudioContext =
        window.OfflineAudioContext || window.webkitOfflineAudioContext;
      var offlineAudioCtx = new OfflineAudioContext(
        1,
        16000 * buffer.duration,
        16000
      );
      const soundSource = offlineAudioCtx.createBufferSource();
      soundSource.buffer = buffer;
      soundSource.connect(offlineAudioCtx.destination);
      const reader2 = new FileReader();
      reader2.onload = (ev2) => {
        const renderCompleteHandler = (evt: any) => {
          const renderedBuffer = usingWebkit ? evt.renderedBuffer : evt;
          const buffer = bufferToWav(renderedBuffer, renderedBuffer.length);

          if (callback) {
            callback(buffer);
          }
        };
        if (usingWebkit) {
          offlineAudioCtx.addEventListener("complete", renderCompleteHandler);
          offlineAudioCtx.startRendering();
        } else {
          offlineAudioCtx
            .startRendering()
            .then(renderCompleteHandler)
            .catch((err) => {
              console.error(err);
            });
        }
      };
      reader2.readAsArrayBuffer(file);
      soundSource.start(0);
    });
  };
  fileReader1.readAsArrayBuffer(file);
}

export function bufferToWav(abuffer: ArrayBuffer, len: number): ArrayBuffer {
  //@ts-ignore
  var numOfChan = abuffer.numberOfChannels,
    length = len * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    i,
    sample,
    offset = 0,
    pos = 0;

  //WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  //@ts-ignore
  setUint32(abuffer.sampleRate);
  //@ts-ignore
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length
  //write interleaved data
  //@ts-ignore
  for (i = 0; i < abuffer.numberOfChannels; i++) {
    //@ts-ignore
    channels.push(abuffer.getChannelData(i));
  }
  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); //clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32768) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++; //next sample
  }
  return buffer;
  //@ts-ignore
  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }
  //@ts-ignore
  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

//recruiter_notes_sending is failing although that fxn is not associated with any above stuff

export  function encodeMp3(arrayBuffer: ArrayBuffer) {
  // @ts-ignore
  const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
  const dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);

  //@ts-ignore
  const mp3Encoder = new lamejs.MP3Encoder(wav.channels, wav.sampleRate, 128);
  /*
  mettingUtils2.tsx:50 TypeError: lamejs.MP3Encoder is not a constructor
    at encodeMp3 (mettingUtils2.tsx:125:22)
    at DataWrapper.tsx:2078:27
    at renderCompleteHandler (mettingUtils2.tsx:39:13)
    */
  const maxSamples = 1152;

  const samplesLeft =
    wav.channels === 1
      ? dataView
      : new Int16Array(wav.dataLen / (2 * wav.channels));

  const samplesRight =
    wav.channels === 2
      ? new Int16Array(wav.dataLen / (2 * wav.channels))
      : undefined;

  if (wav.channels > 1) {
    //@ts-ignore
    for (var j = 0; j < samplesLeft.length; j++) {
      samplesLeft[j] = dataView[j * 2];
      //@ts-ignore
      samplesRight[j] = dataView[j * 2 + 1];
    }
  }
  const dataBuffer: Int8Array[] = [];
  let remaining = samplesLeft.length;
  for (var i = 0; remaining >= maxSamples; i += maxSamples) {
    var left = samplesLeft.subarray(i, i + maxSamples);
    var right;
    if (samplesRight) {
      right = samplesRight.subarray(i, i + maxSamples);
    }
    var mp3buf = mp3Encoder.encodeBuffer(left, right);
    dataBuffer.push(new Int8Array(mp3buf));
    remaining -= maxSamples;
  }
  const mp3Lastbuf = mp3Encoder.flush();
  dataBuffer.push(new Int8Array(mp3Lastbuf));
  return dataBuffer;
}

export function uploadFile(
  uploadFileparam: File,
  videoUploadUrl: string,
  startAudioTimestampRef: React.MutableRefObject<string | null>,
  roomId: string,
  agentId: string,
  isHost: boolean,
  jobId: string,
  custEmailId: string,
  name: string
): void {
  const uid = uuidv4();
  const chunkSize = 5 * 1024 * 1024;
  let filesUploaded = 0;
  const totalFiles = 1;
  const totalChunks = Math.ceil(uploadFileparam.size / chunkSize);
  let currChunk = 0;
  const uploadUrl = videoUploadUrl;
  function uploadChunk(chunkStart: number) {
    console.log("Triggered Chunk Upload");
    const chunk = uploadFileparam.slice(chunkStart, chunkStart + chunkSize);
    const chunkFormData = new FormData();
    chunkFormData.append("Original_file_name", uploadFileparam.name);
    chunkFormData.append("file", chunk);
    const fileexit = uploadFileparam.name.split(".").pop();
    chunkFormData.append("filename", `${uid}.${fileexit}`);
    chunkFormData.append("fileid", `${uid}`);
    chunkFormData.append("fileexit", `${fileexit}`);
    chunkFormData.append("startTime", `${startAudioTimestampRef}`);
    chunkFormData.append("roomId", roomId);
    chunkFormData.append("agentid", agentId);
    chunkFormData.append("ishost", isHost.toString());
    chunkFormData.append("jobid", jobId);
    chunkFormData.append("custemailid", custEmailId);
    chunkFormData.append("name", name);
    chunkFormData.append("totalChunks", `${totalChunks}`);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete =
          ((currChunk * chunkSize + event.loaded) / uploadFileparam.size) * 100;
        const num = Math.round(percentComplete);
        console.log(`Uploaded ${num}%`);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        currChunk++;
        if (currChunk < totalChunks) {
          uploadChunk(chunkStart + chunkSize);
        } else {
          filesUploaded++;
          if (filesUploaded === totalFiles) {
            console.log("All files uploaded");
          }
        }
      } else {
        console.log("Error uploading chunk", xhr.responseText);
      }
    };
    xhr.onerror = () => {
      console.log("Network error or request failed");
    };
    xhr.open("POST", uploadUrl, true);
    xhr.send(chunkFormData);
    chunkFormData.forEach((value, key) => {
      console.log("chunkformdata ---", key, value);
    });
  }
  uploadChunk(0);
}


function writeString(dataview: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    dataview.setUint8(offset + i, str.charCodeAt(i));
  }
}


 function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitsPerSample = 16;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;
  const wavBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(wavBuffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);           // subchunk1Size
  view.setUint16(20, 1, true);            // audioFormat = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // PCM samples
  let offset = 44;
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      // clamp and convert to 16-bit PCM
      let sample = Math.max(-1, Math.min(1, channelData[i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Ensure that the input becomes a Blob.
 * Supports Blob, URL (string), ArrayBuffer, AudioBuffer and Float32Array.
 */
async function ensureBlob(
  input: Blob | string | ArrayBuffer | AudioBuffer | Float32Array
): Promise<Blob> {
  if (input instanceof Blob) {
    return input;
  }
  if (typeof input === 'string') {
    const resp = await fetch(input);
    return resp.blob();
  }
  if (input instanceof ArrayBuffer) {
    return new Blob([input], { type: 'application/octet-stream' });
  }
  if (typeof AudioBuffer !== 'undefined' && input instanceof AudioBuffer) {
    return audioBufferToWavBlob(input);
  }
  if (input instanceof Float32Array) {
    const sampleRate = 16000;
    const audioCtx = new (window.OfflineAudioContext ||
                           window.AudioContext)(1, input.length, sampleRate);
    const buffer = audioCtx.createBuffer(1, input.length, sampleRate);
    buffer.copyToChannel(input, 0);
    return audioBufferToWavBlob(buffer);
  }
  console.error('Unsupported audio type:', input);
  throw new Error(
    'Unsupported audio type, expected Blob, URL, ArrayBuffer, AudioBuffer, or Float32Array.'
  );
}


export function generateBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error reading blob'));
    reader.readAsDataURL(blob);
  });
}


export async function processAudioToBase64(
  audio: Blob | string | ArrayBuffer | AudioBuffer | Float32Array,
  url: string,
  data: Record<string, any>,
  handleCors = false
): Promise<any> {
  try {
    // console.log('Raw audio input:', audio);
    const audioBlob = await ensureBlob(audio);
    const base64data = (await generateBase64(audioBlob)) as string;

    const payload = { ...data, audio: base64data };
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };
    if (handleCors) {
      options.mode = 'no-cors';
      console.warn('Using no-cors mode—response will be opaque.');
    }

    const resp = await fetch(url, options);
    if (options.mode === 'no-cors') {
      return { success: true, message: 'Request sent (no-cors mode)' };
    }
    return await resp.json();
  } catch (err) {
    console.error('processAudioToBase64 error:', err);
    throw err;
  }
}


export function handleRecordings(
  stream: MediaStream,
  uploadFile: (file: File) => void,
  setNVaudioUploadAnimation: (state: boolean) => void,
  WavToMp3: (blob: Blob) => Promise<Blob>,
  globalStreamRef: React.MutableRefObject<any>,
  startAudioTimestampRef: React.MutableRefObject<string | null>
): void {
  let arrayOfChunks: BlobPart[] = [];
  const mediaRecorder = new MediaRecorder(stream, {
    audioBitsPerSecond: 32000,
  });
  mediaRecorder.ondataavailable = (event) => {
    arrayOfChunks.push(event.data);
  };
  mediaRecorder.onstop = async () => {
    await processRecordedAudio(
      arrayOfChunks,
      uploadFile,
      setNVaudioUploadAnimation,
      WavToMp3
    );
    arrayOfChunks = [];
  };
  globalStreamRef.current = mediaRecorder;
  startAudioTimestampRef.current = getTimestamp();
  mediaRecorder.start();
}
