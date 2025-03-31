// wallet-extension/multiNetworkManager.js

// This module handles multiple network support.
window.multiNetworkManager = {
    loadOrCreateWalletForNetwork: function(network) {
      return new Promise((resolve) => {
        const networkLower = (network || "ethereum").toLowerCase();
        // Try to load an existing wallet for this network.
        chrome.runtime.sendMessage({ action: "loadWallet", network: networkLower }, (response) => {
          // If no wallet exists or the wallet's network doesn't match, create one.
          if (!response || !response.address || response.network !== networkLower) {
            chrome.runtime.sendMessage({ action: "createWallet", network: networkLower }, (newWallet) => {
              resolve(newWallet);
            });
          } else {
            resolve(response);
          }
        });
      });
    },
    signTransactionForNetwork: function(tx) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "signTransaction", tx: tx }, (response) => {
          resolve(response ? response.signature : null);
        });
      });
    }
  };
  