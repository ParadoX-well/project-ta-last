'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { supabase } from '@/lib/supabase';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contractConfig';
import { ethers } from 'ethers';
import { Upload, Save, Loader2, ArrowLeft, QrCode as QrIcon } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'react-qr-code';

export default function MintKoiPage() {
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [mintedData, setMintedData] = useState<any>(null);

  // 1. State Data Text
  const [formData, setFormData] = useState({
    id: '',
    variety: '',
    breeder: '',
    gender: 'Tidak Diketahui',
    age: '',
    size: '',
    condition: '',
  });

  // 2. State File
  const [files, setFiles] = useState<{ photo: File | null, cert: File | null, contest: File | null }>({
    photo: null,
    cert: null,
    contest: null
  });

  // Helper Update State
  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any, type: 'photo' | 'cert' | 'contest') => {
    if (e.target.files?.[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  // 3. Fungsi Upload ke Supabase Storage
  const uploadToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`;
    
    // Upload ke Bucket 'koi-assets' (Pastikan bucket ini sudah dibuat di Supabase)
    const { error } = await supabase.storage.from('koi-assets').upload(fileName, file);
    if (error) throw error;

    const { data } = supabase.storage.from('koi-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // 4. PROSES UTAMA: MINTING
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) return toast.error("Koneksikan Wallet Admin dulu!");
    if (!files.photo) return toast.error("Foto Ikan Wajib Diisi!");

    setLoading(true);
    const toastId = toast.loading("Memulai proses...");

    try {
      // A. Upload File ke Supabase
      toast.loading("Mengupload foto ke Cloud...", { id: toastId });
      const photoUrl = await uploadToStorage(files.photo, 'photos');
      const certUrl = files.cert ? await uploadToStorage(files.cert, 'certs') : "-";
      const contestUrl = files.contest ? await uploadToStorage(files.contest, 'contests') : "-";

      // B. Koneksi ke Blockchain
      toast.loading("Menghubungkan ke Smart Contract...", { id: toastId });
      // Note: Ethers v6 syntax
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // C. Tulis ke Blockchain
      toast.loading("Silakan Konfirmasi di Metamask...", { id: toastId });
      
      // Panggil fungsi 'mintCertificate' di Smart Contract
      const tx = await contract.mintCertificate(
        formData.id,
        formData.variety,
        formData.breeder,
        formData.gender,
        formData.age,
        parseInt(formData.size), // Convert string to number karena di contract uint256
        formData.condition,
        photoUrl,
        certUrl,
        contestUrl
      );

      toast.loading("Menunggu Konfirmasi Block...", { id: toastId });
      await tx.wait(); // Tunggu sampai transaksi selesai dicatat miner

      toast.success("SERTIFIKAT BERHASIL DITERBITKAN!", { id: toastId });

      // D. Tampilkan Hasil
      setMintedData({
        ...formData,
        photoUrl,
        txHash: tx.hash,
        // URL ini nanti bisa discan user untuk melihat detail (halaman /check)
        verifyUrl: `${window.location.origin}/check?id=${formData.id}` 
      });

    } catch (err: any) {
      console.error(err);
      toast.error("Gagal: " + (err.reason || err.message || "Cek console"), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // --- TAMPILAN SUKSES (QR CODE) ---
  if (mintedData) {
      return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col items-center justify-center p-4">
            <Navbar />
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full text-center mt-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <QrIcon size={40} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-green-700 mb-2">Sertifikat Terbit!</h2>
                <p className="text-gray-500 mb-8">Aset Koi telah tercatat permanen di Blockchain.</p>

                {/* QR CODE */}
                <div className="bg-white p-4 border-4 border-gray-900 rounded-2xl inline-block mb-6 shadow-sm">
                    <QRCode value={mintedData.verifyUrl} size={220} />
                </div>
                <p className="text-xs text-gray-400 mb-6">Scan QR ini untuk cek keaslian</p>

                <div className="text-left bg-gray-50 p-5 rounded-xl text-sm space-y-3 mb-6 border border-gray-200">
                    <div className="flex justify-between">
                        <span className="text-gray-500">ID Koi:</span>
                        <span className="font-bold">{mintedData.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Varietas:</span>
                        <span className="font-bold">{mintedData.variety}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tx Hash:</span>
                        <a 
                            href={`https://etherscan.io/tx/${mintedData.txHash}`} // Nanti ganti block explorer lokal
                            target="_blank"
                            className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded truncate max-w-[150px] hover:underline" 
                            title={mintedData.txHash}
                        >
                            {mintedData.txHash}
                        </a>
                    </div>
                </div>

                <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
                >
                    Input Ikan Lain
                </button>
            </div>
        </div>
      )
  }

  // --- TAMPILAN FORM UTAMA ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <Toaster position="top-center" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1 mb-2">
                <ArrowLeft size={16} /> Kembali ke Admin Panel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Minting Sertifikat Blockchain</h1>
            <p className="text-gray-500">Isi data lengkap untuk mencetak Smart Contract Ikan Koi.</p>
        </div>

        <form onSubmit={handleMint} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-8 space-y-8">
            
            {/* BAGIAN 1: IDENTITAS */}
            <div>
                <h3 className="font-bold text-lg border-b border-gray-100 pb-3 mb-5 text-orange-600">1. Identitas Koi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">ID Koi (Unik)</label>
                        <input required name="id" onChange={handleInputChange} type="text" placeholder="Contoh: KOI-2025-888" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Varietas</label>
                        <select required name="variety" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                            <option value="">-- Pilih Varietas --</option>
                            <option value="Kohaku">Kohaku</option>
                            <option value="Taisho Sanshoku">Taisho Sanshoku (Sanke)</option>
                            <option value="Showa Sanshoku">Showa Sanshoku</option>
                            <option value="Shiro Utsuri">Shiro Utsuri</option>
                            <option value="Tancho">Tancho</option>
                            <option value="Asagi">Asagi</option>
                            <option value="Shusui">Shusui</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Breeder / Farm</label>
                        <input required name="breeder" onChange={handleInputChange} type="text" placeholder="Contoh: Dainichi Koi Farm" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                        <select name="gender" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                            <option value="Tidak Diketahui">Tidak Diketahui</option>
                            <option value="Jantan">Jantan</option>
                            <option value="Betina">Betina</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* BAGIAN 2: DATA FISIK */}
            <div>
                <h3 className="font-bold text-lg border-b border-gray-100 pb-3 mb-5 text-orange-600">2. Data Fisik</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Umur (Age)</label>
                        <select name="age" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl outline-none bg-white">
                            <option value="">-- Pilih Umur --</option>
                            <option value="Tosai">Tosai (1 thn)</option>
                            <option value="Nisai">Nisai (2 thn)</option>
                            <option value="Sansai">Sansai (3 thn)</option>
                            <option value="Yonsai">Yonsai (4 thn)</option>
                            <option value="Gonsai">Gonsai (5 thn+)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ukuran (cm)</label>
                        <input required name="size" type="number" onChange={handleInputChange} placeholder="55" className="w-full p-3 border border-gray-300 rounded-xl outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kondisi Fisik</label>
                        <input required name="condition" type="text" onChange={handleInputChange} placeholder="Sehat, Perfect, Ada cacat sirip..." className="w-full p-3 border border-gray-300 rounded-xl outline-none" />
                    </div>
                </div>
            </div>

            {/* BAGIAN 3: UPLOAD FOTO */}
            <div>
                <h3 className="font-bold text-lg border-b border-gray-100 pb-3 mb-5 text-orange-600">3. Dokumen & Foto</h3>
                <div className="space-y-6">
                    
                    {/* Foto Utama */}
                    <div className="border-2 border-dashed border-orange-200 bg-orange-50 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-orange-100/50 transition cursor-pointer relative group">
                        <Upload className="mb-3 w-10 h-10 text-orange-400" />
                        <span className="font-bold text-gray-700">Upload Foto Ikan (Wajib)</span>
                        <span className="text-xs mt-1">Format: JPG/PNG, Maks 5MB</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {files.photo && <span className="mt-2 text-sm text-green-600 font-bold bg-white px-2 py-1 rounded">File: {files.photo.name}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sertifikat Asli */}
                        <div className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition">
                            <span className="block font-bold text-sm mb-2 text-gray-700">Sertifikat Asli (Opsional)</span>
                            <p className="text-xs text-gray-400 mb-3">Jika ikan import atau sudah punya sertifikat fisik.</p>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cert')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                        </div>
                        
                        {/* Sertifikat Lomba */}
                        <div className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition">
                            <span className="block font-bold text-sm mb-2 text-gray-700">Sertifikat Lomba (Opsional)</span>
                            <p className="text-xs text-gray-400 mb-3">Bukti prestasi jika pernah juara kontes.</p>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'contest')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* TOMBOL SUBMIT */}
            <button 
                type="submit" 
                disabled={loading || !account}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? "Sedang Memproses ke Blockchain..." : "Minting Sertifikat Sekarang"}
            </button>

        </form>
      </main>
    </div>
  );
}