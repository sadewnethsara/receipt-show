import ReceiptViewer from '@/components/ReceiptViewer';

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ReceiptViewer id={id} />
        </main>
    );
}
