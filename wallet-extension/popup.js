document.addEventListener('DOMContentLoaded', () => {
  const createWalletBtn = document.getElementById('create-wallet-btn');
  const loadWalletBtn = document.getElementById('load-wallet-btn');
  const signTransactionBtn = document.getElementById('sign-transaction-btn');
  const walletInfo = document.getElementById('wallet-info');
  const networkSelect = document.getElementById('network');

  createWalletBtn.addEventListener('click', () => {
    const network = networkSelect.value;
    chrome.runtime.sendMessage({ action: 'createWallet', network }, (response) => {
      if (response && response.address) {
        walletInfo.innerHTML = `<p>New Wallet: ${response.address}</p><p>Network: ${response.network}</p>`;
      }
    });
  });

  loadWalletBtn.addEventListener('click', () => {
    const network = networkSelect.value;
    chrome.runtime.sendMessage({ action: 'loadWallet', network }, (response) => {
      if (response && response.address) {
        walletInfo.innerHTML = `<p>Loaded Wallet: ${response.address}</p><p>Network: ${response.network}</p>`;
      } else {
        walletInfo.innerHTML = `<p>No wallet found. Please create one.</p>`;
      }
    });
  });

  signTransactionBtn.addEventListener('click', () => {
    const network = networkSelect.value;
    const dummyTx = {
      to: network === 'ethereum' ? '0xRecipientAddress' : 'SRecipientAddress',
      value: '0.01',
      network: network
    };
    chrome.runtime.sendMessage({ action: 'signTransaction', tx: dummyTx }, (response) => {
      if (response && response.signature) {
        walletInfo.innerHTML += `<p>Signature: ${response.signature}</p>`;
      } else {
        walletInfo.innerHTML += `<p>Signing failed.</p>`;
      }
    });
  });
});
