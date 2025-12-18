import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  console.log("🔍 Checking available models for your Key...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Google Error:", data.error.message);
    } else if (data.models) {
      console.log("\n✅ AVAILABLE MODELS (Ye models aap use kar sakte hain):");
      data.models.forEach(m => {
        
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`   👉 ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("⚠️ No models found. Key is valid but has no access.");
    }
  } catch (error) {
    console.error("Network Error:", error.message);
  }
}

checkModels();