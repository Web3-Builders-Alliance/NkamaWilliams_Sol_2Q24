import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultThree } from "../target/types/vault_three";

describe("vault-three", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultThree as Program<VaultThree>;
  const vaultState = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), provider.publicKey.toBytes()],
    program.programId
  )[0];
  const vault = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultState.toBytes()],
    program.programId
  )[0];

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        payer: provider.wallet.publicKey,
        vaultState,
        vault,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("Deposited 4 SOL!", async () => {
    // Add your test here.
    const tx = await program.methods
      .deposit(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * 4))
      .accounts({
        payer: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("Withdrew 1 SOL!", async () => {
    // Add your test here.
    const tx = await program.methods
      .withdraw(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * 1))
      .accounts({
        payer: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("Closed account!", async () => {
    // Add your test here.
    const tx = await program.methods
      .close()
      .accounts({
        payer: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault info",
      await provider.connection.getAccountInfo(vault)
    );
  });
});
