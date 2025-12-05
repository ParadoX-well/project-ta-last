"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Wallet, User, Fish, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>(''); // State untuk Nama Tampilan
  const { account, connectWallet } = useWallet();

  // Fungsi mengambil data profile (Nama Lengkap) dari database
  const fetchProfileName = async (userId: string, email: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    
    // Jika ada full_name pakai itu, jika tidak pakai email (potong @)
    if (data?.full_name) {
      setDisplayName(data.full_name);
    } else {
      setDisplayName(email.split('@')[0]);
    }
  };

  useEffect(() => {
    // 1. Cek sesi awal saat halaman dimuat
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Ambil nama dari database segera setelah sesi ditemukan
        fetchProfileName(session.user.id, session.user.email!);
      }
    };
    checkUser();

    // 2. Listener perubahan auth (Login/Logout real-time)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfileName(currentUser.id, currentUser.email!);
      } else {
        setDisplayName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Logo & Home Link */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-orange-50 p-2 rounded-lg border border-orange-100 group-hover:bg-orange-100 transition">
          <Fish className="text-orange-600 w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-gray-900">WebKoi</span>
      </Link>

      {/* Menu Kanan */}
      <div className="flex items-center gap-4">
        
        {/* --- BAGIAN USER BIASA (Kiri) --- */}
        {user ? (
          // Jika User Sudah Login -> Link ke Dashboard
          <Link 
            href="/dashboard-user" 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-orange-50 hover:text-orange-600 transition border border-gray-200 group"
            title="Ke Dashboard Saya"
          >
            <div className="bg-white p-1 rounded-full shadow-sm group-hover:shadow-md transition">
                <User className="w-4 h-4" />
            </div>
            {/* Tampilkan Nama Asli atau Email */}
            <span className="text-sm font-bold max-w-[150px] truncate hidden sm:block capitalize">
                {displayName}
            </span>
          </Link>
        ) : (
          // Jika User Belum Login -> Link ke Halaman Login
          <Link 
            href="/login" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition"
          >
            <User className="w-4 h-4" />
            Login User
          </Link>
        )}

        {/* Garis Pemisah */}
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* --- BAGIAN ADMIN (Kanan) --- */}
        {account ? (
          // Jika Wallet Admin Terhubung -> Link ke Admin Panel
          <Link 
            href="/admin"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition shadow-lg hover:shadow-xl transform active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Panel
          </Link>
        ) : (
          // Jika Wallet Belum Terhubung -> Tombol Connect
          <button 
            onClick={connectWallet}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}