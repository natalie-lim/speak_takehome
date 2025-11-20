# Speak Take-Home Project

A full-stack language learning application built with Next.js and Express that provides interactive speaking practice through WebSocket connections to the Speak API. The application features a modern, responsive UI for browsing language courses, viewing lessons, and practicing pronunciation with real-time speech recognition and feedback.

## Architecture Overview

This project consists of two main components:

1. **Frontend (Next.js)**: A React-based web application that provides the user interface for browsing courses, viewing lessons, and practicing speaking exercises. It connects to the backend proxy via WebSocket for real-time speech recognition.

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

You can check your Node.js version by running:

```bash
node --version
```

## Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
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
# The backend will check both variable names for flexibility
X_CLIENT_INFO=your_client_info_here
# OR
SPEAK_WS_X_CLIENT_INFO=your_client_info_here

# Optional: Backend server port (defaults to 4000)
PORT=4000
```

**Backend Environment Variable Notes:**

- The backend uses `dotenv` to load environment variables automatically
- Authentication headers are added to both HTTP and WebSocket proxy requests
- The proxy rewrites the path from `/ws` to the target path from `SPEAK_WS_URL`

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

**Frontend Environment Variable Notes:**

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- If you change the backend port, update both `NEXT_PUBLIC_SPEAK_PROXY_WS` and `NEXT_PUBLIC_SPEAK_PROXY_HTTP` accordingly
- The frontend uses these URLs to connect to the backend proxy, not directly to the Speak API

## How to Run the Application

The application consists of two parts that need to run simultaneously:

### 1. Start the Backend Server

The backend is an Express server that acts as a WebSocket proxy. It:

- Listens for WebSocket connections on `/ws`
- Forwards traffic to the Speak API with authentication headers
- Serves static files and provides an `/audio` endpoint for test data

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

**Backend Endpoints:**

- `GET /` - Health check page showing proxy status
- `GET /audio` - Returns audio test data from `backend/assets/audio.json`
- `WS /ws` - WebSocket proxy endpoint that forwards to Speak API

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

**Frontend Pages:**

- `/` - Landing page with navigation to the main application
- `/main` - Main application interface with course browser, lessons, and recording

## Application Features

### Frontend Features

- **Landing Page**: Welcome screen with navigation to the main application
- **Course Browser**: View available language courses (French, Spanish, Korean) with descriptions
- **Lesson Viewer**: Browse lessons within each course, including titles, summaries, and durations
- **Recording Practice**: Practice speaking with real-time speech recognition feedback
- **Settings Menu**: Accessible via the settings button or swipe gesture (mobile-friendly)
- **Responsive Design**: Works on desktop and mobile devices with touch gestures

### Backend Features

- **WebSocket Proxy**: Seamlessly forwards WebSocket connections to the Speak API
- **Authentication Handling**: Automatically adds `X-Access-Token` and `X-Client-Info` headers
- **Path Rewriting**: Transforms local `/ws` path to the target API path
- **Static File Serving**: Serves test audio data for development
- **Health Check**: Provides a status endpoint to verify the proxy is running

## Development Scripts

### Frontend Scripts

- `npm run dev` - Start Next.js development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

### Backend Scripts

- `npm start` - Start the Express proxy server (runs `node server.js`)

## Project Structure

```
speak-take-home/
├── backend/                    # Express proxy server
│   ├── assets/                 # Static data files
│   │   ├── audio.json         # Test audio chunks for development
│   │   └── course.json         # Course data (if used)
│   ├── server.js              # Main backend server file
│   ├── package.json            # Backend dependencies
│   └── .env                    # Backend environment variables (create this)
├── src/
│   └── app/                    # Next.js App Router
│       ├── main/               # Main application views
│       │   ├── page.tsx        # Main app page with navigation
│       │   ├── courses.tsx     # Course browser component
│       │   ├── lessons.tsx     # Lesson viewer component
│       │   ├── record.tsx      # Recording practice component
│       │   ├── useSpeakSocket.ts  # WebSocket hook for API communication
│       │   └── types.ts        # TypeScript type definitions
│       ├── page.tsx            # Landing page
│       ├── layout.tsx          # Root layout with fonts
│       └── globals.css         # Global styles
├── public/                     # Static assets
├── package.json                # Frontend dependencies
├── .env.local                  # Frontend environment variables (create this)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## Troubleshooting

