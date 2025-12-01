import ChatWidget from '@/components/chat-widget';

export default async function EmbedPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const sourceId =
        (typeof params.bot === 'string' ? params.bot : undefined) ||
        (typeof params.source === 'string' ? params.source : 'embed');

    return (
        <div className="w-full h-[100dvh] bg-transparent">
            <ChatWidget mode="embed" sourceId={sourceId} />
        </div>
    );
}
