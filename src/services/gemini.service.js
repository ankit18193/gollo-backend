import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (messages, systemPrompt) => {
  try {
    if (!messages || messages.length === 0) {
      throw new Error("Messages array is empty");
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      throw new Error("Last message must be from user");
    }

    
    if (!systemPrompt || typeof systemPrompt !== "string") {
      throw new Error("System prompt is required");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      
      systemInstruction: systemPrompt,
    });

    const historyMessages = messages.slice(0, -1);

    const formattedHistory = historyMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;

    return response.text().trim();

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error(error.message || "Failed to fetch AI response");
  }
};
