'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User, ShieldAlert, ShieldCheck, Clock, Upload, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Data User
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState(''); // State untuk input nama

  // 1. Cek Login & Ambil Data Profile
  useEffect(() => {
    const getData = async () => {
      // Cek User Login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/login');
        return;
      }
      setUser(user);

      // Ambil Data Profile (Status Verifikasi & Nama) dari database
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Jika belum ada data profile, inisialisasi object dummy
      if (!profileData) {
         profileData = { verification_status: 'unverified' };
      } else {
         // Jika nama sudah ada di database, isi ke state agar form terisi otomatis
         if (profileData.full_name) {
            setFullName(profileData.full_name);
         }
      }

      setProfile(profileData);
      setLoading(false);
    };

    getData();
  }, [router]);

  // 2. Fungsi Upload KTP & Simpan Nama
  const handleUploadKTP = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file || !user) return;

      // Validasi input nama
      if (!fullName.trim()) {
        toast.error("Isi nama lengkap dulu sesuai KTP!");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Upload File ke Storage
      const { error: uploadError } = await supabase.storage
        .from('ktp-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan URL Public gambar
      const { data: { publicUrl } } = supabase.storage.from('ktp-documents').getPublicUrl(filePath);

      // B. Update Database (Simpan Nama & URL Foto & Ubah Status)
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          full_name: fullName, // Simpan Nama yang diketik user
          ktp_url: publicUrl,
          verification_status: 'pending', 
        });

      if (dbError) throw dbError;

      toast.success("Berhasil! Menunggu verifikasi admin.");
      window.location.reload(); // Reload agar tampilan terupdate

    } catch (error: any) {
      toast.error("Gagal upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  // Helper untuk menampilkan badge status warna-warni
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200"><ShieldCheck size={16} /> Terverifikasi</span>;
      case 'pending': return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold border border-yellow-200"><Clock size={16} /> Menunggu Verifikasi</span>;
      default: return <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold border border-gray-200"><ShieldAlert size={16} /> Belum Verifikasi</span>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Toaster position="top-center" />

      {/* === NAVBAR DASHBOARD === */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
            {/* Tombol Balik ke Home */}
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition group">
                <div className="p-2 bg-gray-100 rounded-full group-hover:bg-orange-50 border border-gray-200 group-hover:border-orange-200 transition">
                    <ArrowLeft size={20} />
                </div>
                <span className="hidden sm:block font-medium">Beranda</span>
            </Link>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            {/* Info User di Navbar */}
            <div className="flex items-center gap-2">
                <div className="bg-orange-50 p-2 rounded-lg hidden xs:block">
                    <User className="text-orange-600 w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-normal leading-none">Profil Pengguna</span>
                    {/* Tampilkan Nama Lengkap jika ada, kalau tidak tampilkan potongan email */}
                    <span className="text-lg font-bold text-gray-900 leading-tight capitalize">
                        {fullName || user?.email?.split('@')[0]}
                    </span>
                </div>
            </div>
        </div>
        
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-red-100">
          <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
        </button>
      </nav>

      {/* === KONTEN UTAMA === */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        
        {/* KARTU INFO AKUN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <FileText className="text-gray-400" size={20}/> Informasi Akun
                </h2>
                {getStatusBadge(profile?.verification_status || 'unverified')}
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                    <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 capitalize">
                        {fullName || '-'}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Terdaftar</label>
                    <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                        <User size={16} className="text-gray-400"/> {user?.email}
                    </p>
                </div>
            </div>
        </div>

        {/* AREA VERIFIKASI (KYC) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                <h2 className="font-bold text-lg text-orange-900">Verifikasi Identitas (KYC)</h2>
                <p className="text-sm text-orange-700">Wajib dilakukan agar akun Anda terpercaya.</p>
            </div>
            
            <div className="p-8">
                
                {/* KONDISI 1: SUDAH VERIFIED (HIJAU) */}
                {profile?.verification_status === 'verified' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-green-700">Akun Anda Terverifikasi!</h3>
                        <p className="text-gray-500 mt-2 mb-6">Identitas valid. Anda sekarang dapat mengajukan sertifikasi.</p>
                        
                        {/* Tombol ke Halaman Pengajuan Ikan */}
                        <Link href="/request-certificate" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-1">
                          <FileText size={20} /> Ajukan Sertifikasi Baru
                        </Link>
                    </div>
                )}

                {/* KONDISI 2: PENDING (KUNING) */}
                {profile?.verification_status === 'pending' && (
                    <div className="text-center py-8">
                         <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Clock size={32} className="text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Sedang Ditinjau Admin</h3>
                        <p className="text-gray-500 mt-2">Dokumen KTP Anda sedang dalam proses verifikasi. Mohon tunggu.</p>
                    </div>
                )}

                {/* KONDISI 3: UNVERIFIED / DITOLAK (Isi Form) */}
                {(profile?.verification_status === 'unverified' || profile?.verification_status === 'rejected') && (
                    <div className="space-y-6">
                         {profile?.verification_status === 'rejected' && (
                             <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-center gap-2">
                                 <ShieldAlert size={20} />
                                 <span>Maaf, pengajuan sebelumnya <b>Ditolak</b>. Silakan perbaiki data dan upload ulang.</span>
                             </div>
                         )}

                        {/* Input Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap (Sesuai KTP)</label>
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Masukkan nama lengkap..."
                                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            />
                        </div>

                        {/* Input Upload Foto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto KTP</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative group">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleUploadKTP}
                                    disabled={uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                />
                                <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-orange-600 transition">
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                            <span className="text-sm font-medium">Mengupload dokumen...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-gray-100 rounded-full group-hover:bg-orange-100 transition">
                                                <Upload size={24} className="text-gray-400 group-hover:text-orange-600" />
                                            </div>
                                            <span className="font-medium text-gray-700 group-hover:text-orange-700">Klik untuk pilih foto KTP</span>
                                            <span className="text-xs text-gray-400">Format: JPG/PNG, Maks 5MB</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}