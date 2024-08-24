import { useState, useSyncExternalStore } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';

const Display = (props) => {

  const [visibleSecretKey, setVisibleSecretKey] = useState(false);

  const [balance, setBalance] = useState(-1);
  const toggleSecretKeyVisibility = () => {
    setVisibleSecretKey(!visibleSecretKey);
  };

  const checkBalance = (key) => {
    axios.post(import.meta.env.VITE_SOLANA_KEY, {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getBalance",
      "params": [key]
    })
      .then(function (response) {
        setBalance(response.data.result.value / 1_000_000_000);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <>
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
        {balance != -1 && (
          <div className=" col-2">
            <h2 className="balance mt-4 p-2 text-sm-start">{balance} Sol</h2>
          </div>
        )}
      </div>
      <div className="wallet-container all-center mt-3">
        <div className="col-9 px-2">
          Private Key: <input
            type={visibleSecretKey === true ? "text" : "password"}
            value={props.privateKey}
            readOnly />
        </div>
        <div className="col-3 px-2 bg-parimary">
          {toggleSecretKeyVisibility ? <AiOutlineEye onClick={toggleSecretKeyVisibility} /> : <AiOutlineEyeInvisible onClick={toggleSecretKeyVisibility} />}
        </div>
      </div>
    </>
  )
}

export default Display