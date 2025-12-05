'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Info, Search, Users } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [koiId, setKoiId] = useState('');
  const router = useRouter();

  const handleVerification = (e: FormEvent) => {
    e.preventDefault();
    
    if (!koiId.trim()) {
      toast.error("Silakan masukkan ID Koi terlebih dahulu.");
      return;
    }
    
    toast.loading("Mengecek Blockchain...", { duration: 1000 });

    setTimeout(() => {
        router.push(`/koi/${koiId}`); 
    }, 1000);
  };

  return (
    // Ubah background utama menjadi abu-abu sangat muda (gray-50) agar bersih
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      <Navbar />
      <Toaster position="top-center" />

      <main className="flex-grow">
        
        {/* === HERO SECTION (Background Putih) === */}
        <section className="bg-white py-24 md:py-32 border-b border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
              Keaslian Digital untuk <span className="text-orange-600">Koi Juara</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Platform Web3 untuk menerbitkan dan memverifikasi sertifikat keaslian Ikan Koi, dicatat secara permanen, aman, dan transparan di blockchain.
            </p>
            <Link 
              href="#verifikasi"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
            >
              <ShieldCheck size={22} />
              Mulai Verifikasi
            </Link>
          </div>
        </section>

        {/* === FITUR / KEUNGGULAN (Background Abu-abu Muda) === */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition duration-300">
              <div className="inline-block p-4 bg-cyan-50 rounded-full mb-6">
                  <Info size={32} className="text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Informasi Akurat</h3>
              <p className="text-gray-600 leading-relaxed">
                Setiap data diverifikasi oleh blockchain, memastikan tidak ada pemalsuan dan riwayat yang transparan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition duration-300">
              <div className="inline-block p-4 bg-orange-50 rounded-full mb-6">
                  <Users size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Milik Anda Selamanya</h3>
              <p className="text-gray-600 leading-relaxed">
                Sertifikat digital Anda disimpan secara terdesentralisasi, tidak dapat dihapus atau diubah oleh siapa pun.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition duration-300">
              <div className="inline-block p-4 bg-indigo-50 rounded-full mb-6">
                  <Search size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verifikasi Instan</h3>
              <p className="text-gray-600 leading-relaxed">
                Cukup masukkan ID Koi atau scan QR code untuk melihat seluruh riwayat keasliannya dalam hitungan detik.
              </p>
            </div>

          </div>
        </section>

        {/* === FORM VERIFIKASI (Card Putih Menonjol) === */}
        <section id="verifikasi" className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-10 md:p-12 relative overflow-hidden">
                
                {/* Hiasan Background Abstrak (Opsional) */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cek Sertifikat Digital</h2>
                    <p className="text-gray-500 mb-8 text-lg">Masukkan ID Koi atau Hash Transaksi untuk mengecek data di Ethereum.</p>
                    
                    <form onSubmit={handleVerification} className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="text" 
                        name="koiId" 
                        value={koiId}
                        onChange={(e) => setKoiId(e.target.value)}
                        // Input menjadi putih bersih dengan border abu-abu
                        className="flex-grow block w-full rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 px-6 py-4 focus:bg-white focus:border-orange-500 focus:ring-0 transition-colors text-lg placeholder-gray-400" 
                        placeholder="Contoh: KOI-888" 
                      />
                      <button 
                        type="submit"
                        className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform active:scale-95"
                      >
                        <Search className="mr-2 w-5 h-5" />
                        Cek
                      </button>
                    </form>
                </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}