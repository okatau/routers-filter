import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';

dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
        chainId: 1,
        forking: {
            url: "https://ethereum-rpc.publicnode.com"
        }
    },
    matic: {
        url: process.env.POLYGON_RPC ?? "https://polygon-rpc.com",
        chainId: 137,
    },
    base: {
      url: process.env.BASE_RPC ?? "https://mainnet.base.org",
      chainId: 8453
    }
    // matic: {
    //     url: `https://rpc.ankr.com/polygon/${process.env.ANKR_POLYGON_API_KEY}` ?? "https://polygon-rpc.com",
    //     chainId: 137,
    // }
  }
};

export default config;
