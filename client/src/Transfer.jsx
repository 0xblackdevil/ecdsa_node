import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, setAddress, setNonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signR, setSignR] = useState("");
  const [signS, setSignS] = useState("");
  const [recovery, setRecovery] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance, nonce },
      } = await server.post(`send`, {
        sender: address,
        amount: sendAmount,
        recipient,
        sign:{
          r: signR,
          s: signS,
          recovery: recovery
        }
      });
      setBalance(balance);
      setNonce(nonce);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x2"
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
        Signature
        <input
          placeholder="signature's R value"
          value={signR}
          onChange={setValue(setSignR)}
        ></input>
        <input className="sBox"
          placeholder="signature's S value"
          value={signS}
          onChange={setValue(setSignS)}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder="Type an address, for example: 0x2"
          value={recovery}
          onChange={setValue(setRecovery)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