### Backend Issues

- **Port already in use**:

  - Change the `PORT` in your backend `.env` file
  - Or kill the process using the port: `lsof -ti:4000 | xargs kill`

- **WebSocket connection fails**:

  - Verify your `X_ACCESS_TOKEN` and `X_CLIENT_INFO` are correct
  - Check that `SPEAK_WS_URL` points to a valid endpoint
  - Ensure the backend server is running before starting the frontend

- **Authentication errors**:

  - Verify environment variables are loaded correctly (check console output)
  - The backend supports both `X_ACCESS_TOKEN`/`X_CLIENT_INFO` and `SPEAK_WS_X_ACCESS_TOKEN`/`SPEAK_WS_X_CLIENT_INFO` formats
  - Ensure credentials are valid for the Speak API

- **Proxy not forwarding correctly**:
  - Check the console output for proxy target information
  - Verify the `SPEAK_WS_URL` format is correct (should start with `wss://`)

### Frontend Issues

- **Cannot connect to WebSocket**:

  - Verify the backend server is running on the expected port
  - Check that `NEXT_PUBLIC_SPEAK_PROXY_WS` matches your backend URL
  - Ensure the backend is accessible (try visiting `http://localhost:4000` in your browser)
  - Check browser console for connection errors

- **Build errors**:

  - Ensure all dependencies are installed with `npm install`
  - Clear `.next` directory and rebuild: `rm -rf .next && npm run build`
  - Check TypeScript errors: `npx tsc --noEmit`

- **Environment variables not working**:
  - Restart the development server after changing `.env.local`
  - Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
  - Check that `.env.local` is in the root directory, not in `src/`

### Common Issues

- **Module not found errors**:

  - Run `npm install` in both root and `backend/` directories
  - Delete `node_modules` and `package-lock.json`, then reinstall
  - Ensure you're using the correct Node.js version

- **CORS errors**:

  - The backend should handle CORS automatically
  - Ensure the backend is running before starting the frontend
  - Check that frontend environment variables point to the correct backend URL

- **WebSocket connection drops**:
  - Check network connectivity
  - Verify the Speak API endpoint is accessible
  - Review browser console and backend logs for error messages

## Technology Stack

### Frontend

- **Next.js 16.0.1**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5.x**: Type safety
- **Tailwind CSS 3.4.18**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend

- **Express 5.1.0**: Web server framework
- **WebSocket (ws) 8.18.3**: WebSocket implementation
- **http-proxy-middleware 3.0.0**: HTTP/WebSocket proxy middleware
- **dotenv 16.4.5**: Environment variable management

## Backend Architecture Details

### WebSocket Proxy Implementation

The backend uses `http-proxy-middleware` to create a transparent proxy for WebSocket connections:

1. **Connection Flow**:

   - Frontend connects to `ws://localhost:4000/ws`
   - Backend receives the connection and upgrades it to WebSocket
   - Backend establishes connection to `SPEAK_WS_URL`
   - All messages are forwarded bidirectionally

2. **Authentication**:

   - Headers are added in `onProxyReq` (HTTP) and `onProxyReqWs` (WebSocket upgrade)
   - Supports both standard and prefixed environment variable names
   - Headers are automatically included in all requests

3. **Path Rewriting**:
   - Local path `/ws` is rewritten to the target path from `SPEAK_WS_URL`
   - This allows the frontend to use a simple local path while the backend handles the API path

### Audio Endpoint

The `/audio` endpoint serves test data from `backend/assets/audio.json`. This file contains base64-encoded audio chunks that simulate the audio streaming process during development. The frontend uses this to test the WebSocket streaming functionality without requiring actual microphone input.

## Notes

- The backend acts as a proxy server, forwarding WebSocket connections to the Speak API
- The frontend connects to the local backend proxy, which handles authentication headers
- Audio data is served from `backend/assets/audio.json` for testing purposes
- The application uses Next.js App Router with client-side components for interactivity
- WebSocket connections are managed through a custom React hook (`useSpeakSocket`)
- The UI is fully responsive and supports touch gestures for mobile devices
