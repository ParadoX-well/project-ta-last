import { Fish, MapPin, Phone, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white"> 
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Kolom 1: Informasi Utama */}
        <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Icon Box: Background Orange Muda */}
              <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <Fish className="text-orange-600" size={24} />
              </div>
              {/* Teks Judul: Hitam */}
              <span className="text-xl font-bold text-gray-900">WebKoi</span>
            </div>
            
            <p className="font-semibold text-gray-700">Otoritas Sertifikasi Digital Koi</p>
            
            <div className="space-y-3 text-gray-600 text-sm">
              <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-orange-600" />
                  <span>Jl. Koi Juara No. 123, Kota Serang, Banten 42111</span>
              </div>
              <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 flex-shrink-0 text-orange-600" />
                  <span>(0254) 123 4567</span>
              </div>
            </div>
        </div>

        {/* Kolom 2: Tautan Navigasi */}
        <div>
            {/* Judul Kolom: Hitam dengan garis bawah abu-abu */}
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase border-b border-gray-200 pb-2 inline-block mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-orange-600 transition font-medium">Beranda</a></li>
              <li><a href="/check" className="text-gray-600 hover:text-orange-600 transition font-medium">Verifikasi Sertifikat</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition font-medium">Tentang Kami</a></li>
            </ul>
        </div>

        {/* Kolom 3: Sosial Media */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase border-b border-gray-200 pb-2 inline-block mb-4">
              Tetap Terhubung
            </h3>
            <ul className="space-y-3">
              <li>
                  <a href="https://www.facebook.com/andika.attarfizrah/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
                  <Facebook size={20} /> Facebook
                  </a>
              </li>
              <li>
                  <a href="https://www.instagram.com/andikaaaf_/?hl=id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition font-medium">
                  <Instagram size={20} /> Instagram
                  </a>
              </li>
              <li>
                  <a href="https://www.youtube.com/@andikaattarfizrah8609" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition font-medium">
                  <Youtube size={20} /> Youtube
                  </a>
              </li>
            </ul>
        </div>
        </div>
      </div>
      
      {/* Bagian Copyright: Background Abu-abu Sangat Muda */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto py-6 px-4 text-center text-gray-500 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} Andika Attar Fizrah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}