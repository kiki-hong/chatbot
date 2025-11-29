const fs = require('fs');
const path = require('path');

const dataRoot = path.join(__dirname, '../data');

function updateKnowledgeIndexForBot(botId) {
    const botDir = path.join(dataRoot, botId);
    const indexFile = path.join(botDir, 'knowledge_index.json');

    if (!fs.existsSync(botDir)) {
        console.log(`[Info] Bot directory not found: ${botDir}`);
        return;
    }

    console.log(`[${botId}] Scanning data directory...`);

    // Read existing index if it exists
    let existingIndex = [];
    if (fs.existsSync(indexFile)) {
        try {
            existingIndex = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
        } catch (e) {
            console.error(`[${botId}] Error reading existing index:`, e);
        }
    }

    // Get list of MD files
    const files = fs.readdirSync(botDir).filter(file => file.endsWith('.md'));

    if (files.length === 0) {
        console.log(`[${botId}] No Markdown files found.`);
        return;
    }

    const newIndex = [];

    files.forEach(file => {
        const existingEntry = existingIndex.find(entry => entry.filename === file);

        if (existingEntry) {
            // Keep existing entry to preserve manual summaries
            newIndex.push(existingEntry);
        } else {
            // Create new entry
            const title = file.replace('.md', '');
            newIndex.push({
                filename: file,
                title: title,
                summary: `Document about ${title}`, // Default summary
                category: 'General' // Default category
            });
            console.log(`[${botId}] Added new file: ${file}`);
        }
    });

    // Write updated index
    fs.writeFileSync(indexFile, JSON.stringify(newIndex, null, 2), 'utf8');
    console.log(`[${botId}] Updated knowledge index with ${newIndex.length} files.`);
}

function main() {
    const items = fs.readdirSync(dataRoot, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            updateKnowledgeIndexForBot(item.name);
        }
    }
}

main();
