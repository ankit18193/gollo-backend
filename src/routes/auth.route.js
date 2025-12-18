import express from "express";
import passport from "passport";
import { registerUser, loginUser, socialAuthCallback } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);



router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), socialAuthCallback);


router.get("/microsoft", passport.authenticate("microsoft", { prompt: 'select_account' }));
router.get("/microsoft/callback", passport.authenticate("microsoft", { session: false }), socialAuthCallback);


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false }), socialAuthCallback);



export default router;