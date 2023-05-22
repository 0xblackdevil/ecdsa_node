import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import Signature from "./Signture";

function App() {
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        nonce={nonce}
        setNonce={setNonce}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} setAddress={setAddress} setNonce={setNonce}/>
      <Signature address={address} setAddress={setAddress} nonce={nonce}/>
    </div>
  );
}

export default App;
