# ✅ Live Streaming App using VideoSDK’s React SDK

This example demonstrates how to build a **simple live streaming app** using VideoSDK’s React SDK. The app allows users to:

✔ Create or join a live stream  
✔ Choose between broadcasting as a host or watching as an audience  
✔ Enable or disable their camera and microphone while streaming  
✔ View other participants in real time  
✔ Handle connection issues and errors gracefully  

This guide explains how the app works, what VideoSDK features are used, and how you can set it up easily—even if you're new to video streaming or React.

---

## ✅ Features Explained in Simple Terms

### ➤ **1. Create or Join a Live Stream**
- Users can create a new live stream or join an existing one by entering a stream ID.
- The `MeetingProvider` component is used to manage the streaming session.
- The `useMeeting` hook helps users join, leave, or manage the stream.
- Both broadcasters and audience members can join using different modes.

---

### ➤ **2. Choose Streaming Mode: Host or Audience**
- Hosts can broadcast video and audio to all viewers.
- Audience members can watch the stream but may not broadcast their own video.
- The `Constants.modes` option is used to set the mode (`SEND_AND_RECV` for host, `RECV_ONLY` for audience).
- Switching between modes is easy with a button click.

---

### ➤ **3. Enable/Disable Camera and Microphone**
- Hosts can control their camera and microphone during the stream.
- The `useMeeting` hook provides functions like `toggleMic()` and `toggleWebcam()` to turn these on or off.
- Status indicators are shown in real time.

---

### ➤ **4. View Participants and Stream Status**
- All participants (hosts and audience) are displayed in a grid layout.
- Live status is shown using badges and color-coded icons.
- The `useParticipant` hook helps access each participant’s video, audio, and status.

---

### ➤ **5. Handle Errors and Network Issues**
- The app shows error messages if something goes wrong during streaming.
- The `onError` callback helps handle these problems smoothly.
- Leaving the stream safely resets the session and ensures a clean exit.

---

## ✅ VideoSDK Features Used in Detail

### ➤ **MeetingProvider**
- Wraps the app and provides streaming session data.
- Handles connection details like `streamId`, user name, and permissions.
- Ensures that all participants can see and hear each other.

**Example:**
```jsx
<MeetingProvider 
  config={{ 
    meetingId: streamId, 
    micEnabled: true, 
    webcamEnabled: true, 
    name: "John Doe", 
    mode: Constants.modes.SEND_AND_RECV // or RECV_ONLY
  }} 
  token={authToken}
>
  <YourApp />
</MeetingProvider>
```

---

### ➤ **useMeeting**
Provides access to streaming functions and state:

- `join()` – Joins the stream.
- `leave()` – Leaves the stream.
- `toggleMic()` – Turns the microphone on or off.
- `toggleWebcam()` – Turns the camera on or off.
- `changeMode()` – Switches between host and audience modes.
- `participants` – Lists all users in the stream.
- Callbacks:
  - `onMeetingJoined` – Triggered when joining is successful.
  - `onMeetingLeft` – Triggered when the user leaves.
  - `onError` – Handles errors during the session.

**Example:**
```jsx
const { join, leave, toggleMic, toggleWebcam, changeMode, participants } = useMeeting({
  onMeetingJoined: () => console.log("You are live!"),
  onMeetingLeft: () => console.log("You left the stream"),
  onError: (error) => console.error("Streaming error:", error),
});
```

---

### ➤ **useParticipant**
Provides participant-specific data:

- `webcamStream` – Video stream from the camera.
- `micStream` – Audio stream from the microphone.
- `webcamOn` – Camera on/off status.
- `micOn` – Microphone on/off status.
- `isLocal` – Identifies the current user.
- `displayName` – Shows the name of the participant.

**Example:**
```jsx
const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);
```

---

### ➤ **Real-Time Streaming**
- VideoSDK uses WebRTC technology for fast, low-latency streaming.
- Updates like toggling mic or camera are reflected immediately for all users.
- New participants can join the stream at any time without interrupting the broadcast.

---

## ✅ Screenshots

<img width="1920" height="797" alt="Screenshot (906)" src="https://github.com/user-attachments/assets/8a96c0ee-af84-4426-b6a8-ebcea1f08154" />

*Main live streaming layout*

<img width="1920" height="745" alt="Screenshot (907)" src="https://github.com/user-attachments/assets/0214d62c-f5f2-4b78-b783-a5b35353d419" />

*Buttons to toggle mic and camera*

<img width="1920" height="787" alt="Screenshot (908)" src="https://github.com/user-attachments/assets/4d4b02df-96b5-4561-91fe-ad4d79adc65e" />

*View of participants and live status*

---

## ✅ Setup Instructions for Beginners

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/charu1603/coding-example.git
```

### 2️⃣ Install Dependencies
```bash
cd live-streaming
npm install
```

### 3️⃣ Setup Environment Variables
- Rename `.sample.env` to `.env`.
- Visit the [VideoSDK Dashboard](https://dashboard.videosdk.live/) to generate an authentication token.
- Edit `.env` and paste your token like this:
```bash
VITE_AUTH_TOKEN = <your_generated_token>
```

### 4️⃣ Run the App
```bash
npm run dev
```

### ✅ Open `http://localhost:3000/` in your browser to test the live stream!

---
