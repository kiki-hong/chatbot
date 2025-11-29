import fs from 'fs';
import path from 'path';


import { bots, defaultBotId } from '@/lib/bots';

// Simple in-memory RAG for prototype
// In production, this would connect to Vertex AI Search or a Vector DB

export async function getContext(botId: string, query: string): Promise<string> {
  try {
    const botConfig = bots[botId] || bots[defaultBotId];

    // Try to find the data directory in multiple common locations
    // In Vercel, process.cwd() is usually the project root.
    const possiblePaths = [
      path.join(process.cwd(), 'data', botId),
      path.join(process.cwd(), 'public', 'data', botId),
      path.join(__dirname, 'data', botId),
      path.join(__dirname, '..', 'data', botId),
      path.join(__dirname, '..', '..', 'data', botId),
    ];

    let dataDir = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dataDir = p;
        break;
      }
    }

    if (!dataDir) {
      console.error(`[RAG] Data directory not found for bot '${botId}' in:`, possiblePaths);
      return "지식베이스를 찾을 수 없습니다. (시스템 점검 중)";
    }

    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.md'));
    console.log(`[RAG] Found ${files.length} files in ${dataDir}`);

    let allContent = "";

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
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      allContent += `\n\n--- Source: ${file} ---\n\n${fileContent}`;
    }

    return allContent;
  } catch (error) {
    console.error("Error reading knowledge base:", error);
    return `Error loading knowledge base: ${error}`;
  }
}

export async function getKnowledgeScope(botId: string): Promise<string> {
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'data', botId, 'knowledge_index.json'),
      path.join(process.cwd(), 'public', 'data', botId, 'knowledge_index.json'),
      path.join(__dirname, 'data', botId, 'knowledge_index.json'),
    ];

    let indexPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        indexPath = p;
        break;
      }
    }

    if (!indexPath) {
      // If no index file, just list the files
      return "지식베이스 인덱스 파일이 없습니다.";
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

