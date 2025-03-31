import React, { useState } from "react";
import { ethers } from "ethers"; // Ethereum, BSC, Polygon
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"; // Solana

const WalletIntegration = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(0);
  const [walletType, setWalletType] = useState("");

  // ✅ Blockchain Theme (Glassmorphism + Neon)
  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "radial-gradient(circle at center, #111 20%, #000 80%)",
      overflow:'hidden'
    },
    container: {
      maxWidth: "600px",
      padding: "40px",
      background: "rgba(15, 15, 25, 0.6)", // Glassmorphism Effect
      boxShadow: "0px 8px 15px rgba(0, 255, 255, 0.2)",
      borderRadius: "12px",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif",
      backdropFilter: "blur(15px)",
      border: "2px solid rgba(0, 255, 255, 0.3)",
      margin:'16em',
      marginTop:'13em',
      
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#00ffff",
      textShadow: "0px 0px 10px rgba(0, 255, 255, 0.8)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "30px",
      
    },
    button: {
      padding: "14px 24px",
      fontSize: "18px",
      fontWeight: "500",
      border: "2px solid transparent",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      background: "transparent",
      color: "white",
      position: "relative",
      overflow: "hidden",
    },
    metamaskButton: {
      borderColor: "#f7931a",
    },
    phantomButton: {
      borderColor: "#6c49f3",
    },
    buttonHover: {
      boxShadow: "0px 0px 15px rgba(255, 140, 0, 0.8)",
    },
    phantomHover: {
      boxShadow: "0px 0px 15px rgba(108, 73, 243, 0.8)",
    },
    walletDetails: {
      background: "rgba(255, 255, 255, 0.1)",
      padding: "25px",
      borderRadius: "10px",
      textAlign: "left",
      fontSize: "18px",
      lineHeight: "1.8",
      boxShadow: "0px 4px 12px rgba(0, 255, 255, 0.2)",
      border: "1px solid rgba(0, 255, 255, 0.2)",
      color: "#ddd",
      marginTop: "20px",
    },
    detailTitle: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#00ffff",
      marginBottom: "10px",
    },
    detailText: {
      color: "#bbb",
    },
  };

  // ✅ Connect to MetaMask (Ethereum, Binance Smart Chain, Polygon)
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        // Detect Network
        const networkId = await provider.getNetwork();
        setNetwork(networkId.name);

        // Get Balance
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));

        setWalletType("MetaMask");
      } catch (error) {
        console.error("MetaMask Connection Error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // ✅ Connect to Phantom Wallet (Solana)
  const connectPhantomWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        setWalletType("Phantom Wallet");

        // Get Balance
        const connection = new Connection(clusterApiUrl("mainnet-beta"));
        const balance = await connection.getBalance(new PublicKey(response.publicKey));
        setBalance(balance / 1e9); // Convert lamports to SOL

        setNetwork("Solana");
      } catch (error) {
        console.error("Phantom Wallet Connection Error:", error);
      }
    } else {
      alert("Please install Phantom Wallet!");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Connect Your Wallet</h2>
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.metamaskButton }}
            onMouseOver={(e) => (e.target.style.boxShadow = styles.buttonHover.boxShadow)}
            onMouseOut={(e) => (e.target.style.boxShadow = "none")}
            onClick={connectMetaMask}
          >
            Connect MetaMask
          </button>
          <button
            style={{ ...styles.button, ...styles.phantomButton }}
            onMouseOver={(e) => (e.target.style.boxShadow = styles.phantomHover.boxShadow)}
            onMouseOut={(e) => (e.target.style.boxShadow = "none")}
            onClick={connectPhantomWallet}
          >
            Connect Phantom Wallet
          </button>
        </div>

        {walletAddress && (
          <div style={styles.walletDetails}>
            <h3 style={styles.detailTitle}>Connected Wallet</h3>
            <p style={styles.detailText}>
              <strong>Address:</strong> {walletAddress}
            </p>
            <p style={styles.detailText}>
              <strong>Network:</strong> {network}
            </p>
            <p style={styles.detailText}>
              <strong>Balance:</strong> {balance} {network === "Solana" ? "SOL" : "ETH/BSC/MATIC"}
            </p>
            <p style={styles.detailText}>
              <strong>Wallet Type:</strong> {walletType}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletIntegration;
