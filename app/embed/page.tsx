import ChatWidget from '@/components/chat-widget';

export default function EmbedPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const sourceId = typeof searchParams.source === 'string' ? searchParams.source : 'embed';
    const botId = typeof searchParams.bot === 'string' ? (searchParams.bot as string) : undefined;

    return (
        <div className="w-full h-[100dvh] bg-transparent">
            <ChatWidget mode="embed" sourceId={sourceId} botId={botId} />
        </div>
    );
}
