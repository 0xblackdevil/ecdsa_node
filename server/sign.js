const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const wallet = [
  {
    address: "0x3514a9b5e0eb1e520b3584ece8a5446091d7ce7a",
    public:
      "0369715d18ee37174b01c2304f866ce1e010332ba645dd554ffecccf58aebbd212",
    private: "19c29db222dd1f07eb4f2ecd6c136a67d5b5317f36a407e2f06041e5807355c1",
  },
  {
    address: "0x413525f5a67df944d28ddba25871fafeb0f766ba",
    public:
      "03efa61d67815d2e53eb6076c7d98c6f61ae8b43f6f7053c26b156c0459a30c947",
    private: "507d8184e678656c3b6fb685c8af045b17165f848af1da1ccf4d14ded273b022",
  },
  {
    address: "0xaa68301c3e8b8e7ddaf3fb883bfc51e168404f07",
    public:
      "03c6ed5799ccb46d1bb8d2134f804f4174f230cf70782be58081f550143672e126",
    private: "472ec6301218b6b66a7f4127e2707a0836acf40ca891cf3048bdb0ca2448d41e",
  },
];

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

async function signMessage(messageObject, privateKey) {
  const messageHash = hashMessage(JSON.stringify(messageObject));
  const sign = await secp256k1.sign(messageHash, privateKey);

  console.log("=== Message Hash ===");
  console.log(messageObject, messageHash);

  console.log("=== Signatures ===");
  console.log(sign);

  return sign;
}

async function verifySign(messageObject, signature, publicKey) {
  const messageHash = hashMessage(JSON.stringify(messageObject));
  const result = await secp256k1.verify(signature, messageHash, publicKey);

  console.log("=== Message Hash ===");
  console.log(messageObject, messageHash);

  console.log("=== Verification Result ===");
  console.log(result);

  return result;
}

const tx ={
  'from': '0369715d18ee37174b01c2304f866ce1e010332ba645dd554ffecccf58aebbd212',
  'to': '03efa61d67815d2e53eb6076c7d98c6f61ae8b43f6f7053c26b156c0459a30c947',
  'amount': 10,
  'nonce': 5
}

signMessage(
  tx,
  "19c29db222dd1f07eb4f2ecd6c136a67d5b5317f36a407e2f06041e5807355c1"
);
