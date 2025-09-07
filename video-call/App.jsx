"use client";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  VideoPlayer,
} from "@videosdk.live/react-sdk";


const authToken = import.meta.env.VITE_AUTH_TOKEN; // Replace with your actual token

const createRoom = async () => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { roomId } = await res.json();
  return roomId;
};

const createMeeting = async ({ token }) => {
  return await createRoom(token);
};

function App() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const newMeetingId = id || (await createMeeting({ token: authToken }));
    setMeetingId(newMeetingId);
  };

  const onMeetingLeave = () => setMeetingId(null);

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}
function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream && micStream.track) {
        const mediaStream = new MediaStream([micStream.track]);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((err) => console.error("micRef play failed", err));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div className="relative aspect-video bg-gray-900">
        {webcamOn ? (
          <VideoPlayer
            participantId={participantId}
            type="video"
            containerStyle={{ height: "100%", width: "100%" }}
            className="w-full h-full object-cover"
            classNameVideo="w-full h-full object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          {!micOn && (
            <div className="bg-red-600 p-1 rounded-full">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M13.22 3.22a.75.75 0 011.06 0L16 4.94l1.72-1.72a.75.75 0 111.06 1.06L17.06 6l1.72 1.72a.75.75 0 01-1.06 1.06L16 7.06l-1.72 1.72a.75.75 0 01-1.06-1.06L14.94 6l-1.72-1.72a.75.75 0 010-1.06z"
                />
              </svg>
            </div>
          )}
          {isLocal && (
            <div className="bg-blue-600 px-2 py-1 rounded-full">
              <span className="text-xs text-white font-medium">You</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium truncate">
            {displayName || "Anonymous"}
          </h4>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                webcamOn ? "bg-green-500" : "bg-gray-500"
              }`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${
                micOn ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>
      </div>
      <audio ref={micRef} autoPlay muted={isLocal} />
    </div>
  );
}

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(null);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onMeetingLeave,
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Meeting Room</h2>
              <p className="text-gray-400 text-sm">ID: {meetingId}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">
                {joined === "JOINED" ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        {joined === "JOINED" ? (
          <div className="space-y-6">
            <Controls />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...participants.keys()].map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                />
              ))}
            </div>
          </div>
        ) : joined === "JOINING" ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Joining the meeting...</p>
              <p className="text-gray-400">Please wait while we connect you</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center max-w-md">
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to Join?
              </h3>
              <p className="text-gray-400 mb-6">
                Click the button below to enter the meeting room
              </p>
              <button
                onClick={joinMeeting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30"
              >
                Join Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("");

  const handleJoinOrCreate = async () => {
    await getMeetingAndToken(meetingId);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full">
        <h3 className="text-white text-lg mb-4">Join or Create a Meeting</h3>
        <input
          type="text"
          placeholder="Enter Meeting ID (optional)"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 backdrop-blur-sm"
        />
        <div className="flex space-x-3">
          <button
            onClick={handleJoinOrCreate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
          >
            Join Meeting
          </button>
          <button
            onClick={handleJoinOrCreate}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-600/30 transition-colors"
          >
            Create Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleMic}
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors"
          title="Toggle Microphone"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            />
          </svg>
        </button>
        <button
          onClick={toggleWebcam}
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors"
          title="Toggle Camera"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </button>
        <button
          onClick={leave}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/30"
        >
          Leave Meeting
        </button>
      </div>
    </div>
  );
}

export default App;
