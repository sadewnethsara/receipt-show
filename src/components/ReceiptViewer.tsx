'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2, AlertCircle, CheckCircle2, RefreshCw, ShoppingBag } from 'lucide-react';

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

    const fetchReceipt = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('receipts')
                .select('*')
                .eq('receipt_number', id)
                .single();

            if (error) {
                console.error('Error fetching receipt:', error);
                // Distinguish between network errors and not found
                if (error.code === 'PGRST116') {
                    setError('Receipt not found. Please check the link and try again.');
                } else {
                    setError('Unable to load receipt. Please check your connection.');
                }
            } else {
                setReceipt(data);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchReceipt();
    }, [fetchReceipt]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
                    <p className="text-gray-600 font-medium">Loading receipt details...</p>
                </div>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-sm w-full text-center">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Receipt</h2>
                    <p className="text-gray-600 mb-6">{error || 'Receipt not found'}</p>
                    <button
                        onClick={fetchReceipt}
                        className="flex items-center justify-center w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors font-medium"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden my-4 sm:my-8 border border-gray-100">
            {/* Header */}
            <div className="bg-green-600 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50 transform -skew-y-6 origin-top-left scale-150"></div>
                <div className="relative z-10">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Veggie Mart</h1>
                    <p className="text-green-50 font-medium opacity-90 mt-1">Official Digital Receipt</p>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {/* Receipt Details */}
                <div className="flex justify-between items-end mb-8 text-sm border-b border-dashed border-gray-200 pb-6">
                    <div className="space-y-1.5">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Date & Time</p>
                        <p className="font-semibold text-gray-800 text-base">{format(new Date(receipt.transaction_date), 'dd MMM yyyy')}</p>
                        <p className="text-gray-500">{format(new Date(receipt.transaction_date), 'hh:mm a')}</p>
                    </div>
                    <div className="text-right space-y-1.5">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Receipt No</p>
                        <p className="font-mono font-semibold text-gray-800 text-base tracking-tight">{receipt.receipt_number}</p>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold mt-1">
                            {receipt.business_partner_name}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    {receipt.items && receipt.items.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 font-bold pl-1">Item</th>
                                    <th className="pb-3 text-right font-bold">Qty</th>
                                    <th className="pb-3 text-right font-bold">Price</th>
                                    <th className="pb-3 text-right font-bold pr-1">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {receipt.items.map((item, index) => (
                                    <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 font-medium text-gray-800 pl-1">{item.productName}</td>
                                        <td className="py-3.5 text-right text-gray-500 font-medium">{item.quantity}</td>
                                        <td className="py-3.5 text-right text-gray-500">{item.unitPrice.toFixed(2)}</td>
                                        <td className="py-3.5 text-right font-bold text-gray-800 pr-1">{item.totalPrice.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No items in this receipt</p>
                        </div>
                    )}
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm border border-gray-100">
                    <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-mono">{receipt.subtotal.toFixed(2)}</span>
                    </div>
                    {receipt.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span className="font-medium">Discount</span>
                            <span className="font-mono">-{receipt.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200/60 mt-2">
                        <span className="font-bold text-gray-900 text-base">Total Amount</span>
                        <span className="font-bold text-gray-900 text-xl font-mono">LKR {receipt.total_amount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center space-y-3">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Thank you for shopping with us!</p>
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-300">
                        <div className="h-px w-8 bg-gray-200"></div>
                        <span className="font-semibold text-gray-400">Veggie Mart</span>
                        <div className="h-px w-8 bg-gray-200"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
