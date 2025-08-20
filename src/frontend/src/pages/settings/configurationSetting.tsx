import SettingsLayout from "@/components/SettingsLayout";
import { useState } from "react";

export default function ConfigurationSetting() {
  const [darkMode, ] = useState(true);
  const [emailNotif, ] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = () => {
    // setiap kali toggle ditekan, munculkan popup
    setShowPopup(true);

    // kembalikan toggle ke keadaan semula (tidak aktif)
    setTimeout(() => {
      setShowPopup(false);
    }, 3000); // popup hilang setelah 3 detik, bisa diubah
  };

  return (
    <div className="w-full">
    <SettingsLayout>
        <div className="rounded-2xl border border-gray-800 p-5 rounded-lg shadow p-8 space-y-6">
      <h1 className="mb-6 text-3xl font-semibold">Configuration</h1>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span>Dark Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
           onClick={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-teal-500 transition"></div>
          <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? "translate-x-5" : ""}`}></div>
        </label>
      </div>

       

      {/* Email Notification Toggle */}
      <div className="flex items-center justify-between">
        <span>Email Notification</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={emailNotif}
            onClick={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-teal-500 transition"></div>
          <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${emailNotif ? "translate-x-5" : ""}`}></div>
        </label>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">On Maintenance</h2>
            <p className="mb-4">Toggle function coming soon.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      </div>
        </SettingsLayout>
    </div>
  );
}
