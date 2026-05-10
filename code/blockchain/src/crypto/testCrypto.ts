import CryptoBlockchain from "./cryptoBlockchain";

const blockchain = new CryptoBlockchain(
  "6da427bf79ae9c4da294b9ffc2336e5308d4ab253155d46e6b5ab8ff49056f12",
  "96adf0f261f3e2a60d1a0c928ea03af7",
);

const data = "Hello, my name is Abrar ...";
const RES = blockchain.encryptData(data);
const plaintext = blockchain.decryptData(RES);

console.log("Ciphertext: ", RES.CIPHER_TEXT);
console.log("Original data: ", plaintext);
