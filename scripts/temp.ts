import { PublicKey } from "@solana/web3.js";
import { ethers } from "hardhat";
// Note that Keypair.generate() will always give a public key that is valid for users
 
// Valid public key
const key = new PublicKey("GcRDaLsfCgoP3g3X3DhzuFDqJxcDsaynaLNS1pjmc2fF");
// Lies on the ed25519 curve and is suitable for users
// console.log(PublicKey.isOnCurve(key.toBytes()));
console.log(key);

console.log(ethers.solidityPacked(['bytes32'], [key.toBytes()]));
 
// // Valid public key
// const offCurveAddress = new PublicKey(
//   "4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e",
// );
 
// // Not on the ed25519 curve, therefore not suitable for users
// console.log(PublicKey.isOnCurve(offCurveAddress.toBytes()));
 
// // Not a valid public key
// const errorPubkey = new PublicKey("testPubkey");