import { Metadata } from 'next';
import ChatWidget from '@/components/chat-widget';
import { bots } from '@/lib/bots';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ botId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { botId } = await params;
    const bot = bots[botId];

    if (!bot) {
        return {
            title: 'Bot Not Found',
        };
    }

    return {
        title: bot.chatbotName,
        description: `${bot.chatbotName} - AI 상담`,
        openGraph: {
            title: bot.chatbotName,
            description: `${bot.chatbotName} - AI 상담`,
        },
    };
}

export default async function BotPage({ params, searchParams }: Props) {
    const { botId } = await params;
    const { mode, source } = await searchParams;

    // Validate botId
    if (!bots[botId]) {
        notFound();
    }

    const widgetMode = mode === 'widget' ? 'widget' : 'embed';
    const sourceId = typeof source === 'string' ? source : 'default';

    return (
        <div className="bg-transparent w-full h-full">
            <ChatWidget mode={widgetMode} sourceId={sourceId} botId={botId} />
        </div>
    );
}
