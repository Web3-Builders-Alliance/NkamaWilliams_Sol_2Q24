import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://arweave.net/XIl3Ly7fgSOCNGiHI7CepDrGtcch1S_ijX5McyFzJ9Q";
    const metadata = {
      name: "Bluey's Rug",
      symbol: "BLUU",
      description: "Bluey's favorite rug",
      image,
      attributes: [
        { trait_type: "magical", value: "true" },
        { trait_type: "rarity", value: "legendary" },
        { trait_type: "colors", value: "blue" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

// https://arweave.net/xMVPBawRWsRfKkqFfzpydoWThEByE1Kpm-QLv9RsUic

// https://arweave.net/4OdfNuncxYeGaJVMs1PB024wDLTJELXarqXaGiBmqDM
