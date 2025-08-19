import {useState } from 'react';
import SettingsLayout from '@/components/SettingsLayout';

export default function WalletSetting() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [principalID, setPrincipalID] = useState("");

  const handleLogin = () => {
    // Simulasi login NFID
    // Di implementasi asli, di sini panggil fungsi NFID connect
    setPrincipalID("abcd-efgh-ijkl-mnop-qrst-uvwx");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setPrincipalID("");
    setIsLoggedIn(false);
  };

  return (
    <div className="w-full">
      <SettingsLayout>
      <div className="rounded-2xl border border-gray-800 p-5 rounded-lg shadow p-8 space-y-6">
      <h4 className="mb-6 text-3xl font-semibold">Wallet Connect</h4>
 {!isLoggedIn ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 text-sm">Anda belum login ke NFID.</p>
          <button
            onClick={handleLogin}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          >
            Connect with NFID
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 font-medium">
            ✅ Sudah login dengan NFID
          </p>
          <div className="text-sm text-gray-700">
            <strong>Principal ID:</strong> {principalID}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
</div>

      </SettingsLayout>
    </div>
  );
}