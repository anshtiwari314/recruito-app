import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Socket } from "socket.io-client"
import type Peer from "peerjs"

interface PeerConnection {
  call: any
}

interface ConnectionState {
  socket: Socket | null
  socket2: Socket | null
  peer: Peer | null
  peer2: Peer | null
  audioPeer: Peer | null
  peersObj: Record<string, PeerConnection>
  peers2Obj: Record<string, PeerConnection>
  audioPeersObj: Record<string, PeerConnection>
  peersArr: string[]
  peers2Arr: string[]
  audioPeersArr: string[]
  roomId: string
  custEmailId: string
  agentId: string
  meetingIsLegit: boolean
}

const initialState: ConnectionState = {
  socket: null,
  socket2: null,
  peer: null,
  peer2: null,
  audioPeer: null,
  peersObj: {},
  peers2Obj: {},
  audioPeersObj: {},
  peersArr: [],
  peers2Arr: [],
  audioPeersArr: [],
  roomId: "",
  custEmailId: "",
  agentId: "",
  meetingIsLegit: false,
}

export const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      state.socket = action.payload
    },
    setSocket2: (state, action: PayloadAction<Socket | null>) => {
      state.socket2 = action.payload
    },
    setPeer: (state, action: PayloadAction<Peer | null>) => {
      state.peer = action.payload
    },
    setPeer2: (state, action: PayloadAction<Peer | null>) => {
      state.peer2 = action.payload
    },
    setAudioPeer: (state, action: PayloadAction<Peer | null>) => {
      state.audioPeer = action.payload
    },
    addPeerConnection: (state, action: PayloadAction<{ id: string; connection: PeerConnection }>) => {
      state.peersObj[action.payload.id] = action.payload.connection
      if (!state.peersArr.includes(action.payload.id)) {
        state.peersArr.push(action.payload.id)
      }
    },
    addPeer2Connection: (state, action: PayloadAction<{ id: string; connection: PeerConnection }>) => {
      state.peers2Obj[action.payload.id] = action.payload.connection
      if (!state.peers2Arr.includes(action.payload.id)) {
        state.peers2Arr.push(action.payload.id)
      }
    },
    addAudioPeerConnection: (state, action: PayloadAction<{ id: string; connection: PeerConnection }>) => {
      state.audioPeersObj[action.payload.id] = action.payload.connection
      if (!state.audioPeersArr.includes(action.payload.id)) {
        state.audioPeersArr.push(action.payload.id)
      }
    },
    removePeerConnection: (state, action: PayloadAction<string>) => {
      delete state.peersObj[action.payload]
      state.peersArr = state.peersArr.filter((id) => id !== action.payload)
    },
    removePeer2Connection: (state, action: PayloadAction<string>) => {
      delete state.peers2Obj[action.payload]
      state.peers2Arr = state.peers2Arr.filter((id) => id !== action.payload)
    },
    removeAudioPeerConnection: (state, action: PayloadAction<string>) => {
      delete state.audioPeersObj[action.payload]
      state.audioPeersArr = state.audioPeersArr.filter((id) => id !== action.payload)
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setCustEmailId: (state, action: PayloadAction<string>) => {
      state.custEmailId = action.payload
    },
    setAgentId: (state, action: PayloadAction<string>) => {
      state.agentId = action.payload
    },
    setMeetingIsLegit: (state, action: PayloadAction<boolean>) => {
      state.meetingIsLegit = action.payload
    },
    resetConnectionState: (state) => {
      return initialState
    },
  },
})

export const {
  setSocket,
  setSocket2,
  setPeer,
  setPeer2,
  setAudioPeer,
  addPeerConnection,
  addPeer2Connection,
  addAudioPeerConnection,
  removePeerConnection,
  removePeer2Connection,
  removeAudioPeerConnection,
  setRoomId,
  setCustEmailId,
  setAgentId,
  setMeetingIsLegit,
  resetConnectionState,
} = connectionSlice.actions

export default connectionSlice.reducer

