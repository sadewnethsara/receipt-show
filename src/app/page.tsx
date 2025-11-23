import { ShoppingBag, Receipt } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-green-50 to-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-green-100">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Veggie Mart</h1>
          <p className="text-green-600 font-medium mb-6">Digital Receipt System</p>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Welcome to the official Veggie Mart digital receipt verification portal.
            Scan the QR code on your receipt to view details.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-3 rounded-lg">
            <Receipt className="h-4 w-4" />
            <span>Secure & Verifiable Receipts</span>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 text-xs">
          <p>© 2025 Veggie Mart. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
