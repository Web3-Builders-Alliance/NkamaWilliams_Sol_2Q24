import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "BlueyRug",
    symbol: "BLU",
    uri: "https://arweave.net/4OdfNuncxYeGaJVMs1PB024wDLTJELXarqXaGiBmqDM",
    sellerFeeBasisPoints: percentAmount(10),
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", mint.publicKey);
})();

// https://explorer.solana.com/tx/5yWnnCyrVn7oXPC56P22dQ43PR2zsjNNHDJU51k4CGbjgPGbz79SKETMP793v6JixiBq57WTJ9ngwuGyQitAAVoH?cluster=devnet
// 7xmWgS6qMhbHo11zMe45YcHMNrWFpN4R8dTAd1CkEUtY

// https://explorer.solana.com/tx/2gqaniczK3xCjcn5wC9ZFixgoUChSqL6eopxA2vxnGxkXvsBSX6UgGw7WKuMtauttwhm1qiDysTMEBvshJdhsf3s?cluster=devnet
// HwCvFgVPYo3chPfhw4vyCCohjAphCchX9VhP1fLyUYu6
