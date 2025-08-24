import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Qris() {
  const [params] = useSearchParams();
  const amountParam = params.get('amount') || '0';
  const desc = params.get('desc') || 'Paket Tidak Diketahui';

  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateQris() {
      try {
        setLoading(true);
        setError(null);

        const baseUrl =
          import.meta.env.VITE_API_URL ||
          `${window.location.origin.replace(/:\d+$/, ':3001')}`;

        const referenceNo = `ORDER-${Date.now()}`;
        const amount = Number(amountParam);

        if (isNaN(amount) || amount <= 0) {
          throw new Error('Amount tidak valid');
        }

        const res = await fetch(`${baseUrl}/api/qris`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referenceNo,
            amount,
            billingNm: 'Andi Pamungkas',
            billingPhone: '081234567890',
            billingEmail: 'email@merchant.com',
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal membuat QRIS');
        }

        setQrImage(data.qrUrl || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Gagal membuat QRIS');
      } finally {
        setLoading(false);
      }
    }

    generateQris();
  }, [amountParam]);

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    `${window.location.origin.replace(/:\d+$/, ':3001')}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 text-white">
      <h1 className="mb-4 text-3xl font-bold">Pembayaran QRIS</h1>

      <div className="w-full max-w-sm rounded-2xl bg-gray-800 p-6 text-center shadow-lg">
        <p className="mb-2 text-lg">
          Paket: <span className="font-semibold">{desc}</span>
        </p>
        <p className="mb-4 text-xl">
          Total:{' '}
          <span className="font-bold text-green-400">
            Rp {Number(amountParam).toLocaleString('id-ID')}
          </span>
        </p>

        {loading && <p className="text-gray-400">Sedang membuat QR...</p>}
        {error && (
          <pre className="text-left whitespace-pre-wrap text-red-400">
            {error}
          </pre>
        )}

        {!loading && !error && qrImage && (
          <div>
            <img
              src={qrImage}
              alt="QRIS Code"
              className="mx-auto mb-2 h-64 w-64 rounded border border-gray-600"
            />
            <p className="mb-2 text-gray-400">
              Scan QR code ini menggunakan aplikasi pembayaran favoritmu
            </p>

            <button
              onClick={async () => {
                const referenceNo = `ORDER-${Date.now()}`;
                const amount = Number(amountParam);
                try {
                  const res = await fetch(`${baseUrl}/api/callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      referenceNo,
                      amount,
                      status: 'PAID',
                    }),
                  });
                  const data = await res.json();
                  alert(`Callback diterima: ${data.resultMsg}`);
                } catch (err) {
                  console.error(err);
                  alert('Gagal simulasi bayar');
                }
              }}
              className="mt-2 w-full rounded bg-green-600 py-2 text-white hover:opacity-90"
            >
              Bayar (Simulasi)
            </button>
          </div>
        )}

        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-[#18E18C] via-[#77FFC6] to-[#FFD541] py-3 font-semibold text-black hover:opacity-90"
        >
          Kembali ke Home
        </button>
      </div>
    </div>
  );
}
