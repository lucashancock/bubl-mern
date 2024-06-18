// CopyButton.js
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500); // Reset copied message after 1.5s
  };

  return (
    <CopyToClipboard text={textToCopy}>
      <button
        onClick={handleCopy}
        className={`bg-black text-white font-bold py-1 px-2 rounded-xl `}
      >
        {isCopied ? (
          <i className="fa-solid fa-copy"></i>
        ) : (
          <i className="fa-regular fa-copy"></i>
        )}
      </button>
    </CopyToClipboard>
  );
};

export default CopyButton;
