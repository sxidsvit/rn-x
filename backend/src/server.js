import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { createClerkClient } from '@clerk/backend';


import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";


const clerkClient = createClerkClient({
  secretKey: ENV.CLERK_SECRET_KEY,
  publishableKey: ENV.CLERK_PUBLISHABLE_KEY
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

const app = express();

app.use(cors());
app.use(express.json());


console.log('ENV.CLERK_SECRET_KEY: ', ENV.CLERK_SECRET_KEY);
console.log('ENV.CLERK_PUBLISHABLE_KEY: ', ENV.CLERK_PUBLISHABLE_KEY);


app.use(clerkMiddleware({
  secretKey: ENV.CLERK_SECRET_KEY,
  publishableKey: ENV.CLERK_PUBLISHABLE_KEY,
}));

// app.use(arcjetMiddleware);

app.get('/debug-auth', (req, res) => {
  const result = req.auth();
  res.json({ auth: result });
});

app.get("/", (req, res) => res.send("Hello from server"));

app.get("/test-error", (req, res) => {
  throw new Error("Test error!");
});

app.get('/verify-token', clerkMiddleware(), async (req, res) => {
  const auth = getAuth(req);
  console.log('Auth result:', JSON.stringify(auth, null, 2)); // Отладка
  if (!auth.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      reason: auth.reason,
      message: auth.message
    });
  }
  res.json({
    isSignedIn: true,
    data: {
      userId: auth.userId,
      sessionId: auth.sessionId,
      claims: auth
    }
  });
});


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// export for vercel
export default app;
