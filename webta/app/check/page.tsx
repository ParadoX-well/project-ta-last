'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contractConfig';
import { Search, ShieldCheck, CheckCircle, Calendar, Ruler, Activity, User, Tag } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { useSearchParams } from 'next/navigation';

export default function CheckCertificatePage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [koiData, setKoiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper untuk format tanggal dari Timestamp Blockchain
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    // Konversi BigInt ke Number dulu, lalu kali 1000 (karena JS pakai miliseconds)
    const date = new Date(Number(timestamp) * 1000); 
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  // Fungsi Cek ke Blockchain
  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchId.trim()) {
        setError("Masukkan ID Koi!");
        return;
    }

    setLoading(true);
    setError('');
    setKoiData(null);

    try {
        // 1. Koneksi ke Node Ethereum (Localhost Hardhat)
        // Kita pakai JsonRpcProvider karena user biasa tidak perlu connect wallet untuk CUMA BACA data
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/"); 
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // 2. Panggil Fungsi Smart Contract
        const data = await contract.getKoi(searchId);

        // 3. Cek apakah data ada (Jika ID kosong artinya tidak ada)
        if (!data || !data.id) {
            setError("Data Koi tidak ditemukan di Blockchain!");
        } else {
            setKoiData(data);
        }

    } catch (err: any) {
        console.error(err);
        setError("Gagal terhubung ke Blockchain. Pastikan Hardhat node menyala.");
    } finally {
        setLoading(false);
    }
  };

  // Otomatis cek jika ada parameter ?id=... di URL
  useEffect(() => {
      if (initialId) handleCheck();
  }, [initialId]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* HEADER PENCARIAN */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifikasi Keaslian</h1>
            <p className="text-gray-500 mb-8">Cek data sertifikat digital Ikan Koi yang tercatat di Blockchain.</p>

            <form onSubmit={handleCheck} className="max-w-lg mx-auto relative">
                <input 
                    type="text" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Masukkan ID Koi (Contoh: KOI-2025-888)" 
                    className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none text-lg shadow-sm transition"
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-2 bg-orange-600 text-white p-2.5 rounded-full hover:bg-orange-700 transition shadow-md"
                >
                    <Search size={24} />
                </button>
            </form>
        </div>

        {/* STATUS LOADING / ERROR */}
        {loading && (
            <div className="text-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Sedang mencari di buku besar Blockchain...</p>
            </div>
        )}

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center max-w-lg mx-auto">
                <p className="font-bold mb-1">Pencarian Gagal</p>
                <p className="text-sm">{error}</p>
            </div>
        )}

        {/* HASIL DATA (KARTU SERTIFIKAT) */}
        {koiData && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animation-fade-in-up">
                
                {/* Header Sertifikat */}
                <div className="bg-gray-900 text-white p-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/50 text-green-300 px-4 py-1 rounded-full text-sm font-bold mb-4">
                            <ShieldCheck size={16} /> TERVERIFIKASI BLOCKCHAIN
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight mb-1">{koiData.variety}</h2>
                        <p className="text-gray-400 font-mono">{koiData.id}</p>
                    </div>
                    {/* Hiasan background */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                <div className="flex flex-col md:flex-row">
                    
                    {/* Kolom Kiri: Foto */}
                    <div className="w-full md:w-1/2 bg-gray-100 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner bg-white">
                            {/* INI GAMBAR DARI URL YANG DISIMPAN DI BLOCKCHAIN */}
                            <img 
                                src={koiData.photoUrl} 
                                alt="Foto Ikan" 
                                className="w-full h-full object-cover hover:scale-110 transition duration-700"
                            />
                        </div>
                    </div>

                    {/* Kolom Kanan: Detail Data */}
                    <div className="w-full md:w-1/2 p-8">
                        <h3 className="font-bold text-gray-900 text-xl mb-6 border-b pb-2">Spesifikasi Aset</h3>
                        
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <User size={20} /> <span>Breeder</span>
                                </div>
                                <span className="font-bold text-gray-900">{koiData.breeder}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Activity size={20} /> <span>Gender</span>
                                </div>
                                <span className="font-bold text-gray-900">{koiData.gender}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Calendar size={20} /> <span>Umur (Age)</span>
                                </div>
                                <span className="font-bold text-gray-900">{koiData.age}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Ruler size={20} /> <span>Ukuran</span>
                                </div>
                                <span className="font-bold text-gray-900">{Number(koiData.size)} cm</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <CheckCircle size={20} /> <span>Kondisi</span>
                                </div>
                                <span className="font-bold text-gray-900">{koiData.condition}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 space-y-2">
                            <div className="flex justify-between">
                                <span>Dicatat Pada:</span>
                                <span>{formatDate(koiData.timestamp)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Issuer Address:</span>
                                <span className="font-mono truncate max-w-[150px]">{koiData.issuer}</span>
                            </div>
                        </div>

                        {/* Tombol Lihat Dokumen Tambahan */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {koiData.certUrl !== "-" && (
                                <a href={koiData.certUrl} target="_blank" className="flex items-center justify-center gap-2 bg-orange-50 text-orange-700 py-2 rounded-lg text-sm font-bold hover:bg-orange-100 transition">
                                    <Tag size={16} /> Sertifikat Asli
                                </a>
                            )}
                            {koiData.contestUrl !== "-" && (
                                <a href={koiData.contestUrl} target="_blank" className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">
                                    <Tag size={16} /> Sertifikat Lomba
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}