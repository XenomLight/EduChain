import SettingsLayout from "@/components/SettingsLayout";
import { useState } from "react";

export default function ConfigurationSetting() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

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
            onChange={() => setDarkMode(!darkMode)}
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
            onChange={() => setEmailNotif(!emailNotif)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-teal-500 transition"></div>
          <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${emailNotif ? "translate-x-5" : ""}`}></div>
        </label>
      </div>
      </div>
        </SettingsLayout>
    </div>
  );
}
