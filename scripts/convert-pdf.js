
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const rawBaseDir = path.join(process.cwd(), 'data', 'raw');
const dataBaseDir = path.join(process.cwd(), 'data');

async function convertPdfs() {
    try {
        if (!fs.existsSync(rawBaseDir)) {
            console.error('Raw directory not found:', rawBaseDir);
            return;
        }

        // Get all subdirectories in data/raw (e.g., oriental, saju)
        // Also handle files in root raw/ just in case, or enforce subdirs.
        // For now, let's iterate subdirectories.
        const items = fs.readdirSync(rawBaseDir);
        const subDirs = items.filter(item => fs.statSync(path.join(rawBaseDir, item)).isDirectory());

        console.log(`Found ${subDirs.length} bot directories: ${subDirs.join(', ')}`);

        for (const subDir of subDirs) {
            const rawDir = path.join(rawBaseDir, subDir);
            const dataDir = path.join(dataBaseDir, subDir);

            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const files = fs.readdirSync(rawDir).filter(file => file.toLowerCase().endsWith('.pdf'));
            console.log(`[${subDir}] Found ${files.length} PDF files.`);

            let convertedCount = 0;
            let skippedCount = 0;

            for (const file of files) {
                const filePath = path.join(rawDir, file);
                const mdFileName = file.replace(/\.pdf$/i, '.md');
                const mdFilePath = path.join(dataDir, mdFileName);

                // Check if conversion is needed
                if (fs.existsSync(mdFilePath)) {
                    const pdfStats = fs.statSync(filePath);
                    const mdStats = fs.statSync(mdFilePath);

                    if (pdfStats.mtime <= mdStats.mtime) {
                        console.log(`[${subDir}] Skipping: ${file} (already up to date)`);
                        skippedCount++;
                        continue;
                    }
                }

                const dataBuffer = fs.readFileSync(filePath);

                console.log(`[${subDir}] Converting: ${file}...`);

                let parser;
                try {
                    parser = new pdf.PDFParse({ data: dataBuffer });
                    const data = await parser.getText();
                    const text = data.text;
                    const cleanText = text.replace(/\n\s*\n/g, '\n\n');
                    const mdContent = `# ${file}\n\n${cleanText}`;

                    fs.writeFileSync(mdFilePath, mdContent);
                    console.log(`[${subDir}] Saved to: ${mdFileName}`);
                    convertedCount++;
                } catch (err) {
                    console.error(`[${subDir}] Failed to convert ${file}:`, err.message);
                } finally {
                    if (parser) {
                        await parser.destroy();
                    }
                }
            }
            console.log(`[${subDir}] Complete. Converted: ${convertedCount}, Skipped: ${skippedCount}`);
        }
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

convertPdfs();
