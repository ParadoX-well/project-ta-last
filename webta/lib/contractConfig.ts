// 1. GANTI ALAMAT INI DENGAN HASIL DEPLOY KAMU
// Contoh: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// 2. INI ADALAH ABI (Application Binary Interface)
// Ini "Kamus" agar website tahu fungsi apa saja yang ada di Smart Contract
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "id", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "variety", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" }
    ],
    "name": "KoiMinted",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_id", "type": "string" },
      { "internalType": "string", "name": "_variety", "type": "string" },
      { "internalType": "string", "name": "_breeder", "type": "string" },
      { "internalType": "string", "name": "_gender", "type": "string" },
      { "internalType": "string", "name": "_age", "type": "string" },
      { "internalType": "uint256", "name": "_size", "type": "uint256" },
      { "internalType": "string", "name": "_condition", "type": "string" },
      { "internalType": "string", "name": "_photoUrl", "type": "string" },
      { "internalType": "string", "name": "_certUrl", "type": "string" },
      { "internalType": "string", "name": "_contestUrl", "type": "string" }
    ],
    "name": "mintCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getKoi",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "id", "type": "string" },
          { "internalType": "string", "name": "variety", "type": "string" },
          { "internalType": "string", "name": "breeder", "type": "string" },
          { "internalType": "string", "name": "gender", "type": "string" },
          { "internalType": "string", "name": "age", "type": "string" },
          { "internalType": "uint256", "name": "size", "type": "uint256" },
          { "internalType": "string", "name": "condition", "type": "string" },
          { "internalType": "string", "name": "photoUrl", "type": "string" },
          { "internalType": "string", "name": "certUrl", "type": "string" },
          { "internalType": "string", "name": "contestUrl", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "address", "name": "issuer", "type": "address" }
        ],
        "internalType": "struct KoiCert.KoiData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];