const http = require("http");
const fs = require("fs");
const path = require("path");

const STATIC_ROOT = path.resolve(__dirname, "..", "dist");
const TEMPLATE_PATH = path.resolve(__dirname, "templates", "landing-page.html");
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

function getAppName() {
  try {
    const appJsonPath = path.resolve(__dirname, "..", "app.json");
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    return appJson.expo?.name || "Ide App";
  } catch {
    return "Ide App";
  }
}

function serveLandingPage(req, res, landingPageTemplate, appName) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function serveStaticFile(urlPath, res) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(STATIC_ROOT, safePath);

  if (!filePath.startsWith(STATIC_ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(STATIC_ROOT, "index.html");
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(content);
      return;
    }
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(content);
}

let landingPageTemplate;
let appName;
try {
  landingPageTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  appName = getAppName();
} catch (e) {
  console.error("Failed to load landing page:", e.message);
  landingPageTemplate = null;
  appName = "Ide App";
}

const server = http.createServer((req, res) => {
  // Safely parse URL even without Host header (health checks hit 127.0.0.1)
  const host = req.headers["host"] || "localhost";
  let pathname;
  try {
    const url = new URL(req.url || "/", `http://${host}`);
    pathname = url.pathname;
  } catch {
    pathname = req.url || "/";
    const q = pathname.indexOf("?");
    if (q !== -1) pathname = pathname.slice(0, q);
  }

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  // Landing page at root
  if (pathname === "/") {
    const platform = req.headers["expo-platform"];
    if ((platform === "ios" || platform === "android") && landingPageTemplate) {
      // Expo Go manifest request — would need manifest.json in static-build/
      // For now, return the landing page; Expo Go will redirect users there
    }
    if (landingPageTemplate) {
      return serveLandingPage(req, res, landingPageTemplate, appName);
    }
  }

  // Everything else serves the web app from dist/ (SPA fallback)
  serveStaticFile(pathname, res);
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Serving on port ${port} — landing page at /, web app from dist/`);
});
