
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  aiApiKey: process.env.GEMINI_API_KEY,
};
