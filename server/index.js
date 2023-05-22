const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0369715d18ee37174b01c2304f866ce1e010332ba645dd554ffecccf58aebbd212": 100,
  "03efa61d67815d2e53eb6076c7d98c6f61ae8b43f6f7053c26b156c0459a30c947": 50,
  "03c6ed5799ccb46d1bb8d2134f804f4174f230cf70782be58081f550143672e126": 75,
};

const nonceList = {
  "0369715d18ee37174b01c2304f866ce1e010332ba645dd554ffecccf58aebbd212": 5,
  "03efa61d67815d2e53eb6076c7d98c6f61ae8b43f6f7053c26b156c0459a30c947": 0,
  "03c6ed5799ccb46d1bb8d2134f804f4174f230cf70782be58081f550143672e126": 0,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const nonce = nonceList[address] || 0;
  res.send({ balance, nonce });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  setInitialNonce(sender);

  const message = {
    from: sender,
    to: recipient,
    amount: parseInt(amount),
    nonce: nonceList[sender],
  };

  console.log(message);

  const signature = convertSig(req.body.sign);

  const messageHash = hashMessage(JSON.stringify(message));

  const result = await secp256k1.verify(signature, messageHash, sender);

  console.log("=== Message Hash ===");
  console.log(messageHash);

  console.log("=== Verification Result ===");
  console.log(result);

  if (result) {
    console.log("verify");
    if (balances[sender] < parseInt(amount)) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= parseInt(amount);
      balances[recipient] += parseInt(amount);
      nonceList[sender]++;
      res.send({ balance: balances[sender], nonce: nonceList[sender] });
    }
  } else {
    res.status(400).send({ message: "Signature is not verify!" });
  }
});

app.post("/sign", async (req, res) => {
  const { sender, recipient, amount, privateKey } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  setInitialNonce(sender);

  const messageObject = {
    from: sender,
    to: recipient,
    amount: amount,
    nonce: nonceList[sender],
  };

  console.log(messageObject);

  const messageHash = hashMessage(JSON.stringify(messageObject));
  const signature = await secp256k1.sign(messageHash, privateKey);

  console.log("=== Message Hash ===");
  console.log(messageObject, messageHash);

  console.log("=== Signatures ===");
  console.log(signature);

  const signatureObject = {
    r: signature.r.toString(),
    s: signature.s.toString(),
    recovery: signature.recovery
  };
  
  const signatureJSON = JSON.stringify(signatureObject);

  res.status(200).send({ signatureJSON });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
function setInitialNonce(address) {
  if (!nonceList[address]) {
    nonceList[address] = 0;
  }
}
function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}
function convertSig(object) {
  return new secp256k1.Signature(
    BigInt(object.r.replace("n", "")),
    BigInt(object.s.replace("n", "")),
    parseInt(object.recovery)
  );
}
