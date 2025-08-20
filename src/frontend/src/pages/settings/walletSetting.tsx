import SettingsLayout from "@/components/SettingsLayout";
import { useAuth } from "@/hooks/useAuth"; // hook auth yang kamu pakai
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WalletSetting() {
  const { isAuthenticated, principal, loginWithEmail, logout } = useAuth();
  const [principalID, setPrincipalID] = useState<string>("");
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Internet Identity logout failed:', error);
      }
      navigate('/');
    };

  useEffect(() => {
    if (principal) {
      setPrincipalID(principal.toString());
    } else {
      setPrincipalID("");
    }
  }, [principal]);

  const [email] = useState("");
const [password] = useState("");

// ...
<button
  onClick={() => loginWithEmail({ email, password })}
  className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
>
  Login
</button>


  return (
    <div className="w-full">
      <SettingsLayout>
        <div className="rounded-2xl border border-gray-800 p-8 shadow space-y-6">
          <h4 className="mb-6 text-3xl font-semibold">Wallet Connect</h4>

          {!isAuthenticated ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-600 text-sm">
                Anda belum login ke Internet Identity.
              </p>
              <button
                onClick={() => loginWithEmail({ email, password })}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
              >
                Connect with Internet Identity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                ✅ Sudah login dengan Internet Identity
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
