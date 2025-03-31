import React, { useState } from "react";
import { ethers } from "ethers";
import "./SmartContractInteraction.css"; // Import CSS for styling

const SmartContractInteraction = () => {
  const [recipientAddress, setRecipientAddress] = useState(""); // Wallet address to send ETH
  const [amount, setAmount] = useState(""); // ETH amount
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]); // Set the connected wallet address
        alert(`Connected to MetaMask: ${accounts[0]}`);
      } catch (error) {
        console.error("Connection Error:", error);
      }
    } else {
      alert("MetaMask is not installed! Please install MetaMask.");
    }
  };

  // Send ETH to recipient
  const sendTransaction = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    if (!recipientAddress || !amount) {
      alert("Please enter both recipient address and amount!");
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request MetaMask access
      const signer = provider.getSigner();

      // Send ETH to recipient
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amount), // Convert amount to Wei
      });

      await tx.wait(); // Wait for confirmation

      setTransactionHash(tx.hash);
      alert(`Transaction successful! Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Send ETH via Smart Contract</h2>
      <button className="btn connect-btn" onClick={connectWallet}>Connect MetaMask</button>
      <br /><br />
      {walletAddress && <p className="wallet-address">Connected Wallet: {walletAddress}</p>}

      <input
        type="text"
        className="input-box"
        placeholder="Enter Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <br /><br />
      <input
        type="text"
        className="input-box"
        placeholder="Enter ETH Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />
      <button className={`btn action-btn ${loading ? "loading" : ""}`} onClick={sendTransaction} disabled={loading}>
        {loading ? "Processing..." : "Send ETH"}
      </button>
      {transactionHash && (
        <p className="transaction-hash">
          Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a>
        </p>
      )}
    </div>
  );
};

export default SmartContractInteraction;
