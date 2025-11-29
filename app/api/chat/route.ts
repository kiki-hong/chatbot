import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { streamText, generateText } from 'ai';
import { getContext, getKnowledgeScope } from '@/lib/rag';
import { bots, defaultBotId } from '@/lib/bots';
import { logChat } from '@/lib/db';
import { appendLogToSheet } from '@/lib/google-sheets';
import { headers } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        console.log('[DEBUG] API Key present:', !!apiKey);
        console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error: 'Missing API key',
                    details:
                        'Set GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in Vercel Project > Settings > Environment Variables. Ensure the correct Environment (Production/Preview) and redeploy.'
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const google = createGoogleGenerativeAI({ apiKey });

        const { messages, sourceId = 'default', botId = defaultBotId } = await req.json();
        const lastMessage = messages[messages.length - 1];
        const query = lastMessage?.content ?? '';

        const botConfig = bots[botId] || bots[defaultBotId];

        const startContext = Date.now();
        const context = await getContext(botId, query);
        const knowledgeScope = await getKnowledgeScope(botId);
        console.log(`getContext: ${Date.now() - startContext}ms`);

        const systemPrompt = [
            botConfig.systemPrompt,
            '',
            '[답변 가능한 범위]',
            knowledgeScope,
            '',
            '[지식베이스]',
            context,
        ].join('\n');

        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const referer = headersList.get('referer') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        const url = new URL(req.url);
        const stream = url.searchParams.get('stream') === '1';

        if (!stream) {
            const startGen = Date.now();
            const { text } = await generateText({
                model: google('gemini-2.0-flash-001'),
                system: systemPrompt,
                messages,
            });
            console.log(`generateText: ${Date.now() - startGen}ms`);

            await logChat(sourceId, query, text);
            await appendLogToSheet({
                timestamp: new Date().toISOString(),
                ip,
                referer,
                userAgent,
                sourceId,
                botId,
                question: query,
                answer: text,
            }, botConfig.googleSheetId, botConfig.googleSheetName);

            return new Response(text || '응답이 비어 있습니다.', {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
        }

        console.log(`streamText start: ${Date.now()}`);
        const result = await streamText({
            model: google('gemini-2.0-flash-001'),
            system: systemPrompt,
            messages,
            onFinish: async (completion) => {
                try {
                    await logChat(sourceId, query, completion.text);
                    await appendLogToSheet({
                        timestamp: new Date().toISOString(),
                        ip,
                        referer,
                        userAgent,
                        sourceId,
                        botId,
                        question: query,
                        answer: completion.text,
                    }, botConfig.googleSheetId, botConfig.googleSheetName);
                } catch (e) {
                    console.warn('[Log] Skipped logging error:', e);
                }
            },
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error', details: error.message, stack: error.stack }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
