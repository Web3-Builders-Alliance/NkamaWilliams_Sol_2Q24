import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VoteTwo } from "../target/types/vote_two";

describe("vote-two", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.VoteTwo as Program<VoteTwo>;

  const url = "https://will.dev";

  const account = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(url)],
    program.programId
  );

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(url)
      .accounts({
        payer: provider.wallet.publicKey,
        vote: account[0],
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Upvoted!", async () => {
    // Add your test here.
    const tx = await program.methods
      .upvote(url)
      .accounts({
        vote: account[0],
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const state = await program.account.voteState.fetch(account[0]);
    console.log(`Votes: ${state.votes}`);
  });

  it("Upvoted!", async () => {
    // Add your test here.
    const tx = await program.methods
      .upvote(url)
      .accounts({
        vote: account[0],
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const state = await program.account.voteState.fetch(account[0]);
    console.log(`Votes: ${state.votes}`);
  });

  it("Upvoted!", async () => {
    // Add your test here.
    const tx = await program.methods
      .upvote(url)
      .accounts({
        vote: account[0],
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const state = await program.account.voteState.fetch(account[0]);
    console.log(`Votes: ${state.votes}`);
  });

  it("Downvoted!", async () => {
    // Add your test here.
    const tx = await program.methods
      .downvote(url)
      .accounts({
        vote: account[0],
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const state = await program.account.voteState.fetch(account[0]);
    console.log(`Votes: ${state.votes}`);
  });

  it("Cleared!", async () => {
    // Add your test here.
    const tx = await program.methods
      .clear(url)
      .accounts({
        vote: account[0],
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const state = await program.account.voteState.fetch(account[0]);
    console.log(`Votes: ${state.votes}`);
  });
});
