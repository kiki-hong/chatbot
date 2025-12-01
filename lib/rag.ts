import fs from 'fs';
import path from 'path';


import { bots, defaultBotId } from '@/lib/bots';

// Simple in-memory RAG for prototype
// In production, this would connect to Vertex AI Search or a Vector DB

// Cache structure: sourceId -> { fileList: string[], contentCache: { [filename: string]: string }, lastLoaded: number }
const ragCache: {
  [sourceId: string]: {
    fileList: string[];
    contentCache: { [filename: string]: string };
    lastLoaded: number;
  }
} = {};

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes (optional, or keep it forever for static content)

export async function getContext(sourceId: string, query: string): Promise<string> {
  try {
    // Try to find the data directory in multiple common locations
    // In Vercel, process.cwd() is usually the project root.
    const possiblePaths = [
      path.join(process.cwd(), 'data', sourceId),
      path.join(process.cwd(), 'public', 'data', sourceId),
      path.join(__dirname, 'data', sourceId),
      path.join(__dirname, '..', 'data', sourceId),
      path.join(__dirname, '..', '..', 'data', sourceId),
    ];

    let dataDir = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dataDir = p;
        break;
      }
    }

    if (!dataDir) {
      console.error("[RAG] Data directory not found in:", possiblePaths);
      console.error("[RAG] Current working directory:", process.cwd());
      console.error("[RAG] __dirname:", __dirname);
      return "지식베이스를 찾을 수 없습니다. (시스템 점검 중)";
    }

    // Initialize or refresh cache
    if (!ragCache[sourceId] || (Date.now() - ragCache[sourceId].lastLoaded > CACHE_TTL)) {
      console.log(`[RAG] Cache miss or expired for ${sourceId}. Loading from disk...`);
      const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.md'));
      ragCache[sourceId] = {
        fileList: files,
        contentCache: {},
        lastLoaded: Date.now()
      };
    } else {
      console.log(`[RAG] Cache hit for ${sourceId}`);
    }

    const cachedData = ragCache[sourceId];
    const files = cachedData.fileList;

    console.log(`[RAG] Found ${files.length} files in ${dataDir}`);

    let allContent = "";

    const botConfig = bots[sourceId] || bots[defaultBotId];

    // Always include these core files if they exist
    const coreFiles = botConfig.rag.coreFiles;

    // Keyword mapping for large legal documents
    const keywordMap = botConfig.rag.keywordMap;

    const relevantFiles = new Set<string>();

    // Add core files
    files.forEach(file => {
      if (coreFiles.includes(file)) {
        relevantFiles.add(file);
      }
    });

    // Add files matching keywords
    Object.keys(keywordMap).forEach(keyword => {
      if (query.includes(keyword)) {
        const targetSubstrings = keywordMap[keyword];
        files.forEach(file => {
          if (targetSubstrings.some(sub => file.includes(sub))) {
            relevantFiles.add(file);
          }
        });
      }
    });

    // If no specific legal keywords found, maybe we shouldn't include ALL laws.
    // But if the query is very generic, we might miss context. 
    // For now, let's stick to core + matched. 
    // If relevantFiles is just core files, maybe add a note?

    console.log(`[RAG] Selected ${relevantFiles.size} relevant files for query: "${query}"`);

    for (const file of relevantFiles) {
      // Check content cache
      if (!cachedData.contentCache[file]) {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        cachedData.contentCache[file] = fileContent;
      }

      const content = cachedData.contentCache[file];
      allContent += `\n\n--- Source: ${file} ---\n\n${content}`;
    }

    return allContent;
  } catch (error) {
    console.error("Error reading knowledge base:", error);
    return `Error loading knowledge base: ${error}`;
  }
}

export async function getKnowledgeScope(sourceId: string): Promise<string> {
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'data', sourceId, 'knowledge_index.json'),
      path.join(process.cwd(), 'public', 'data', sourceId, 'knowledge_index.json'),
      path.join(__dirname, 'data', sourceId, 'knowledge_index.json'),
    ];

    let indexPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        indexPath = p;
        break;
      }
    }

    if (!indexPath) {
      return "지식베이스 인덱스를 찾을 수 없습니다.";
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const index = JSON.parse(indexContent);

    let scope = "현재 챗봇이 답변 가능한 지식 범위(문서 목록)입니다:\n";
    index.forEach((item: any) => {
      scope += `- ${item.title}: ${item.summary}\n`;
    });

    return scope;
  } catch (error) {
    console.error("Error reading knowledge scope:", error);
    return "지식 범위를 불러오는 중 오류가 발생했습니다.";
  }
}

