import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Commitment,
} from "@solana/web3.js";
import { Solgig } from "../target/types/solgig";
import { BN } from "bn.js";

describe("solgig", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.Solgig as Program<Solgig>;
  const seed = 1;

  //Log
  const log = async (signature: string) => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  // Accounts
  const maker = Keypair.generate();
  const developer = Keypair.generate();
  const jobState = PublicKey.findProgramAddressSync(
    [
      Buffer.from("job"),
      maker.publicKey.toBuffer(),
      new BN(seed).toBuffer("le", 8),
    ],
    program.programId
  )[0];
  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), jobState.toBuffer()],
    program.programId
  )[0];
  const systemProgram = SystemProgram.programId;

  it("setup", async () => {
    let airdrop = await connection.requestAirdrop(
      maker.publicKey,
      15 * LAMPORTS_PER_SOL
    );
    let latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      {
        signature: airdrop,
        ...latestBlockhash,
      },
      "finalized" as Commitment
    );

    airdrop = await connection.requestAirdrop(
      developer.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      {
        signature: airdrop,
        ...latestBlockhash,
      },
      "finalized" as Commitment
    );
    console.log(await provider.connection.getBalance(maker.publicKey));
    console.log(await provider.connection.getBalance(developer.publicKey));
  });

  it("Initialize", async () => {
    let tx = await program.methods
      .initialize(new BN(seed), 3)
      .accounts({
        vault,
        maker: maker.publicKey,
        jobState,
        systemProgram,
      })
      .signers([maker])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
  });

  it("Deposit 3 SOL in Vault", async () => {
    let tx = await program.methods
      .deposit(new BN(seed), new BN(3 * LAMPORTS_PER_SOL))
      .accounts({
        vault,
        maker: maker.publicKey,
        jobState,
        systemProgram,
      })
      .signers([maker])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
    console.log(await connection.getBalance(vault));
  });

  it("Assign Developer", async () => {
    let tx = await program.methods
      .assign(new BN(seed))
      .accounts({
        maker: maker.publicKey,
        developer: developer.publicKey,
        jobState,
        systemProgram,
      })
      .signers([maker])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
    console.log(`Developer: ${developer.publicKey}`);
  });

  it("Task 1 Submitted", async () => {
    let tx = await program.methods
      .submit(new BN(seed))
      .accounts({
        developer: developer.publicKey,
        maker: maker.publicKey,
        jobState,
        systemProgram,
      })
      .signers([developer])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
  });

  it("Task 1 Accepted", async () => {
    let tx = await program.methods
      .acceptSubmission(new BN(seed))
      .accounts({
        maker: maker.publicKey,
        jobState,
        systemProgram,
      })
      .signers([maker])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
  });

  it("Task 2 Submitted", async () => {
    let tx = await program.methods
      .submit(new BN(seed))
      .accounts({
        developer: developer.publicKey,
        maker: maker.publicKey,
        jobState,
        systemProgram,
      })
      .signers([developer])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
  });

  it("Task 2 Rejected", async () => {
    let tx = await program.methods
      .rejectSubmission(new BN(seed))
      .accounts({
        maker: maker.publicKey,
        jobState,
        systemProgram,
      })
      .signers([maker])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
  });

  it("Developer Withdraw", async () => {
    let tx = await program.methods
      .withdraw(new BN(seed))
      .accounts({
        maker: maker.publicKey,
        jobState,
        systemProgram,
        developer: developer.publicKey,
        vault,
      })
      .signers([developer])
      .rpc();

    console.log(`Your transaction signature: ${tx}`);
    console.log(await program.account.job.fetch(jobState));
    console.log(`Vault balance: ${await connection.getBalance(vault)}`);
    console.log(
      `Developer balance: ${await connection.getBalance(developer.publicKey)}`
    );
  });

  it("Job Cancelled", async () => {
    const tx = await program.methods
      .cancel(new BN(seed))
      .accounts({ maker: maker.publicKey, jobState, vault, systemProgram })
      .signers([maker])
      .rpc();
    console.log(`Your transaction signature: ${tx}`);
    console.log(
      `Maker balance: ${await connection.getBalance(maker.publicKey)}`
    );
  });
});
