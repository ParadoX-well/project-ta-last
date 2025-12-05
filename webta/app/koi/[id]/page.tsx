'use client';

import { useState, useEffect, use } from 'react'; // Tambah 'use'
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contractConfig';
import { ShieldCheck, Calendar, Ruler, Activity, User, Tag, ArrowLeft, AlertCircle } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import QRCode from 'react-qr-code';

// Helper format tanggal
const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Tipe untuk Params di Next.js 15 adalah Promise
export default function KoiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. UNWRAP PARAMS MENGGUNAKAN USE()
  // Ini wajib di Next.js 15 karena params bersifat async
  const unwrappedParams = use(params);
  const koiId = decodeURIComponent(unwrappedParams.id);
  
  const [koiData, setKoiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKoiData = async () => {
        try {
            // Pastikan ID ada
            if (!koiId) return;

            // 2. Koneksi Read-Only ke Blockchain Lokal
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            console.log("Mencari ID:", koiId); // Debugging

            // 3. Ambil Data
            const data = await contract.getKoi(koiId);

            // 4. Cek apakah data kosong
            if (!data || !data.id) {
                setError(`Sertifikat dengan ID "${koiId}" tidak ditemukan di Blockchain.`);
            } else {
                setKoiData(data);
            }
        } catch (err: any) {
            console.error("Error Fetching:", err);
            // Cek apakah errornya karena network
            if (err.code === 'NETWORK_ERROR' || err.message.includes('could not detect network')) {
                setError("Gagal terhubung ke Blockchain. Pastikan terminal 'npx hardhat node' menyala!");
            } else {
                setError("Terjadi kesalahan saat membaca Smart Contract.");
            }
        } finally {
            setLoading(false);
        }
    };

    fetchKoiData();
  }, [koiId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
        Memuat Data Sertifikat...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <Navbar />
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-red-100 mt-10">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">{error}</p>
            <Link href="/" className="block w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
                Kembali ke Beranda
            </Link>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard-user" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition">
                <ArrowLeft size={20} /> Kembali
            </Link>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                <ShieldCheck size={16} /> Original Blockchain Asset
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 flex flex-col lg:flex-row">
            
            {/* KOLOM KIRI: FOTO & QR */}
            <div className="lg:w-1/2 bg-gray-100 relative group">
                {/* Gambar Utama */}
                <div className="w-full aspect-square relative bg-gray-200 overflow-hidden">
                     <img 
                        src={koiData.photoUrl} 
                        alt={koiData.variety} 
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                </div>
                
                {/* Badge QR Code Overlay */}
                <div className="absolute bottom-6 left-6 bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
                    <QRCode value={typeof window !== 'undefined' ? window.location.href : ''} size={80} />
                </div>
            </div>

            {/* KOLOM KANAN: DETAIL INFO */}
            <div className="lg:w-1/2 p-8 lg:p-12">
                
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{koiData.variety}</h1>
                    <div className="flex items-center gap-3">
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">ID Asset</span>
                        <p className="text-xl text-gray-500 font-mono">{koiData.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><User size={12}/> Breeder</p>
                        <p className="text-lg font-semibold text-gray-900">{koiData.breeder}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Activity size={12}/> Gender</p>
                        <p className="text-lg font-semibold text-gray-900">{koiData.gender}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> Umur</p>
                        <p className="text-lg font-semibold text-gray-900">{koiData.age}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Ruler size={12}/> Ukuran</p>
                        <p className="text-lg font-semibold text-gray-900">{Number(koiData.size)} cm</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Kondisi Fisik</p>
                        <p className="text-lg font-semibold text-gray-900">{koiData.condition}</p>
                    </div>
                </div>

                {/* Dokumen Pendukung */}
                <div className="space-y-4 mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase">Dokumen Aset</p>
                    <div className="flex flex-wrap gap-3">
                        {koiData.certUrl && koiData.certUrl !== "-" ? (
                            <a href={koiData.certUrl} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition shadow-sm">
                                <Tag size={16} /> Sertifikat Fisik
                            </a>
                        ) : <span className="text-gray-400 text-sm italic bg-gray-50 px-3 py-1 rounded">Tidak ada sertifikat fisik</span>}

                        {koiData.contestUrl && koiData.contestUrl !== "-" && (
                             <a href={koiData.contestUrl} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:border-blue-500 hover:text-blue-600 transition shadow-sm">
                                <Tag size={16} /> Sertifikat Juara
                            </a>
                        )}
                    </div>
                </div>

                {/* Metadata Blockchain */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-xs text-gray-500 space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Issuer Wallet:</span>
                        <span className="font-mono text-gray-700 truncate w-40 text-right" title={koiData.issuer}>{koiData.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Timestamp:</span>
                        <span className="text-gray-700 font-medium">{formatDate(koiData.timestamp)}</span>
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}