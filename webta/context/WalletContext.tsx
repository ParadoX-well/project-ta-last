'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

// --- PERBAIKAN UTAMA ADA DI SINI ---
// Kita memberitahu TypeScript: "Tolong izinkan properti 'ethereum' di objek window"
declare global {
  interface Window {
    ethereum: any; // Kita set 'any' biar fleksibel
  }
}

// --- CONFIG ADMIN ---
// Ganti dengan alamat wallet kamu
const ADMIN_WALLETS = [
  "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", // Akun #19 Hardhat (Contoh)
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"  // Wallet Asli Kamu
].map(addr => addr.toLowerCase());

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isAdmin: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);

  // Cek koneksi saat refresh halaman
  useEffect(() => {
    const checkConnection = async () => {
      // Cek dulu apakah window.ethereum ada (sekarang TS tidak akan marah)
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const connectedAccount = accounts[0].toLowerCase();
            
            // Cek Whitelist (Diam-diam)
            if (ADMIN_WALLETS.includes(connectedAccount)) {
              setAccount(connectedAccount);
            } else {
              // Jika wallet nempel tapi bukan admin
              console.log("Wallet terdeteksi tapi bukan Admin.");
              setAccount(null);
            }
          }
        } catch (error) {
          console.error("Gagal cek koneksi:", error);
        }
      }
    };

    checkConnection();

    // Listener jika user ganti akun di Metamask
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0].toLowerCase();
          if (ADMIN_WALLETS.includes(newAccount)) {
            setAccount(newAccount);
            toast.success("Akun Admin Terdeteksi");
          } else {
            setAccount(null);
            toast.error("Akun diganti: Bukan Admin!");
            // Optional: Redirect ke home jika bukan admin
            // window.location.href = '/'; 
          }
        } else {
          setAccount(null);
          toast.success("Wallet Disconnected");
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0].toLowerCase();

        if (ADMIN_WALLETS.includes(walletAddress)) {
            setAccount(walletAddress);
            toast.success("Selamat Datang Admin!");
        } else {
            setAccount(null);
            toast.error("AKSES DITOLAK: Wallet Anda tidak terdaftar sebagai Admin!");
        }

      } catch (err) {
        toast.error("Gagal menghubungkan wallet.");
      }
    } else {
      toast.error("Metamask tidak terdeteksi! Silakan install.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast.success("Wallet Admin Disconnected");
  };

  return (
    <WalletContext.Provider value={{ 
        account, 
        connectWallet, 
        disconnectWallet,
        isAdmin: !!account 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}