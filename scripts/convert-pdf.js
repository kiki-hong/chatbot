const fs = require('fs');
const path = require('path');
const pdf = require('pdf-extraction');

const dataRoot = path.join(__dirname, '..', 'data');

async function convertPdfsForBot(botId) {
    const botDir = path.join(dataRoot, botId);
    const rawDir = path.join(botDir, 'raw');

    if (!fs.existsSync(rawDir)) {
        console.log(`[Info] No raw directory found for bot '${botId}' at ${rawDir}`);
        return;
    }

    const files = fs.readdirSync(rawDir).filter(file => file.toLowerCase().endsWith('.pdf'));

    if (files.length === 0) {
        console.log(`[Info] No PDF files found for bot '${botId}'`);
        return;
    }

    console.log(`[${botId}] Found ${files.length} PDF files.`);

    for (const file of files) {
        console.log(`[${botId}] Processing file: ${file}`);
        const filePath = path.join(rawDir, file);

        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);

            const mdFileName = file.replace('.pdf', '.md');
            const mdFilePath = path.join(botDir, mdFileName);

            const mdContent = `---
title: ${file}
source: ${file}
---

${data.text}
`;

            fs.writeFileSync(mdFilePath, mdContent);
            console.log(`[${botId}] Success: Converted ${file} -> ${mdFileName}`);
        } catch (error) {
            console.error(`[${botId}] Error converting ${file}:`, error);
        }
    }
}

async function main() {
    const targetBotId = process.argv[2];

    if (targetBotId) {
        await convertPdfsForBot(targetBotId);
    } else {
        // Process all directories in data/
        const items = fs.readdirSync(dataRoot, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                await convertPdfsForBot(item.name);
            }
        }
    }
}

main().catch(err => console.error("Fatal error:", err));
