# ✅ Video Meeting App using VideoSDK’s React SDK

This example demonstrates how to build a **simple and fully functional video conferencing app** using VideoSDK’s React SDK. The app allows users to:

✔ Create or join video meetings  
✔ Enable or disable their camera and microphone  
✔ See all participants in real time using a grid layout  
✔ Handle errors and connection issues gracefully  

This guide explains how the app works and how VideoSDK is used step by step so even beginners can follow along.

---

## ✅ Features Explained in Simple Terms

### ➤ **1. Create or Join a Video Meeting**
- Users can create a new video meeting or join an existing one by entering a meeting ID.
- The `MeetingProvider` component wraps the entire app and shares meeting information like the meeting ID and user name.
- The `useMeeting` hook is used to join or leave meetings and access other meeting functionalities.
- The app shows video and audio from all participants in real time.

---

### ➤ **2. Enable/Disable Camera and Microphone**
- Users can toggle their camera and microphone during the meeting.
- The app provides buttons to turn these on or off.
- The current state (on/off) is shown through icons, which update immediately when users make changes.

---

### ➤ **3. Show All Participants in a Grid Layout**
- All participants are displayed in a grid format that looks good on both desktop and mobile screens.
- The `useMeeting` hook helps access all participants.
- Each participant’s video or avatar is displayed, along with their name and whether their camera or mic is on.

---

### ➤ **4. Handle Errors and User Interactions**
- The app shows error messages if something goes wrong, like network issues or camera permissions being denied.
- Leaving the meeting clears data and safely ends the session.

---

## ✅ VideoSDK Features Used in Detail

### ➤ **MeetingProvider**
- Acts as a wrapper that shares meeting information with all parts of the app.
- Handles connection to VideoSDK’s servers using the `meetingId` and other settings.
- Example settings include user name, whether mic/camera are enabled by default, etc.

**Example:**
```jsx
<MeetingProvider 
  config={{ 
    meetingId, 
    micEnabled: true, 
    webcamEnabled: true, 
    name: "John Doe" 
  }} 
  token={authToken}
>
  <YourApp />
</MeetingProvider>
```

---

### ➤ **useMeeting**
This hook gives access to important actions and data for the meeting:

- `join()` – Connects the user to the meeting.
- `leave()` – Leaves the meeting.
- `toggleMic()` – Turns the microphone on or off.
- `toggleWebcam()` – Turns the camera on or off.
- `participants` – Gives you a list of all participants and their current status.
- Callbacks:
  - `onMeetingJoined` – Called when the meeting is successfully joined.
  - `onMeetingLeft` – Called when the user leaves the meeting.
  - `onError` – Called if an error happens during the session.

**Example:**
```jsx
const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting({
  onMeetingJoined: () => console.log("You joined the meeting"),
  onMeetingLeft: () => console.log("You left the meeting"),
  onError: (error) => console.error("An error occurred:", error),
});
```

---

### ➤ **useParticipant**
This hook provides information about each participant in the meeting:

- `webcamStream` – The video stream from the participant’s camera.
- `micStream` – The audio stream from the participant’s microphone.
- `webcamOn` – Whether the participant’s camera is on or off.
- `micOn` – Whether the participant’s mic is on or off.
- `isLocal` – Whether the participant is the current user.
- `displayName` – The participant’s name shown on the screen.

**Example:**
```jsx
const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);
```

---

### ➤ **Real-Time Updates**
- VideoSDK uses WebRTC technology, which streams video and audio with minimal delay.
- When someone toggles their mic or camera, the change is instantly reflected on all users’ screens.
- The app reacts to changes automatically, so users see updated streams without refreshing.

---

## ✅ Screenshots

![Meeting Interface](https://github.com/user-attachments/assets/19ef963f-645d-4752-a769-e5a48a0771df)
*Video meeting layout*

![Mic & Webcam Toggle](https://github.com/user-attachments/assets/027aaa77-f4f4-46c2-b7e1-8e9ae7bb76ab)
*Toggle buttons for mic and camera*

![Participant View](https://github.com/user-attachments/assets/623b51fa-2136-41a9-9b0f-e93bacfad8a4)
*Grid layout showing participants*

---

## ✅ Setup Instructions for Beginners

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/charu1603/coding-example.git
```

### 2️⃣ Install Dependencies
```bash
cd video-call
npm install
```

### 3️⃣ Setup Environment Variables
- Rename the file `.sample.env` to `.env`.
- Go to the [VideoSDK Dashboard](https://dashboard.videosdk.live/) and generate an authentication token.
- Open `.env` and paste the token as shown below:
```bash
VITE_AUTH_TOKEN = <your_generated_token>
```

### 4️⃣ Run the Project
```bash
npm run dev
```

### ✅ The app will now be available at `http://localhost:3000/`

---
