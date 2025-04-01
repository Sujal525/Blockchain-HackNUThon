import React, { useEffect, useState } from "react";
import Web3 from "web3";

const BlockchainData = () => {
  const [ethBlock, setEthBlock] = useState("Loading...");
  const [ethGas, setEthGas] = useState("Loading...");
  const [bscBlock, setBscBlock] = useState("Loading...");
  const [solPrice, setSolPrice] = useState("Loading...");
  const [polygonGas, setPolygonGas] = useState("Loading...");

  // ✅ RPC URLs
  const INFURA_API_KEY = "abc"; // Replace with actual API key
  const ETHEREUM_RPC = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
  const BSC_RPC = "https://bsc-dataseed.binance.org/";
  const POLYGON_RPC = "https://polygon-rpc.com/";

  const web3Ethereum = new Web3(ETHEREUM_RPC);
  const web3BSC = new Web3(BSC_RPC);
  const web3Polygon = new Web3(POLYGON_RPC);

  useEffect(() => {
    // Fetch Ethereum Block Number
    web3Ethereum.eth.getBlockNumber().then(setEthBlock).catch(console.error);

    // Fetch Ethereum Gas Price
    web3Ethereum.eth
      .getGasPrice()
      .then((price) => setEthGas(Web3.utils.fromWei(price, "gwei") + " Gwei"))
      .catch(console.error);

    // Fetch Binance Smart Chain Block Number
    web3BSC.eth.getBlockNumber().then(setBscBlock).catch(console.error);

    // Fetch Solana Price
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => setSolPrice("$" + data.solana.usd.toFixed(2)))
      .catch(console.error);

    // Fetch Polygon Gas Price
    web3Polygon.eth
      .getGasPrice()
      .then((price) => setPolygonGas(Web3.utils.fromWei(price, "gwei") + " Gwei"))
      .catch(console.error);
  }, []);

  // ✅ Styles for futuristic blockchain theme
  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "radial-gradient(circle, #080c14 40%, #000 100%)",
      overflow: "hidden",
    },
    container: {
      width: "550px",
      padding: "35px",
      background: "rgba(15, 15, 25, 0.7)", // Glassmorphism effect
      borderRadius: "15px",
      boxShadow: "0px 8px 25px rgba(0, 255, 255, 0.15)",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif",
      backdropFilter: "blur(12px)",
      border: "2px solid rgba(0, 255, 255, 0.3)",
      margin:'16em',
      marginTop:'13em',
    },

    title: {
      fontSize: "28px",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#00ffff",
      textShadow: "0px 0px 12px rgba(0, 255, 255, 0.8)",
    },
    blockchainBox: {
      background: "rgba(255, 255, 255, 0.08)",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "15px",
      boxShadow: "0px 4px 12px rgba(0, 255, 255, 0.2)",
      border: "1px solid rgba(0, 255, 255, 0.2)",
      color: "#ddd",
      textAlign: "left",
    },
    blockchainTitle: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#00ffff",
      marginBottom: "8px",
    },
    blockchainData: {
      fontSize: "18px",
      color: "#bbb",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Blockchain Live Data</h2>

        <div style={styles.blockchainBox}>
          <h3 style={styles.blockchainTitle}>Ethereum</h3>
          <p style={styles.blockchainData}>
            <strong>Block Number:</strong> {ethBlock}
          </p>
          <p style={styles.blockchainData}>
            <strong>Gas Price:</strong> {ethGas}
          </p>
        </div>

        <div style={styles.blockchainBox}>
          <h3 style={styles.blockchainTitle}>Binance Smart Chain</h3>
          <p style={styles.blockchainData}>
            <strong>Block Number:</strong> {bscBlock}
          </p>
        </div>

        <div style={styles.blockchainBox}>
          <h3 style={styles.blockchainTitle}>Solana</h3>
          <p style={styles.blockchainData}>
            <strong>Solana Price:</strong> {solPrice}
          </p>
        </div>

        <div style={styles.blockchainBox}>
          <h3 style={styles.blockchainTitle}>Polygon (MATIC)</h3>
          <p style={styles.blockchainData}>
            <strong>Gas Price:</strong> {polygonGas}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainData;
