// not using vad internal audio, only using vad start & stop functions
// keep track of (on or off) in a global variable  
// if recording on startMediaRecorder in every  t time  
// startMediaRecorder fn chk for for every 1 sec if global variable is true or false 
// if false clear interval & sendData to server

// problem  
// if vad active for longer durations startMediaRecorder interval may have multiple instances  

function startMediaRecorder(stream: MediaStream, time: number) {
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
    let url = adminUrl;
    let arrayofChunks: any = [];
    let mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 32000,
    });

    mediaRecorder.ondataavailable = (e) => {
      arrayofChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setCueLoading(true);

      console.log(
        `%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );
      let mp3Blob = await WavToMp3(
        new Blob(arrayofChunks, { type: "audio/wav" })
      );

      console.log(
        `%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );

     // sendToServer(mp3Blob, url, { ...usersArrRef.current[0], init: false });
      arrayofChunks = [];
    };

    //if recording true stop after 30 sec
    let timeOutId = setTimeout(() => {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, time);
    //chk every second
    let intervalId = setInterval(() => {
      if (globalRef.current.recordingStatus === false) {
        clearInterval(intervalId);
        clearTimeout(timeOutId);
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }
    }, 1000);
    mediaRecorder.start();
  }


  useEffect(() => {
    let id: number;
    if (
      recordingOn === true &&
      microphoneToggle === true &&
      users.length > 0 &&
      users[0].isMicrophoneAvailable
    ) {
      console.log(
        `%c vad triggered ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          startMediaRecorder(stream, 40000);
          //@ts-ignore
          id = setInterval(() => {
            console.log("recording is ", recordingOn);
            startMediaRecorder(stream, 40000);
          }, 40000);
        });
    }
    return () => clearInterval(id);
  }, [recordingOn, microphoneToggle, users]);

  useEffect(() => {
    if (myAudioStream === null || users.length === 0 || socket === null) return;
    // if(vadEffectRender.current>0)
    // return ;
    vadEffectRender.current++;
    //@ts-ignore
    let myVad = null;

    async function VAD(cb1: () => void, cb2: () => void) {
      sendToServer(new Blob([]), adminUrl, {
        ...usersArrRef.current[0],

        init: true,
      });

      const myvad = await vad.MicVAD.new({
        onSpeechStart: cb1,
        onSpeechEnd: cb2,
      });
      // myvad.start()
      globalRef.current.myVad = myvad;
    }

    let stop;
    let medRec = null;
    let flag = false;
    let start2IntervalId;
    let stop2TimeoutId;

    

    function start() {
      let date = new Date();
      console.log(
        `%c vad started ${
          date.toLocaleTimeString() + ":" + date.getMilliseconds()
        }`,
        "background-color:teal;color:white"
      );

      if (adminMediaRecorderStatus.current === false) {
        console.log("caling the function");
        // sendVadStreamToServer(myStream,usersArrRef.current[0],adminUrl,4000)
      }
      vadFlag.current = true;
    }
    function stop1(audio: any) {
      let date = new Date();
      console.log(
        `%c vad stopped ${
          date.toLocaleTimeString() + ":" + date.getMilliseconds()
        }`,
        "background-color:teal;color:white"
      );
      let date2 = new Date();
      console.log(
        `%c  internal processing start ${
          date2.toLocaleTimeString() + ":" + date2.getMilliseconds()
        }`,
        "background-color:teal;color:white"
      );
      //@ts-ignore
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createBufferSource();

      const myArrayBuffer = audioCtx.createBuffer(1, audio.length, 16000);

      let nowBuffering;
      for (
        let channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        // This gives us the actual array that contains the data
        nowBuffering = myArrayBuffer.getChannelData(channel);
        //  console.log('array buffer length',myArrayBuffer.length)
        for (let i = 0; i < myArrayBuffer.length; i++) {
          // Math.random() is in [0; 1.0]
          // audio needs to be in [-1.0; 1.0]
          nowBuffering[i] = audio[i] * 2;
        }
      }

      // set the buffer in the AudioBufferSourceNode
      //source.buffer = myArrayBuffer;

      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound
      //source.connect(audioCtx.destination);

      //start the source playing
      //console.log("ctx stream source",)

      //source.start();

      //let stream= audioCtx.createMediaStreamDestination()
      // stream

      const ch1Data = myArrayBuffer.getChannelData(0);
      const floatArr = new Float32Array(ch1Data.length);

      console.log("duration", myArrayBuffer.duration);
      const wavBytes = getWavBytes(nowBuffering?.buffer, {
        isFloat: true, // floating point or 16-bit integer
        numChannels: 1,
        sampleRate: 16000,
      });
      const wavBlob = new Blob([wavBytes], { type: "audio/ogg" });

      downsampleToWav(wavBlob, (buffer: ArrayBuffer) => {
        let date = new Date();
        console.log(
          `%c processing complete ${
            date.toLocaleTimeString() + ":" + date.getMilliseconds()
          }`,
          "background-color:teal;color:white"
        );

        const mp3Buffer = encodeMp3(buffer);
        let blob = new Blob(mp3Buffer, { type: "audio/mp3" });

        // cue logo will appear at admin end
        if (peersArrRef.current.length > 0)
          socket.emit("cue-loading-transmitter", {
            toPeer: peersArrRef.current[0],
            toggle: true,
          });

        sendToServer(blob, adminUrl, {
          ...usersArrRef.current[0],
          init: false,
        });
      });

      // console.log('myArray buffer',myArrayBuffer,myArrayBuffer.length)

      // let fA = new Float32Array(audio)
      // console.log('bufff',audio.buffer)
      // let arrBuf = new ArrayBuffer(audio)
      // console.log('arrBuf',arrBuf)
      // let blob = new Blob([fA.buffer],{type:'audio/wav'})
      // console.log('blob',URL.createObjectURL(blob))

      //let stream= audioCtx.createMediaStreamDestination()
      //console.log('context stream',stream.stream.getAudioTracks()[0])

      // let mediaRec = new MediaRecorder(audioCtx.createMediaStreamDestination())
      // medRec.

      // sendToServer(blob,adminUrl,usersArrRef.current[0])
      // vadFlag.current=false
    }

    function start2() {
      // if(globalRef.current.recordingStatus===true )
      // return ;

      //console.log(`%c vad triggered ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
      globalRef.current.recordingStatus = true;
      setRecordingOn(true);
      // navigator.mediaDevices.getUserMedia({
      //     audio:true
      //   }).then(stream=>{
      //    startMediaRecorder(stream,10000)
      //    //@ts-ignore
      //     start2IntervalId = setInterval(()=>{
      //       console.log('start2 is interval triggered')
      //       startMediaRecorder(stream,10000)
      //     },10000)
      //   })
    }
    function stop2() {
      stop2TimeoutId = setTimeout(() => {
        console.log(
          `%c audio stopped ${new Date().toLocaleTimeString()}`,
          "background-color:teal;color:white"
        );
        start2IntervalId ? clearInterval(start2IntervalId) : null;
        globalRef.current.recordingStatus = false;
        setRecordingOn(false);
      }, 1000);
    }

    //add isHost === false for client specific use-cases
    if (users[0].isMicrophoneAvailable && microphoneToggle) {
      //console.log("myvad if",globalRef.current.myVad,globalRef.current.myVad?.listening,microphoneToggle)

      if (globalRef.current.myVad === null) {
        VAD(start2, stop2);
      } else {
        globalRef.current.myVad?.start();
      }
    } else {
      // myVad=null

      globalRef.current.myVad?.pause();
      // after pausing vad stop2 is not firing
      stop2();
      // console.log("myvad else",globalRef.current.myVad,globalRef.current.myVad?.listening,microphoneToggle)
    }

    return () => {
      start2IntervalId ? clearInterval(start2IntervalId) : null;
      stop2TimeoutId ? clearTimeout(stop2TimeoutId) : null;
    };
  }, [isHost, myAudioStream, users, socket, adminUrl]);