import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const SPEAK_WS_URL =
  process.env.SPEAK_WS_URL ?? "wss://api.usespeak-staging.com/public/v2/ws";
const SPEAK_ACCESS_TOKEN =
  process.env.SPEAK_WS_X_ACCESS_TOKEN ?? process.env.X_ACCESS_TOKEN ?? "";
const SPEAK_CLIENT_INFO =
  process.env.SPEAK_WS_X_CLIENT_INFO ?? process.env.X_CLIENT_INFO ?? "";

const parsedUrl = new URL(SPEAK_WS_URL);
const targetOrigin = `${parsedUrl.protocol === "wss:" ? "https:" : "http:"}//${
  parsedUrl.host
}`;
const targetPath = parsedUrl.pathname || "/";

console.log("[proxy] Target origin:", targetOrigin);
console.log("[proxy] Target path:", targetPath);

const speakProxy = createProxyMiddleware({
  target: targetOrigin,
  changeOrigin: true,
  ws: true,
  secure: false,
  logLevel: "debug",
  pathRewrite: {
    "^/ws": targetPath,
  },
  onProxyReq(proxyReq) {
    if (SPEAK_ACCESS_TOKEN) {
      proxyReq.setHeader("X-Access-Token", SPEAK_ACCESS_TOKEN);
    }
    if (SPEAK_CLIENT_INFO) {
      proxyReq.setHeader("X-Client-Info", SPEAK_CLIENT_INFO);
    }
  },
  onProxyReqWs(proxyReq) {
    if (SPEAK_ACCESS_TOKEN) {
      proxyReq.setHeader("X-Access-Token", SPEAK_ACCESS_TOKEN);
    }
    if (SPEAK_CLIENT_INFO) {
      proxyReq.setHeader("X-Client-Info", SPEAK_CLIENT_INFO);
    }
  },
});

app.use("/ws", speakProxy);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`
    <h1>Speak websocket proxy is running.</h1>
    <p>Connect via <code>ws://localhost:${PORT}/ws</code></p>
  `);
});

app.get("/audio", (req, res) => {
  const audioPath = path.join(__dirname, "assets", "audio.json");
  res.sendFile(audioPath);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url?.startsWith("/ws")) {
    console.log("[proxy] Upgrade request received:", req.url);
    speakProxy.upgrade(req, socket, head);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
  console.log(`🔁 Forwarding WebSocket traffic to ${SPEAK_WS_URL}`);
});
