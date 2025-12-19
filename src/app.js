import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit"; 
import chatRoutes from "./routes/chat.route.js";
import authRoutes from "./routes/auth.route.js";
import passport from "passport";
import "./config/passport.js";
import session from "express-session";

const app = express();


app.use(cors({
  origin: ["http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
     "https://gollo-frontend.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.JWT_SECRET || "gollo_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  }));
app.use(passport.initialize());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: { success: false, message: "Too many requests, please try again later." }
});


app.use("/api/chat", limiter, chatRoutes);
app.use("/api/auth", authRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something broke!", error: err.message });
});

export default app;