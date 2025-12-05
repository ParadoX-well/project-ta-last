'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Memanggil koneksi supabase
import { Mail, Lock, Loader2, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  
  // State untuk form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk pindah mode (Login <-> Register)
  const [isRegister, setIsRegister] = useState(false);

  // Fungsi menangani tombol Submit
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        // --- LOGIKA REGISTER ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Pendaftaran berhasil! Silakan cek email untuk konfirmasi (atau langsung login jika mode development).");
        setIsRegister(false); // Balikin ke mode login

      } else {
        // --- LOGIKA LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Login berhasil! Mengalihkan...");
        // Nanti kita arahkan ke Dashboard User
        setTimeout(() => {
            router.push('/dashboard-user'); 
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      {/* Tombol Kembali */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-orange-600 transition font-medium">
        <ArrowLeft size={20} /> Kembali ke Beranda
      </Link>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Form */}
        <div className="bg-orange-600 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Buat Akun Baru' : 'Selamat Datang'}
          </h2>
          <p className="text-orange-100">
            {isRegister ? 'Daftar untuk mengelola koleksi Koi Anda' : 'Masuk untuk mengakses dashboard'}
          </p>
        </div>

        {/* Body Form */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Tombol Aksi Utama */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isRegister ? (
                <> <UserPlus size={20} /> Daftar Sekarang </>
              ) : (
                <> <LogIn size={20} /> Masuk Akun </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 font-bold text-orange-600 hover:text-orange-700 transition"
              >
                {isRegister ? 'Login disini' : 'Daftar sekarang'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}