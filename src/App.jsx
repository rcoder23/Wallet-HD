import React, { useState } from 'react';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import Display from './components/Display';
import { BsClipboard } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bs58 from "bs58";

function App() {

  const copyText = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Copied to clipboard successfully!", {
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
    });
  };


  const [mnemonic, setMnemonic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const [keys, setKeys] = useState([]);

  async function createNew() {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  }

  async function createWallet() {
    if (mnemonic) {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      const secretKeyHex = Buffer.from(keypair.secretKey).toString('hex');
      console.log(secretKeyHex);

      const hexBuffer = Buffer.from(secretKeyHex, 'hex');
      const base58String = bs58.encode(hexBuffer);


      setKeys([...keys, [base58String, keypair.publicKey.toBase58()]]);

      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Please generate a mnemonic first!");
    }
  }

  return (
    <div className='container p-3'>
      <ToastContainer />
      <h2 className='text-center'>Create Wallet</h2>
      <div className="btncontainer">
        <button className='btn btn-primary' onClick={createNew}>Generate Mnemonic</button>
        <button onClick={createWallet} className='mx-2 btn btn-primary' disabled={!mnemonic}>
          Create New Wallet
        </button>
      </div>
      <div>
        <div className="col-12 m-1">
          <div className="seed-phrase row">
            <div className="col-lg-3"></div>
            {mnemonic && (
              <div className="col-lg-6 text-center">
                <h2>Secret Recovery Phrase</h2>
                <p>Save These Words In A Safe Place.</p>
                <div className="phrase-container row">
                  {mnemonic.split(" ").map((mn, index) => {
                    return (
                      <div key={index} className="each-word col-3 all-center">
                        <span>{index + 1}</span> {mn}
                      </div>
                    );
                  })}

                </div>
                <button className="copy-btn" onClick={copyText}>
                  <BsClipboard />
                </button>
              </div>
            )}
          </div>
        </div>
        {mnemonic ?
          <>
            <h4>Solana Wallets</h4>
            {keys.map((p, index) => (
              <div key={index} className='mt-2'>
                <Display publicKey={p[1]} privateKey={p[0]} />
              </div>
            ))}
          </> : ''}
      </div>
    </div>
  );
}

export default App;
