# Speak Take-Home Project

Hi! I built this such that you can view it on the web as an app format. It's a simple UI frontend featuring lessons in Spanish, French, and Korean.

## Architecture Overview

This project consists of two main components:

1. **Frontend (Next.js)**: A React-based web application that provides the user interface for browsing courses, viewing lessons, and practicing speaking exercises. It connects to the backend proxy via WebSocket for "real-time" speech recognition. Clearly I ran into some issues here with the websockets, as you know (thank you again for all of your help)!

2. **Backend (Express)**: A Node.js proxy server that acts as an intermediary between the frontend and the Speak API. It handles WebSocket connections, adds authentication headers, and serves static audio data for testing purposes.

### How It Works

```
Frontend (Next.js) → Backend Proxy (Express) → Speak API (WebSocket)
     ↓                        ↓                        ↓
  Port 3000              Port 4000              wss://api.usespeak-staging.com
```

The frontend connects to the local backend proxy, which then forwards WebSocket traffic to the Speak API with the necessary authentication headers. This architecture allows the frontend to avoid handling sensitive credentials directly.

## Prerequisites

- **Node.js**: Version 18.18.0 or higher (20.x recommended)
- **npm**: Version 9.x or higher (comes with Node.js)
- **Speak API Credentials**: Access token and client info for the Speak WebSocket API

## Installation

1. **Clone the repository** (or just unzip the file in this case):

   ```bash
   git clone https://github.com/natalie-lim/speak_takehome
   cd speak-take-home
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Configuration

### Environment Variables

The application requires environment variables for both the backend and frontend.

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# WebSocket endpoint for Speak API
# Default: wss://api.usespeak-staging.com/public/v2/ws
SPEAK_WS_URL=wss://api.usespeak-staging.com/public/v2/ws

# Speak API authentication (use one of these)
# The backend will check both variable names for flexibility
X_ACCESS_TOKEN=your_access_token_here
# OR
SPEAK_WS_X_ACCESS_TOKEN=your_access_token_here

# Client information (use one of these)
X_CLIENT_INFO=your_client_info_here
# OR
SPEAK_WS_X_CLIENT_INFO=your_client_info_here

# Optional: Backend server port (defaults to 4000)
PORT=4000
```

#### Frontend Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# WebSocket proxy URL (points to backend)
# This is the URL the frontend uses to connect to the local proxy
NEXT_PUBLIC_SPEAK_PROXY_WS=ws://localhost:4000/ws

# HTTP proxy URL (points to backend)
# Used to fetch audio data for testing
NEXT_PUBLIC_SPEAK_PROXY_HTTP=http://localhost:4000
```

## How to Run the Application

The application consists of two parts that need to run simultaneously:

### 1. Start the Backend Server

In one terminal window:

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:4000` (or the port specified in your `.env` file).

You should see:

```
🚀 Proxy server running at http://localhost:4000
🔁 Forwarding WebSocket traffic to wss://api.usespeak-staging.com/public/v2/ws
[proxy] Target origin: https://api.usespeak-staging.com
[proxy] Target path: /public/v2/ws
```

### 2. Start the Frontend Development Server

The frontend is a Next.js application that provides the user interface. It:

- Renders the course browser, lesson viewer, and recording interface
- Manages WebSocket connections through a custom hook
- Handles real-time speech recognition results

In another terminal window (from the root directory):

```bash
npm run dev
```

The Next.js application will start on `http://localhost:3000`.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
To view it **in mobile**, you can right click, click "Inspect", and click "toggle device toolbar" to the left of the "console" tab. From there, in the top header, you can choose what screensize you want to view the app in. I recomend iPhone 12 Pro.

**Frontend Pages:**

- `/` - Landing page with navigation to the main application
- `/main` - Main application interface with course browser, lessons, and recording


### Frontend Scripts

- `npm run dev` - Start Next.js development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

### Backend Scripts

- `npm start` - Start the Express proxy server (runs `node server.js`)

Although I know it isn't finished to the best of my abilities, I appreciate all the help and consideration!