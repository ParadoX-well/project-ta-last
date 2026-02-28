import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      // Mengaktifkan Optimizer agar gas fee lebih murah
      optimizer: {
        enabled: true,
        runs: 200,
      },
      // PENTING: viaIR mengatasi error "Stack too deep"
      // dengan mengubah cara kompilasi kode menjadi lebih efisien
      viaIR: true,
    },
  },
};

export default config;