import React, { useState } from "react";
import { ethers } from "ethers";
import "./DecentralizedIdentity.css";
import backgroundImage from "./bac.png"; // Ensure correct path

const DecentralizedIdentity = ({ setAuthenticated }) => {
    const [errorMessage, setErrorMessage] = useState("");

    const connectWallet = async () => {
        if (!window.ethereum && !window.solana) {
            setErrorMessage("Please install MetaMask or Phantom Wallet!");
            return;
        }

        try {
            let walletAddress = "";

            // Force fresh login by disconnecting first (Phantom)
            if (window.solana && window.solana.disconnect) {
                await window.solana.disconnect();
                console.log("Forced Phantom disconnect for fresh login.");
            }

            // MetaMask Wallet Connection
            if (window.ethereum) {
                await window.ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [{ eth_accounts: {} }],
                });

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                await window.ethereum.request({ method: "eth_requestAccounts" });

                walletAddress = await signer.getAddress();

                // Sign a verification message
                const message = `Sign this message to verify your identity: ${walletAddress}`;
                await signer.signMessage(message);
            } 
            // Phantom Wallet Connection
            else if (window.solana) {
                const response = await window.solana.request({
                    method: "connect",
                    params: { onlyIfTrusted: false },
                });

                walletAddress = response.publicKey.toString();
            }

            // Store authentication state
            localStorage.setItem("walletAddress", walletAddress);
            localStorage.setItem("isVerified", "true");

            // Grant access
            setAuthenticated(true);
        } catch (error) {
            console.error("Wallet connection failed:", error);
            setErrorMessage("Wallet connection failed. Please try again.");
        }
    };

    return (
        <div className="identity-wrapper">
            {/* Background Image */}
            <img src={backgroundImage} alt="Background" className="background-image" />

            <div className="identity-container">
                <h1 className="identity-title">Decentralized Identity</h1>
                <button className="connect-btn" onClick={connectWallet}>
                    Connect Wallet
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default DecentralizedIdentity;
