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

function buildProxyTarget(url) {
  if (!url) return undefined;
  if (url.startsWith("ws://")) return url.replace("ws://", "http://");
  if (url.startsWith("wss://")) return url.replace("wss://", "https://");
  return url;
}

const SPEAK_HTTP_TARGET = buildProxyTarget(SPEAK_WS_URL);
if (!SPEAK_HTTP_TARGET) {
  console.warn("[proxy] No SPEAK_WS_URL configured; WebSocket proxy disabled.");
}

const speakProxy =
  SPEAK_HTTP_TARGET != null
    ? createProxyMiddleware({
        target: SPEAK_HTTP_TARGET,
        changeOrigin: true,
        ws: true,
        secure: true,
        pathRewrite: {
          "^/ws": "",
        },
        onProxyReq(proxyReq, req) {
          if (SPEAK_ACCESS_TOKEN) {
            proxyReq.setHeader("X-Access-Token", SPEAK_ACCESS_TOKEN);
          }
          if (SPEAK_CLIENT_INFO) {
            proxyReq.setHeader("X-Client-Info", SPEAK_CLIENT_INFO);
          }
        },
        onProxyReqWs(proxyReq, req, socket, options, head) {
          if (SPEAK_ACCESS_TOKEN) {
            proxyReq.setHeader("X-Access-Token", SPEAK_ACCESS_TOKEN);
          }
          if (SPEAK_CLIENT_INFO) {
            proxyReq.setHeader("X-Client-Info", SPEAK_CLIENT_INFO);
          }
        },
      })
    : null;

if (speakProxy) {
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
} else {
  server.listen(PORT, () => {
    console.log(
      `Server running without WebSocket proxy on http://localhost:${PORT}`
    );
  });
}
