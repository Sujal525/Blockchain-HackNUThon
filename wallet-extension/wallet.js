// wallet-extension/wallet.js (Background Service Worker)

const walletStorageKeyPrefix = 'multiNetworkWallet-';

function generateWallet(network) {
  let address;
  if (network === 'ethereum') {
    address = '0x' + [...Array(40)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
  } else if (network === 'solana') {
    // For demo: create a Solana-style address (dummy)
    address = 'S' + [...Array(44)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
  } else {
    throw new Error('Unsupported network');
  }
  return { address, network, privateKey: 'dummy_private_key' };
}

function signTransaction(wallet, tx) {
  // Create a dummy signature that includes network info.
  return `signed_${tx.to}_${tx.value}_${wallet.address}_${wallet.network}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createWallet') {
    const network = message.network || 'ethereum';
    const wallet = generateWallet(network);
    const storageKey = walletStorageKeyPrefix + network;
    chrome.storage.local.set({ [storageKey]: wallet }, () => {
      sendResponse(wallet);
    });
    return true;
  }

  if (message.action === 'loadWallet') {
    const network = message.network || 'ethereum';
    const storageKey = walletStorageKeyPrefix + network;
    chrome.storage.local.get([storageKey], (result) => {
      sendResponse(result[storageKey] || null);
    });
    return true;
  }

  if (message.action === 'signTransaction') {
    // We assume the wallet is already loaded for the correct network.
    // You could also pass a network parameter here if needed.
    const network = message.tx.network || 'ethereum';
    const storageKey = walletStorageKeyPrefix + network;
    chrome.storage.local.get([storageKey], (result) => {
      const wallet = result[storageKey];
      if (wallet) {
        const signature = signTransaction(wallet, message.tx);
        sendResponse({ signature });
      } else {
        sendResponse({ error: 'No wallet loaded' });
      }
    });
    return true;
  }
});
