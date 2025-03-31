// wallet-extension/injectedScript.js
window.myWallet = {
  connect: function() {
    return new Promise((resolve, reject) => {
      window.postMessage({ type: "MY_WALLET_CONNECT" }, "*");
      window.addEventListener("message", function handler(event) {
        if (event.data.type === "MY_WALLET_CONNECT_RESPONSE") {
          window.removeEventListener("message", handler);
          if (event.data.wallet) {
            resolve(event.data.wallet);
          } else {
            reject("No wallet");
          }
        }
      });
    });
  },
  signTransaction: function(tx) {
    return new Promise((resolve, reject) => {
      window.postMessage({ type: "MY_WALLET_SIGN", tx: tx }, "*");
      window.addEventListener("message", function handler(event) {
        if (event.data.type === "MY_WALLET_SIGN_RESPONSE") {
          window.removeEventListener("message", handler);
          if (event.data.signature) {
            resolve(event.data.signature);
          } else {
            reject("Signing failed");
          }
        }
      });
    });
  }
};
