import { self } from "react-native-threads";
import HDKeyring from "eth-hd-keyring";
import { normalize } from "eth-sig-util";

// listen for messages
self.onmessage = (message) => {
  if (message === "run") {
    run();
  }
};


async function run () {
  const hdKeyRing = new HDKeyring();
  await hdKeyRing.addAccounts();
  const mnemonic = await hdKeyRing.serialize();
  const wallets = hdKeyRing.wallets[0];
  const wallet = {
    ...mnemonic,
    privateKey: normalize(wallets.privateKey.toString("hex")),
    publicKey: normalize(wallets.publicKey.toString("hex")),
  };
  self.postMessage(JSON.stringify({ wallets: [wallet] }));
}
