'use client';

import { useWallet } from '@/context/WalletContext';
import { Wallet, FileCheck, Fish, Database, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const { account, connectWallet } = useWallet();

  // Proteksi: Jika belum connect, tampilkan layar login admin
  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <Navbar /> {/* Tetap tampilkan Navbar biar bisa connect dari atas */}
        <div className="mt-20">
             <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="text-red-600 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Dibatasi</h1>
                <p className="text-gray-500 mb-8">Halaman ini khusus untuk Administrator. Silakan hubungkan Wallet Anda untuk melanjutkan.</p>
                <button 
                onClick={connectWallet}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition shadow-lg"
                >
                <Wallet size={24} />
                Hubungkan Wallet
                </button>
             </div>
        </div>
      </div>
    );
  }

  // Tampilan Menu Admin (Jika Connected)
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <Toaster position="top-center" />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Halo Admin, wallet terhubung: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm text-gray-700">{account}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* MENU 1: ACC KTP */}
            <Link href="/admin/verify-ktp" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition duration-300">
                <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition">
                    <FileCheck className="text-orange-600 w-7 h-7 group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verifikasi KTP</h3>
                <p className="text-gray-500 text-sm mb-6">Cek dan validasi foto KTP pengguna baru untuk mengaktifkan fitur pengajuan.</p>
                <div className="flex items-center text-orange-600 font-bold text-sm group-hover:translate-x-2 transition">
                    Buka Halaman <ArrowRight size={16} className="ml-2" />
                </div>
            </Link>

            {/* MENU 2: CEK SERTIFIKAT */}
            <Link href="/admin/verify-koi" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition duration-300">
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">
                    <Fish className="text-blue-600 w-7 h-7 group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cek Pengajuan Koi</h3>
                <p className="text-gray-500 text-sm mb-6">Periksa data ikan koi yang diajukan user. Setujui atau tolak data tersebut.</p>
                <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-2 transition">
                    Buka Halaman <ArrowRight size={16} className="ml-2" />
                </div>
            </Link>

            {/* MENU 3: MINTING BLOCKCHAIN (SUDAH AKTIF SEKARANG) */}
            <Link href="/admin/mint-koi" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-200 transition duration-300">
                <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition">
                    <Database className="text-purple-600 w-7 h-7 group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Minting ke Blockchain</h3>
                <p className="text-gray-500 text-sm mb-6">Upload data ikan yang sudah disetujui ke jaringan Ethereum (Smart Contract).</p>
                <div className="flex items-center text-purple-600 font-bold text-sm group-hover:translate-x-2 transition">
                    Mulai Minting <ArrowRight size={16} className="ml-2" />
                </div>
            </Link>

        </div>
      </main>
    </div>
  );
}