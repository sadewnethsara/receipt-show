'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

// Types
interface ReceiptItem {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface Receipt {
    id: string;
    receipt_number: string;
    business_partner_name: string;
    transaction_date: string;
    items: ReceiptItem[];
    subtotal: number;
    discount: number;
    total_amount: number;
}

export default function ReceiptViewer({ id }: { id: string }) {
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReceipt() {
            try {
                const { data, error } = await supabase
                    .from('receipts')
                    .select('*')
                    .eq('receipt_number', id)
                    .single();

                if (error) {
                    console.error('Error fetching receipt:', error);
                    setError('Receipt not found or access denied.');
                } else {
                    setReceipt(data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        }

        fetchReceipt();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
                <p className="text-gray-500">Loading receipt details...</p>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
                <p className="text-gray-600">{error || 'Receipt not found'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-8 border border-gray-100">
            {/* Header */}
            <div className="bg-green-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50 transform -skew-y-6 origin-top-left"></div>
                <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Veggie Mart</h1>
                    <p className="text-sm font-medium opacity-90 mt-1">Official Digital Receipt</p>
                </div>
            </div>

            <div className="p-6">
                {/* Receipt Details */}
                <div className="flex justify-between items-end mb-6 text-sm border-b border-dashed border-gray-200 pb-6">
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Date & Time</p>
                        <p className="font-medium text-gray-800">{format(new Date(receipt.transaction_date), 'dd MMM yyyy')}</p>
                        <p className="text-gray-600">{format(new Date(receipt.transaction_date), 'hh:mm a')}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Receipt No</p>
                        <p className="font-mono font-medium text-gray-800">{receipt.receipt_number}</p>
                        <p className="text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            {receipt.business_partner_name}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="pb-3 font-medium">Item</th>
                                <th className="pb-3 text-right font-medium">Qty</th>
                                <th className="pb-3 text-right font-medium">Price</th>
                                <th className="pb-3 text-right font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {receipt.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-3 font-medium text-gray-800">{item.productName}</td>
                                    <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                                    <td className="py-3 text-right text-gray-600">{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-3 text-right font-medium text-gray-800">{item.totalPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{receipt.subtotal.toFixed(2)}</span>
                    </div>
                    {receipt.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{receipt.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total Amount</span>
                        <span>LKR {receipt.total_amount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-gray-400 text-xs">Thank you for shopping with us!</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                        <span>•</span>
                        <span>Veggie Mart</span>
                        <span>•</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
