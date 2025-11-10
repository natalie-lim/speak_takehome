import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const server = createServer(app);

app.use(express.static("public"));

const PORT = process.env.PORT || 4000;
const SPEAK_WS_URL =
  process.env.SPEAK_WS_URL ?? "wss://api.usespeak-staging.com/public/v2/ws";
const SPEAK_ACCESS_TOKEN = process.env.SPEAK_WS_X_ACCESS_TOKEN ?? "";
const SPEAK_CLIENT_INFO = process.env.SPEAK_WS_X_CLIENT_INFO ?? "";

app.get("/", (req, res) => {
  res.send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Speak Proxy</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <main>
      <h1>Speak websocket proxy is running.</h1>
      <p>Connect via <code>ws://localhost:${PORT}/ws</code></p>
    </main>
  </body>
</html>
  `);
});

const speakProxy = createProxyMiddleware("/ws", {
  target: SPEAK_WS_URL,
  changeOrigin: true,
  ws: true,
  secure: true,
  pathRewrite: {
    "^/ws": "",
  },
  onProxyReqWs(proxyReq) {
    if (SPEAK_ACCESS_TOKEN) {
      proxyReq.setHeader("X-Access-Token", SPEAK_ACCESS_TOKEN);
    }
    if (SPEAK_CLIENT_INFO) {
      proxyReq.setHeader("X-Client-Info", SPEAK_CLIENT_INFO);
    }
  },
  headers:
    SPEAK_ACCESS_TOKEN || SPEAK_CLIENT_INFO
      ? {
          ...(SPEAK_ACCESS_TOKEN
            ? { "X-Access-Token": SPEAK_ACCESS_TOKEN }
            : {}),
          ...(SPEAK_CLIENT_INFO ? { "X-Client-Info": SPEAK_CLIENT_INFO } : {}),
        }
      : undefined,
});

app.use("/ws", speakProxy);

server.on("upgrade", (req, socket, head) => {
  if (req.url?.startsWith("/ws")) {
    speakProxy.upgrade(req, socket, head);
  }
});

server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Forwarding WebSocket traffic to ${SPEAK_WS_URL}`);
});
