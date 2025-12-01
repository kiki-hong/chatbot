const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env' });

async function testKey() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ No GOOGLE_API_KEY found in .env");
        return;
    }

    console.log(`🔑 Testing API Key: ${apiKey.substring(0, 5)}...`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("✅ API Key is working!");
        console.log("Response:", text);
    } catch (error) {
        console.error("❌ API Key failed.");
        console.error("Error details:", error.message);
        if (error.message.includes("API_KEY_INVALID")) console.error("Reason: The API key is invalid.");
        if (error.message.includes("PERMISSION_DENIED")) console.error("Reason: Permission denied (Key expired, quota exceeded, or billing issue).");
    }
}

testKey();
