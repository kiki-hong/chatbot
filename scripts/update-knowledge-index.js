const fs = require('fs');
const path = require('path');

const DATA_BASE_DIR = path.join(__dirname, '../data');

function updateKnowledgeIndex() {
    console.log('Scanning data directory...');

    if (!fs.existsSync(DATA_BASE_DIR)) {
        console.error('Data directory not found.');
        return;
    }

    // Get subdirectories (bots), excluding 'raw'
    const items = fs.readdirSync(DATA_BASE_DIR);
    const subDirs = items.filter(item => {
        const fullPath = path.join(DATA_BASE_DIR, item);
        return fs.statSync(fullPath).isDirectory() && item !== 'raw';
    });

    console.log(`Found ${subDirs.length} bot directories: ${subDirs.join(', ')}`);

    for (const subDir of subDirs) {
        const dataDir = path.join(DATA_BASE_DIR, subDir);
        const indexFile = path.join(dataDir, 'knowledge_index.json');

        // Read existing index if it exists
        let existingIndex = [];
        if (fs.existsSync(indexFile)) {
            try {
                existingIndex = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
            } catch (e) {
                console.error(`[${subDir}] Error reading existing index:`, e);
            }
        }

        // Get list of MD files
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.md'));

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
                console.log(`[${subDir}] Added new file: ${file}`);
            }
        });

        // Write updated index
        fs.writeFileSync(indexFile, JSON.stringify(newIndex, null, 2), 'utf8');
        console.log(`[${subDir}] Updated knowledge index with ${newIndex.length} files.`);
    }
}

updateKnowledgeIndex();
