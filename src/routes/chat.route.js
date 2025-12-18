import express from "express";
import { chatWithAI,
     getUserChats,
     deleteChat,       
     updateChatTitle,  
     togglePinChat } from "../controllers/chat.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/", authMiddleware, getUserChats);
router.post("/", authMiddleware, chatWithAI);


router.get("/test", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Token is valid",
    user: req.user, 
  });
});

router.delete("/:chatId",authMiddleware, deleteChat);         
router.put("/:chatId/title",authMiddleware, updateChatTitle); 
router.put("/:chatId/pin",authMiddleware, togglePinChat);

export default router;
