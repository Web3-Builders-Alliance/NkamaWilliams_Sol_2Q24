import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const file = await readFile(
      "/home/izomana/wba/q2/solana-starter/ts/bluey.png"
    );
    //2. Convert image to generic file.
    const img = createGenericFile(file, "Bluey's Rug", {
      contentType: "image/png",
    });
    //3. Upload image
    const [uri] = await umi.uploader.upload([img]);

    // const image =

    // const [myUri] = ???
    console.log("Your image URI: ", uri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

// 4QccjRCmv5mhrQa5m3GTFuvHyCBa43DTS1UveqPRrzVZ6Tw1WTYyJ16gPPZe6SDV3JR7oHR9CZ3VYRsNcpWmKkgy
// https://arweave.net/tFGrDkrNKeqxeKVw-JPQIdxSWMr42-xyMrjfeJS5aZc

// https://arweave.net/XIl3Ly7fgSOCNGiHI7CepDrGtcch1S_ijX5McyFzJ9Q
