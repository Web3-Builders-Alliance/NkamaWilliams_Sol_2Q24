import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("3sDE7AaaJiTE9xVv3DFC3osAqPAtXjJiND2tRQEoaMMX");

// Recipient address
const to = new PublicKey("2mNJumy74raf9ELLAtLF7W5NgsS9mfvSM4uTgtH6xF3w");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromWallet = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      true
    );
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toWallet = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
      true
    );
    // Transfer the new token to the "toTokenAccount" we just created
    const tx = await transfer(
      connection,
      keypair,
      fromWallet.address,
      toWallet.address,
      keypair,
      1_000_000n
    );
    console.log(tx.toString());
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
