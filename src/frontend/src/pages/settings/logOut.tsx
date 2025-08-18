import SettingsLayout from "@/components/SettingsLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from 'react';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Internet Identity logout failed:', error);
      }
      navigate('/');
    };

  return (
    <div className="w-full">
        <SettingsLayout>
             <div className="rounded-2xl border border-gray-800 p-5rounded-lg shadow p-8 space-y-6">
      <h1 className="mb-6 text-3xl font-semibold">Log Out</h1>
      <p className="text-gray-500 mb-6">Yakin mau keluar dari akun?</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
      >
        Logout
      </button>
      </div>
      </SettingsLayout>
    </div>
  );
}
