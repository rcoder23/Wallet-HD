import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import bs58 from "bs58";
import TransferMoneyModal from './TransferMoneyModal';

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

const Display = (props) => {
  const [visibleSecretKey, setVisibleSecretKey] = useState(false);
  const [balance, setBalance] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [senderAddress, setSenderAddress] = useState('');

  const toggleSecretKeyVisibility = () => {
    setVisibleSecretKey(!visibleSecretKey);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleTransferMoney = (address) => {
    setSenderAddress(address);
    console.log('Sender address set to:', address);
  };

  const transferMoney = async (publicKey, privateKey) => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const secretKeyArray = bs58.decode(privateKey);
      const keypair = Keypair.fromSecretKey(secretKeyArray);
      const recipientPublicKey = new PublicKey(senderAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: recipientPublicKey,
          lamports: 0.1 * LAMPORTS_PER_SOL, // sending 0.1 SOL
        })
      );

      const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
      console.log('Transaction successful with signature:', signature);
      toast.success("Transaction successful with signature: " + signature, {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
    } catch (error) {
      console.error("Error transferring money:", error);
      toast.error("Transaction failed: " + error.message, {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
    }
  };

  const checkBalance = (key) => {
    axios.post(import.meta.env.VITE_SOLANA_KEY, {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getBalance",
      "params": [key]
    })
      .then(function (response) {
        toast.success("Balance is: " + response.data.result.value / 1_000_000_000 + " SOL", {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <ToastContainer />

      <div className="publicKeyContainer">
        <div className="col-9 mx-1 px-2">
          Public Key:
          <input
            type="text"
            value={props.publicKey}
            readOnly />
        </div>
        <div className="col-1 mx-1 px-2 mt-4">
          <button className="btn btn-primary" onClick={() => checkBalance(props.publicKey)}>Check Balance </button>
        </div>
        <div className="col-1 mx-1 px-2 mt-4">
          <button className="btn btn-primary" onClick={handleOpenModal}>Transfer Money </button>
        </div>
      </div>

      <div className="wallet-container all-center mt-3">
        <div className="col-9 px-2">
          Private Key: <input
            type={visibleSecretKey === true ? "text" : "password"}
            value={props.privateKey}
            readOnly />
        </div>

        <div className="col-1 mt-2">
          {visibleSecretKey ? <AiOutlineEyeInvisible onClick={toggleSecretKeyVisibility} /> : <AiOutlineEye onClick={toggleSecretKeyVisibility} />}
        </div>
        <div className="col-2 mt-3 mx-1">
          <button className="btn btn-primary" onClick={() => transferMoney(props.publicKey, props.privateKey)}>
            Confirm Transfer
          </button>
        </div>
      </div>

      <TransferMoneyModal
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={handleTransferMoney}  // This will receive the sender address from the modal
      />


    </>
  );
}

export default Display;
