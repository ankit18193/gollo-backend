import { aiConfig } from "../config/ai.config.js";
import { getGeminiResponse } from "../services/gemini.service.js";
import Chat from "../models/chat.model.js";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 500;
const ALLOWED_ROLES = ["user", "assistant"];

export const chatWithAI = async (req, res) => {
    try {
        const { messages, system, chatId } = req.body;
        const userId = req.user._id;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required",
            });
        }

        for (const msg of messages) {
            if (!ALLOWED_ROLES.includes(msg.role)) {
                return res.status(400).json({ success: false, message: "Invalid role" });
            }
            if (!msg.content || msg.content.trim().length === 0) {
                return res.status(400).json({ success: false, message: "Empty message" });
            }
            if (msg.content.length > MAX_MESSAGE_LENGTH) {
                return res.status(400).json({ success: false, message: "Message too long" });
            }
        }

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role !== "user") {
            return res.status(400).json({
                success: false,
                message: "Last message must be user",
            });
        }


        let trimmedMessages =
            messages.length > MAX_MESSAGES
                ? messages.slice(-MAX_MESSAGES)
                : messages;

        if (trimmedMessages[0].role !== "user") {
            trimmedMessages = trimmedMessages.slice(1);
        }


        const systemPrompt =
            typeof system === "string" && system.trim()
                ? system
                : aiConfig.defaultSystemPrompt;


        const aiReply = await getGeminiResponse(trimmedMessages, systemPrompt);


        let chat;

        if (chatId) {

            chat = await Chat.findOne({
                _id: chatId,
                user: userId,
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }

            chat.messages.push(
                { role: "user", content: lastMessage.content },
                { role: "assistant", content: aiReply }
            );

            await chat.save();
        } else {

            chat = await Chat.create({
                user: userId,
                title: lastMessage.content.slice(0, 30),
                messages: [
                    { role: "user", content: lastMessage.content },
                    { role: "assistant", content: aiReply },
                ],
            });
        }


        return res.status(200).json({
            success: true,
            chatId: chat._id,
            messages: chat.messages,
        });

    } catch (error) {
        console.error("AI ERROR 👉", error.message);

        if (
            error.message.includes("429") ||
            error.message.includes("Quota")
        ) {
            return res.status(429).json({
                success: false,
                message: "AI free tier limit reached",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getUserChats = async (req, res) => {
    try {
        const userId = req.user._id;

        const chats = await Chat.find({ user: userId })
            .sort({ updatedAt: -1 })
            .select("_id title messages updatedAt pinned");

        return res.status(200).json({
            success: true,
            chats,
        });
    } catch (error) {
        console.error("GET CHATS ERROR 👉", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to load chats",
        });
    }
};


export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;


        const deletedChat = await Chat.findOneAndDelete({
            _id: chatId,
            user: req.user._id
        });

        if (!deletedChat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true, message: "Chat deleted" });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ success: false, message: "Delete Error" });
    }
};


export const updateChatTitle = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { title } = req.body;


        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId, user: req.user._id },
            { title: title },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true, message: "Title updated" });
    } catch (error) {
        console.error("RENAME ERROR:", error);
        res.status(500).json({ success: false, message: "Rename Error" });
    }
};


export const togglePinChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { isPinned } = req.body;


        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId, user: req.user._id },
            { pinned: isPinned },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true, message: "Pin status updated" });
    } catch (error) {
        console.error("PIN ERROR:", error);
        res.status(500).json({ success: false, message: "Pin Error" });
    }
};

