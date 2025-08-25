import { Link } from "react-router-dom";
import * as React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import { useNavigate } from "react-router-dom";

export type SettingsLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};



export default function SettingsLayout({ children, title }: SettingsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className=" container mx-auto px-4 py-8">
      <Navbar />
       
      <main className=" flex min-h-screen w-full pt-30 space-y-4">
        <button
      onClick={() => navigate(-1)} // kembali ke halaman sebelumnya
      className="rounded-2xl border border-gray-800 p-5 hidden md:flex flex-col w-32 bg-black/70 p-6 rounded-lg h-full mr-5 hover:bg-white/10 border-l-4 transition"
    >
      ⬅ Back
    </button>
        {/* Sidebar */}
        <aside className="rounded-2xl border border-gray-800 p-5 hidden md:flex flex-col w-64 bg-black/70 p-6 rounded-lg h-full">
        <h2 className="mb-6 text-3xl font-semibold">Settings</h2>
        <div className="flex flex-col gap-2">
          {[
            { title: "Profil", href: "/settings/profile", img: "/src/assets/icons/profile.svg" },
            { title: "Wallet", href: "/settings/wallet", img: "/src/assets/icons/wallet 4.svg" },
            { title: "Configuration", href: "/settings/configuration", img: "/src/assets/icons/Configuration.svg" },
            { title: "Transaction History", href: "/settings/transaction-history", img: "/src/assets/icons/transachistory.svg" },
            { title: "Log Out", href: "/settings/logout", img: "/src/assets/icons/logout.svg" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="rounded-2xl border border-gray-800 p-5 flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white/10 border-l-4 transition"
            >
              <img src={item.img} alt={item.title} className="w-6 h-6" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        </aside>
        {/* Mobile Sidebar */}
        <aside className="md:hidden fixed top-0 left-0 z-40 w-64 h-full bg-black/80 p-6 transition-transform -translate-x-full">
          {/* Implementasi toggle sidebar mobile sesuai kebutuhan */}
        </aside>
        {/* Main Content */}
        <section className="flex-1 pl-8">
          {title && <h1 className="text-3xl font-semibold mb-2">{title}</h1>}
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
}