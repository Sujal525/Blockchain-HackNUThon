import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./OrderBook.css"; // Import custom styles

const OrderBook = () => {
  const [contractAddress, setContractAddress] = useState("abc");
  const [orders, setOrders] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [isBuyOrder, setIsBuyOrder] = useState(true);
  const [loading, setLoading] = useState(false);

  // Create Wallet State
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const contractABI = [
    "function placeOrder(uint256 amount, uint256 price, bool isBuyOrder) public",
    "function getOrders() public view returns (tuple(address,uint256,uint256,bool)[])",
  ];

  useEffect(() => {
    if (contractAddress !== "abc") {
      fetchOrders();
    }
  }, [contractAddress]);

  // Connect MetaMask Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        alert(`Connected to MetaMask: ${accounts[0]}`);
      } catch (error) {
        console.error("Wallet Connection Error:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Fetch Orders from Smart Contract
  const fetchOrders = async () => {
    if (!contractAddress) {
      alert("Please enter a valid contract address.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const fetchedOrders = await contract.getOrders();

      const formattedOrders = fetchedOrders.map((order) => ({
        trader: order[0],
        amount: ethers.utils.formatEther(order[1]),
        price: ethers.utils.formatEther(order[2]),
        isBuyOrder: order[3],
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Place an Order
  const placeOrder = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    if (!amount || !price) {
      alert("Please enter amount and price!");
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.placeOrder(
        ethers.utils.parseEther(amount),
        ethers.utils.parseEther(price),
        isBuyOrder
      );
      await tx.wait();

      alert("Order placed successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Order Placement Error:", error);
      alert("Order placement failed!");
    } finally {
      setLoading(false);
    }
  };

  // ** Create New Wallet **
  const createWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    setNewWalletAddress(wallet.address);
    setPrivateKey(wallet.privateKey);
    alert("New Wallet Created! Save Your Private Key Securely.");
  };

  // Copy Private Key to Clipboard
  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    alert("Private Key Copied!");
  };

  return (
    <div className="orderbook-container">
      <h2 className="title">Decentralized Order Book</h2>

      <button className="btn connect-btn" onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress}` : "Connect MetaMask"}
      </button>

      <div className="input-group">
        <input type="text" className="input-box" placeholder="Amount (ETH)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="text" className="input-box" placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>

      <div className="order-type">
        <label className="checkbox-label">
          <input type="checkbox" checked={isBuyOrder} onChange={() => setIsBuyOrder(true)} />
          Buy Order
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={!isBuyOrder} onChange={() => setIsBuyOrder(false)} />
          Sell Order
        </label>
      </div>

      <button className="btn action-btn" onClick={placeOrder} disabled={loading}>{loading ? "Processing..." : "Place Order"}</button>

      <h3 className="order-title">Order Book</h3>

      <h4>Buy Orders</h4>
      <ul className="order-list">{orders.filter(order => order.isBuyOrder).map((order, index) => <li key={index} className="buy-order">BUY {order.amount} ETH @ {order.price} ETH</li>)}</ul>

      <h4>Sell Orders</h4>
      <ul className="order-list">{orders.filter(order => !order.isBuyOrder).map((order, index) => <li key={index} className="sell-order">SELL {order.amount} ETH @ {order.price} ETH</li>)}</ul>

      {/* CREATE WALLET FEATURE */}
      <button className="btn create-wallet-btn" onClick={createWallet}>
        Create New Wallet
      </button>

      {newWalletAddress && (
        <div className="wallet-details">
          <p><strong>Wallet Address:</strong> {newWalletAddress}</p>
          <button className="btn show-key-btn" onClick={() => setShowPrivateKey(!showPrivateKey)}>
            {showPrivateKey ? "Hide Private Key" : "Show Private Key"}
          </button>
          {showPrivateKey && (
            <p className="private-key">
              <strong>Private Key:</strong> {privateKey} 
              <button className="btn copy-btn" onClick={copyPrivateKey}>Copy</button>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderBook;
