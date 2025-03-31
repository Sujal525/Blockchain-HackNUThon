import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import DecentralizedIdentity from "./components/DecentralizedIdentity";
import WalletIntegration from "./components/WalletIntegration";
import BlockchainData from "./components/BlockchainData";
import SmartContractInteraction from "./components/SmartContractInteraction";
import OrderBook from "./components/OrderBook";
import AITradingInsights from "./components/AITradingInsights";
import "./App.css";

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const isVerified = localStorage.getItem("isVerified");
        if (isVerified === "true") {
            setAuthenticated(true);
        }
    }, []);

    const handleLogout = async () => {
        // 🔹 Clear local authentication data
        localStorage.removeItem("walletAddress");
        localStorage.removeItem("isVerified");

        // 🔹 Force Phantom Wallet to disconnect
        if (window.solana && window.solana.disconnect) {
            try {
                await window.solana.disconnect();
                console.log("Phantom Wallet disconnected");
            } catch (error) {
                console.error("Error disconnecting Phantom:", error);
            }
        }

        setAuthenticated(false);
    };

    return (
        <Router>
            <div className="app-container">
                {!authenticated ? (
                    <Routes>
                        <Route path="/" element={<DecentralizedIdentity setAuthenticated={setAuthenticated} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                ) : (
                    <>
                        <div className="sidebar">
                            <h2>Blockchain Platform</h2>
                            <ul>
                                <li><Link to="/wallet-integration">Wallet Integration</Link></li>
                                <li><Link to="/data-fetch">Blockchain Data</Link></li>
                                <li><Link to="/smart-contract">Smart Contracts</Link></li>
                                <li><Link to="/order-book">Decentralized Order Book</Link></li>
                                <li><Link to="/ai-trading-insights">AI Trading Insights</Link></li>
                                <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>

                        <div className="content">
                            <Routes>
                                <Route path="/wallet-integration" element={<WalletIntegration />} />
                                <Route path="/data-fetch" element={<BlockchainData />} />
                                <Route path="/smart-contract" element={<SmartContractInteraction />} />
                                <Route path="/order-book" element={<OrderBook />} />
                                <Route path="/ai-trading-insights" element={<AITradingInsights />} />
                                <Route path="*" element={<Navigate to="/wallet-integration" />} />
                            </Routes>
                        </div>
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;
