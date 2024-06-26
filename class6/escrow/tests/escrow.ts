// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Escrow } from "../target/types/escrow";

// describe("escrow", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.Escrow as Program<Escrow>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

import { Escrow } from "../target/types/escrow";

describe("Escrow2024", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const connection = provider.connection;

  const program = anchor.workspace.Escrow as Program<Escrow>;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  // Accounts
  const maker = Keypair.generate();
  const taker = Keypair.generate();
  const token_a = Keypair.generate();
  const token_b = Keypair.generate();
  const escrow_pda = PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow", "utf-8"),
      maker.publicKey.toBuffer(),
      new BN(1).toBuffer("le", 8),
    ],
    program.programId
  )[0];
  const taker_b_ata = getAssociatedTokenAddressSync(
    token_b.publicKey,
    taker.publicKey
  );
  const taker_a_ata = getAssociatedTokenAddressSync(
    token_a.publicKey,
    taker.publicKey
  );
  const maker_a_ata = getAssociatedTokenAddressSync(
    token_a.publicKey,
    maker.publicKey
  );
  const maker_b_ata = getAssociatedTokenAddressSync(
    token_b.publicKey,
    maker.publicKey
  );
  const vault = getAssociatedTokenAddressSync(token_a.publicKey, escrow, true);
  const accountsPublicKeys = {
    maker: maker.publicKey,
    taker: taker.publicKey,
    token_a: token_a.publicKey,
    token_b: token_b.publicKey,
    escrow_pda,
    taker_b_ata,
    taker_a_ata,
    maker_a_ata,
    maker_b_ata,
    vault,
    associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,

    tokenProgram: TOKEN_PROGRAM_ID,

    systemProgram: SystemProgram.programId,
  };

  it("setup", async () => {
    let lamports = await getMinimumBalanceForRentExemptMint(connection);
    let tx = new Transaction();
    tx.instructions = [
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: maker.publicKey,
        lamports: 15 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: taker.publicKey,
        lamports: 15 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: token_a.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: token_b.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        token_b.publicKey,
        6,
        taker.publicKey,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        taker_b_ata,
        taker.publicKey,
        token_b.publicKey
      ),
      createMintToInstruction(
        token_b.publicKey,
        taker_b_ata,
        taker.publicKey,
        1000000000
      ),
      createInitializeMint2Instruction(
        token_a.publicKey,
        6,
        maker.publicKey,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        maker_a_ata,
        maker.publicKey,
        token_a.publicKey
      ),
      createMintToInstruction(
        token_a.publicKey,
        maker_a_ata,
        maker.publicKey,
        1000000000
      ),
    ];
    await provider
      .sendAndConfirm(tx, [token_a, token_b, maker, taker])
      .then(log);
  });

  it("Make", async () => {
    const accounts = {
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      escrow: accountsPublicKeys["escrow_pda"],
      maker: accountsPublicKeys["maker"],
      makerAta: accountsPublicKeys["maker_a_ata"],
      mintA: accountsPublicKeys["token_a"],
      mintB: accountsPublicKeys["token_b"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      vault: accountsPublicKeys["vault"],
    };
    await program.methods
      .make(new BN(1), new BN(2000000), new BN(2000000))
      .accounts({ ...accounts })
      .signers([maker])
      .rpc()
      .then(confirm)
      .then(log);
  });
});
