import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { normalizeUserRoles } from "./storage";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:", "https:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      frameAncestors: ["'self'", "https://replit.com", "https://*.replit.com", "https://*.replit.dev", "https://*.repl.co"],
    },
  },
  crossOriginEmbedderPolicy: false,
  frameguard: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (origin, callback) => {
        const allowed = [
          'https://trisex.org',
          /\.replit\.app$/,
          /\.replit\.dev$/,
        ];
        if (!origin) return callback(null, true);
        const isAllowed = allowed.some(p =>
          typeof p === 'string' ? p === origin : p.test(origin)
        );
        callback(null, isAllowed ? origin : false);
      }
    : true,
  credentials: true,
}));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Session configuration
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'trisex-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // 'lax' (not 'strict') so the session cookie survives the top-level
    // OIDC redirect back to /api/callback for "Log in with Replit".
    sameSite: 'lax',
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Secure logging middleware - redacts sensitive data
function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const redacted = { ...data };
  const sensitiveFields = ['password', 'token', 'secret', 'sessionId', 'cookie', 'authorization'];
  
  for (const key in redacted) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }
  
  return redacted;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Sensitive endpoints - log without response data
      const sensitiveEndpoints = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/age-verification',
        '/api/genealogy-verification',
        '/api/mood-entries',
        '/api/sti-tracking',
        '/api/wellness-goals'
      ];
      
      const isSensitiveEndpoint = sensitiveEndpoints.some(endpoint => path.includes(endpoint));
      
      if (capturedJsonResponse && !isSensitiveEndpoint) {
        const redactedResponse = redactSensitiveData(capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(redactedResponse)}`;
      } else if (isSensitiveEndpoint) {
        logLine += ` :: [SENSITIVE_DATA_REDACTED]`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await normalizeUserRoles();
  const server = await registerRoutes(app);

  // Healthcheck endpoint for deployment infrastructure
  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    try {
      serveStatic(app);
    } catch (e) {
      console.error("[startup] Failed to serve static files:", e);
      // Fallback: serve a minimal response so healthchecks pass
      app.use("*", (_req, res) => {
        res.status(503).send("App is starting up, please try again shortly.");
      });
    }
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
