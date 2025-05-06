// src/components/WalletConnector.tsx
import React, { useState } from "react";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
    web3?: Web3;
  }
}

const WalletConnector: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Установите MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      window.web3 = web3;

      setAccount(accounts[0]);
    } catch (err) {
      console.error("Ошибка подключения:", err);
    }
  };

  const signMessage = async () => {
    if (!window.web3 || !account) return;

    const message = "Авторизация через MetaMask";
    try {
      const signature = await window.web3.eth.personal.sign(message, account, "");
      setSignature(signature);
    } catch (err) {
      console.error("Ошибка подписи:", err);
    }
  };

  return (
    <div>
      {!account ? (
        <button onClick={connectWallet}>Подключить MetaMask</button>
      ) : (
        <div>
          <p>Адрес: {account}</p>
          <button onClick={signMessage}>Подписать сообщение</button>
          {signature && (
            <p>
              Подпись: <code>{signature}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
