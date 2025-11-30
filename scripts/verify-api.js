// const fetch = require('node-fetch'); // Using built-in fetch

async function testApi() {
    console.log("🧪 Testing Oriental Bot API...");
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: '소양인의 성격은?' }],
                botId: 'oriental'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log("✅ Response received:");
        console.log(text);

        if (text.includes("소양인") || text.includes("성격")) {
            console.log("✅ Verification PASSED: Response contains expected keywords.");
        } else {
            console.warn("⚠️ Verification WARNING: Response might not be relevant.");
        }

    } catch (error) {
        console.error("❌ API Test Failed:", error);
    }
}

testApi();
