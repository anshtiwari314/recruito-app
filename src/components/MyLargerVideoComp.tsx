import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

export function TextPlaceHolder({ e }: { e: any }) {
  return (
    <div className="w-full h-full absolute bg-[#737272] flex justify-center items-center z-5">
      <div className="w-32 h-32 md:w-64 md:h-64 rounded-full mx-auto bg-violet-500 flex items-center justify-center ">
        <p className="text-3xl md:text-6xl w-fit text-white">
          {e?.name?.substring(0, 2).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export function Display({ e, isMobile }: { e: any; isMobile: boolean }) {
  let vidRef = useRef<any>(null);

  let videoId = e.id;

  const loadingcheck = false;

  //let isMobile = false
  let muted = false;
  let num = 0;

  useEffect(() => {
    // console.log("display",e.isLoading, e.isAudioStream, e.cameraStatus)
    let vid = vidRef.current;
    // console.log("lerger display 1 ",e.videoStream , e.audioStream, e.isLoading, vid)
    if (
      e.videoStream === null ||
      e.audioStream === null ||
      e.isLoading === true ||
      vid === null
    )
      return;

    // console.log("larger display 2",e.videoStream,vid)

    if (e.isCameraAvailable === true) vid.srcObject = e.videoStream;

    function onLoaded() {
      vid.play();
    }

    console.log("display ", vid, num);

    vid.addEventListener("loadedmetadata", onLoaded);
  }, [e.videoStream, e.audioStream]);

  return (
    <div
      className="relative w-full h-full"
    >
      {loadingcheck === false ||
      e.isLoading === true ||
      e.cameraStatus === false ||
      e.isCameraAvailable === false ? (
        <TextPlaceHolder e={e} />
      ) : null}

      <video
        ref={vidRef}
        key={num * 3133}
        className="h-full w-full object-cover z-2"
      />

      {e.microphoneStatus && e.isMicrophoneAvailable ? (
        <FontAwesomeIcon
          icon={faMicrophone}
          style={{
            fontSize: "2rem",
            color: "white",
            position: "absolute",
            left: "1rem",
            bottom: "0.5rem",
          }}
        />
      ) : (
        <FontAwesomeIcon
          icon={faMicrophoneSlash}
          style={{
            fontSize: "2rem",
            color: "white",
            position: "absolute",
            left: "1rem",
            bottom: "0.5rem",
          }}
        />
      )}
    </div>
  );
}

export default function MyLargerVideoComp({
  e,
  isMobile,
}: {
  e: any;
  isMobile: boolean;
}) {
  let ref = useRef<any>(null);
  let num = 0;

  return (
    <div ref={ref} className="h-full w-full flex justify-center items-center">
      <Display e={e} isMobile={isMobile} />
    </div>
  );
}
