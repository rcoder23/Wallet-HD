import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Display = (props) => {

  const [visibleSecretKey, setVisibleSecretKey] = useState(false);
  const toggleSecretKeyVisibility = () => {
    console.log(visibleSecretKey);
    setVisibleSecretKey(!visibleSecretKey);
  };
  return (

    <>
      <div className="col-11 mx-1 px-2">
        Public Key:
        <input
          type="text"
          value={props.publicKey}
          readOnly />
      </div>
      <div className="wallet-container all-center mt-3">




        <div className="col-11 mx-2 px-2">
          Private Key: <input
            type={visibleSecretKey === true ? "text" : "password"}
            value={props.privateKey}
            readOnly />
        </div>
        <div className="col-1 px-2 bg-parimary">
          {toggleSecretKeyVisibility ? <AiOutlineEye onClick={toggleSecretKeyVisibility} /> : <AiOutlineEyeInvisible onClick={toggleSecretKeyVisibility} />}
        </div>
      </div>
    </>
  )
}

export default Display