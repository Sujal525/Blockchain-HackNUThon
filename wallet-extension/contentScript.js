// wallet-extension/contentScript.js

// Inject the external scripts (injectedScript.js and multiNetworkManager.js) into the page
(function() {
    const script1 = document.createElement('script');
    script1.src = chrome.runtime.getURL('injectedScript.js');
    script1.addEventListener('load', () => script1.remove());
    (document.head || document.documentElement).appendChild(script1);
  
    const script2 = document.createElement('script');
    script2.src = chrome.runtime.getURL('multiNetworkManager.js');
    script2.addEventListener('load', () => script2.remove());
    (document.head || document.documentElement).appendChild(script2);
  })();
  
  // Utility: Wrap chrome.runtime.sendMessage in a Promise (fallback)
  function sendMessageAsync(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("sendMessage error:", chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  // Listen for messages from the page and forward them to the background service worker
  window.addEventListener("message", async (event) => {
    // Only process messages coming from the same window
    if (event.source !== window) return;
  
    // Handle wallet connection requests using multiNetworkManager if available
    if (event.data && event.data.type === "MY_WALLET_CONNECT") {
      const network = (event.data.network || "ethereum").toLowerCase();
      if (window.multiNetworkManager && typeof window.multiNetworkManager.loadOrCreateWalletForNetwork === "function") {
        const wallet = await window.multiNetworkManager.loadOrCreateWalletForNetwork(network);
        window.postMessage({ type: "MY_WALLET_CONNECT_RESPONSE", wallet }, "*");
      } else {
        // Fallback (should not occur)
        let response = await sendMessageAsync({ action: "loadWallet", network });
        if (!response || !response.address || response.network !== network) {
          response = await sendMessageAsync({ action: "createWallet", network });
        }
        window.postMessage({ type: "MY_WALLET_CONNECT_RESPONSE", wallet: response }, "*");
      }
    }
  
    // Handle transaction signing requests using multiNetworkManager if available
    if (event.data && event.data.type === "MY_WALLET_SIGN") {
      if (window.multiNetworkManager && typeof window.multiNetworkManager.signTransactionForNetwork === "function") {
        const signature = await window.multiNetworkManager.signTransactionForNetwork(event.data.tx);
        window.postMessage({ type: "MY_WALLET_SIGN_RESPONSE", signature }, "*");
      } else {
        let response = await sendMessageAsync({ action: "signTransaction", tx: event.data.tx });
        window.postMessage({ type: "MY_WALLET_SIGN_RESPONSE", signature: response ? response.signature : null }, "*");
      }
    }
  });
  