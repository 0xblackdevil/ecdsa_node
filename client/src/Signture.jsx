import { useState } from "react";
import server from "./server";

function Signature({ address, setAddress, nonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [signatureData, setSignatureData] = useState({});


  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function signature(evt) {
    evt.preventDefault();
    console.log("=== In sign function ===");

    try {
      console.log("into try");
      const {
        data: { signatureJSON },
      } = await server.post(`sign`, {
        sender: address,
        recipient: recipient,
        amount: parseInt(sendAmount),
        privateKey: privateKey,
      });
      console.log(signatureJSON);
      setSignatureData(JSON.parse(signatureJSON));
    } catch (error) {
      console.log("=== ERROR ===");
      console.log(error);
    }
  }

  return (
    <form className="container sign" onSubmit={signature}>
      <h1>Generate Signature</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={setValue(setAddress)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Signature" />

    <div>
        <h3>Signature</h3>
        <p>r: {signatureData.r}</p>
        <p>s: {signatureData.s}</p>
        <p>recovery: {signatureData.recovery}</p>
        </div>
    </form>
  );
}

export default Signature;
