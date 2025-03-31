// ✅ Use Ankr's Public Solana RPC
const SOLANA_RPC_URL = "https://rpc.ankr.com/solana";  

// ✅ Ethereum, BSC & Polygon RPC URLs
const INFURA_API_KEY = "ac94869298ac4a82a3609d69c447601d";  // Replace with actual Infura API key
const ETHEREUM_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const POLYGON_RPC_URL = "https://polygon-rpc.com/";

// ✅ Initialize Web3.js for Ethereum, Binance Smart Chain & Polygon
const web3Ethereum = new Web3(ETHEREUM_RPC_URL);
const web3BSC = new Web3(BSC_RPC_URL);
const web3Polygon = new Web3(POLYGON_RPC_URL);

// ✅ Fetch Ethereum Block Number
web3Ethereum.eth.getBlockNumber()
    .then((block) => document.getElementById("eth-block").innerText = block)
    .catch((err) => console.error("Error fetching Ethereum block:", err));

// ✅ Fetch Ethereum Gas Price
web3Ethereum.eth.getGasPrice()
    .then((gasPrice) => {
        document.getElementById("eth-gas").innerText = Web3.utils.fromWei(gasPrice, "gwei") + " Gwei";
    })
    .catch((err) => console.error("Error fetching Ethereum gas price:", err));

// ✅ Fetch Binance Smart Chain Block Number
web3BSC.eth.getBlockNumber()
    .then((block) => document.getElementById("bsc-block").innerText = block)
    .catch((err) => console.error("Error fetching BSC block:", err));

// 🔵 Fetch Solana Token Price from CoinGecko API
fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd", { mode: 'cors' })
    .then((res) => res.json())
    .then((data) => {
        const solPrice = data.solana.usd;
        document.getElementById("solana-price").innerText = "$" + solPrice.toFixed(2);
    })
    .catch((err) => console.error("Error fetching Solana price:", err));

// 🟣 Fetch Polygon (MATIC) Gas Price
web3Polygon.eth.getGasPrice()
    .then((gasPrice) => {
        document.getElementById("polygon-gas").innerText = Web3.utils.fromWei(gasPrice, "gwei") + " Gwei";
    })
    .catch((err) => console.error("Error fetching Polygon gas price:", err));
