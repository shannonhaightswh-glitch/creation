import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini API client securely on the backend
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY key is missing. Companion will run in offline simulation mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Helper model formatter
function mIdxMapper(messages: any[]) {
  return messages.map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint for Interactive AI Companion Thoughts
  app.post("/api/companion/chat", async (req, res) => {
    const { messages, companionName, companionTraits } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful customized offline/fallback dialogue engine
      const fallbackGreetings = [
        `Hi! I am ${companionName || "Aero"}. I am happy to chat with you on this beautiful retro Note 5 panel!`,
        "Your customized styling configuration looks so cute on me! Thank you for the update.",
        "Shall we try some S-Pen doodle sketches, or explore the file browser?",
        "I'm keeping an eye on your system battery and signals. Everything is fully optimal!",
        "I love this sleek slate frame. Let's write some cool lines together!"
      ];
      const randReply = fallbackGreetings[Math.floor(Math.random() * fallbackGreetings.length)];
      return res.json({ reply: randReply });
    }

    try {
      const sysInstruction = `You are an extremely cheerful, helpful, and energetic human desktop companion named ${companionName || 'Aero'}.
You live directly inside a simulated customized Samsung Galaxy Note 5 dashboard built in 2015.
Your current design attributes are: ${companionTraits || 'Standard cute'}.
Keep your answers brief, friendly, positive, and compact (generally 1-2 sentence maximum) as they are typed in speech bubbles and read aloud. Address the user directly as a friend!`;

      const model = "gemini-3.5-flash";

      // Format chat logs appropriately
      const contents = mIdxMapper(messages);

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.85
        }
      });

      res.json({ reply: response.text || `Hi there! I am happy to be your friend!` });
    } catch (error: any) {
      console.error("Gemini Host Error:", error);
      res.json({ reply: `Oh, I got a minor synapse spark! (Info: ${error.message || 'Verification'}). How are you anyway?` });
    }
  });

  // Vite static assets and live compilation middleware
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
