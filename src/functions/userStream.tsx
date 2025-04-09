const userStreamsMap = new Map<
  string,
  {
    stream: MediaStream | null | boolean
    videoStream: MediaStream | null | boolean
    audioStream: MediaStream | null | boolean
  }
>()//idea to store [id]={all three streams};

export function logAllStreams() {
  console.log("All streams in userStreamsMap:")
  userStreamsMap.forEach((streams, userId) => {
    console.log(`User ${userId}:`, {
      stream: streams.stream ? streams : "Not present",
      videoStream: streams.videoStream ? "Present" : "Not present",
      audioStream: streams.audioStream ? "Present" : "Not present",
    })
  })
}

export function setUserStream(userId: string, stream: MediaStream | null | boolean) {
  if (!userId) {
    console.error("Attempted to set stream with empty userId")
    return
  }
  console.log(`Setting stream for user ${userId}:`, stream)
  const userStreams = userStreamsMap.get(userId) || { stream: null, videoStream: null, audioStream: null }
  userStreamsMap.set(userId, { ...userStreams, stream })
  logAllStreams() 
}

export function setUserVideoStream(userId: string, videoStream: MediaStream | null | boolean) {
  if (!userId) {
    console.error("Attempted to set video stream with empty userId")
    return
  }
  console.log(`Setting video stream for user ${userId}:`, videoStream)
  const userStreams = userStreamsMap.get(userId) || { stream: null, videoStream: null, audioStream: null }
  userStreamsMap.set(userId, { ...userStreams, videoStream })
  logAllStreams()
}

export function setUserAudioStream(userId: string, audioStream: MediaStream | null | boolean) {
  if (!userId) {
    console.error("Attempted to set audio stream with empty userId")
    return
  }
  console.log(`Setting audio stream for user ${userId}:`, audioStream)
  const userStreams = userStreamsMap.get(userId) || { stream: null, videoStream: null, audioStream: null }
  userStreamsMap.set(userId, { ...userStreams, audioStream })
  logAllStreams() 
}

export function getUserStream(userId: string): MediaStream | null | boolean {
  if (!userId) {
    console.error("Attempted to get stream with empty userId")
    return null
  }
  const stream = userStreamsMap.get(userId)?.stream || null
  console.log(`Getting stream for user ${userId}:`, stream)
  return stream
}

export function getUserVideoStream(userId: string): MediaStream | null | boolean {
  if (!userId) {
    console.error("Attempted to get video stream with empty userId")
    return null
  }
  const videoStream = userStreamsMap.get(userId)?.videoStream || null
  console.log(`Getting video stream for user ${userId}:`, videoStream)
  return videoStream
}

export function getUserAudioStream(userId: string): MediaStream | null | boolean {
  if (!userId) {
    console.error("Attempted to get audio stream with empty userId")
    return null
  }
  const audioStream = userStreamsMap.get(userId)?.audioStream || null
  console.log(`Getting audio stream for user ${userId}:`, audioStream)
  return audioStream
}

export function removeUserStreams(userId: string) {
  if (!userId) {
    console.error("Attempted to remove streams with empty userId")
    return
  }
  console.log(`Removing streams for user ${userId}`)
  userStreamsMap.delete(userId)
}

export function getUserWithStreams(user: any) {
  if (!user || !user.id) {
    console.error("Invalid user object passed to getUserWithStreams")
    return user
  }
  const streams = userStreamsMap.get(user.id)
  return {
    ...user,
    stream: streams?.stream || null,
    videoStream: streams?.videoStream || null,
    audioStream: streams?.audioStream || null,
  }
}

