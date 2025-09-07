"use client"
import './App.css'
import { useState, useRef, useEffect } from "react"
import { MeetingProvider, useMeeting, useParticipant, Constants } from "@videosdk.live/react-sdk"

const authToken = import.meta.env.VITE_AUTH_TOKEN; // Replace with your actual token or import from env

const createStream = async ({ token }) => {
  const res = await fetch("https://api.videosdk.live/v2/rooms", {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
  const { roomId } = await res.json()
  return roomId
}

function App() {
  const [streamId, setStreamId] = useState(null)
  const [mode, setMode] = useState(Constants.modes.SEND_AND_RECV)

  const initializeStream = async (id) => {
    const newStreamId = id || (await createStream({ token: authToken }))
    setStreamId(newStreamId)
  }

  if (!streamId) {
    return <JoinView initializeStream={initializeStream} setMode={setMode} />
  }

  return (
    <MeetingProvider
      config={{
        meetingId: streamId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Host",
        mode: mode,
      }}
      token={authToken}
    >
      <LSContainer streamId={streamId} onLeave={() => setStreamId(null)} />
    </MeetingProvider>
  )
}

// JoinView Component
function JoinView({ initializeStream, setMode }) {
  const [inputId, setInputId] = useState("")

  const handleAction = async (modeValue) => {
    setMode(modeValue)
    await initializeStream(inputId)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-xl space-y-4 max-w-md w-full">
        <input
          type="text"
          placeholder="Stream ID (optional)"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 placeholder-gray-400 text-white"
        />
        <button
          onClick={() => handleAction(Constants.modes.SEND_AND_RECV)}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded"
        >
          Start as Host
        </button>
        <button
          onClick={() => handleAction(Constants.modes.RECV_ONLY)}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded"
        >
          Join as Audience
        </button>
      </div>
    </div>
  )
}

// LSContainer Component
function LSContainer({ streamId, onLeave }) {
  const [joined, setJoined] = useState(false)
  const { join } = useMeeting({
    onMeetingJoined: () => setJoined(true),
    onMeetingLeft: onLeave,
    onError: (error) => alert(error.message),
  })

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 p-4 bg-gray-800 rounded-xl flex justify-between items-center">
          <div>
            <h2 className="font-bold">Live Stream</h2>
            <p className="text-gray-400 text-sm">Stream ID: {streamId}</p>
          </div>
          <div>
            {joined ? <span className="text-red-500">LIVE</span> : <span>Connecting...</span>}
          </div>
        </div>

        {joined ? <StreamView /> : <JoinScreen join={join} />}
      </div>
    </div>
  )
}

// JoinScreen Component
function JoinScreen({ join }) {
  return (
    <div className="flex items-center justify-center h-96">
      <button onClick={join} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl">
        Join Stream
      </button>
    </div>
  )
}

// StreamView Component
function StreamView() {
  const { participants } = useMeeting()

  return (
    <div className="space-y-4">
      <LSControls />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...participants.values()]
          .filter((p) => p.mode === Constants.modes.SEND_AND_RECV)
          .map((p) => (
            <Participant key={p.id} participantId={p.id} />
          ))}
      </div>
    </div>
  )
}

// LSControls Component
function LSControls() {
  const { leave, toggleMic, toggleWebcam, changeMode, meeting } = useMeeting()
  const currentMode = meeting.localParticipant.mode

  return (
    <div className="p-4 bg-gray-800 rounded-xl flex gap-3 justify-center flex-wrap">
      <button onClick={toggleMic} className="bg-gray-700 p-3 rounded hover:bg-gray-600">
        Mic
      </button>
      <button onClick={toggleWebcam} className="bg-gray-700 p-3 rounded hover:bg-gray-600">
        Camera
      </button>
      <button
        onClick={() =>
          changeMode(
            currentMode === Constants.modes.SEND_AND_RECV
              ? Constants.modes.RECV_ONLY
              : Constants.modes.SEND_AND_RECV
          )
        }
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl"
      >
        {currentMode === Constants.modes.SEND_AND_RECV ? "Switch to Audience" : "Switch to Host"}
      </button>
      <button onClick={leave} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl">
        Leave
      </button>
    </div>
  )
}

// Participant Component
function Participant({ participantId }) {
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamOn ? new MediaStream([webcamStream.track]) : null
      videoRef.current.play().catch(console.error)
    }
  }, [webcamStream, webcamOn])

  useEffect(() => {
    if (audioRef.current && micStream) {
      audioRef.current.srcObject = micOn ? new MediaStream([micStream.track]) : null
      audioRef.current.play().catch(console.error)
    }
  }, [micStream, micOn])

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <video ref={videoRef} autoPlay muted={isLocal} className="w-full h-48 bg-black rounded-lg object-cover" />
      <audio ref={audioRef} autoPlay muted={isLocal} />
      <div className="mt-2 flex justify-between items-center text-sm text-gray-200">
        <span>{displayName || "Anonymous"}</span>
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${webcamOn ? "bg-green-500" : "bg-gray-500"}`}></div>
          <div className={`w-2 h-2 rounded-full ${micOn ? "bg-green-500" : "bg-gray-500"}`}></div>
        </div>
      </div>
    </div>
  )
}

export default App
