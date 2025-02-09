import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Web3 from "web3";
import DropdownCrypto from "./DropdownCrypto";
import "./App.css";

const web3 = new Web3("https://bsc-dataseed.binance.org/");
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const BSC_SCAN_API = "https://api.bscscan.com/api"
const BSC_API_KEY = "TSDDXXKM3AMYI9ZS2R1FME8N724A2579A2";

const TOKEN_URL = "https://tokens.pancakeswap.finance/pancakeswap-extended.json";

const routerABI = [
  {
    constant: true,
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const tokenABI = [
  { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
  { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
  { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" },
  { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }
];

const router = new web3.eth.Contract(routerABI, PANCAKE_ROUTER);

function App() {
  const [tokenToAddress, setTokenToAddress] = useState(new Map());
  const [options, setOptions] = useState<string[]>([]);
  const [convertFrom, setConvertFrom] = useState<string | null>(null);
  const [convertTo, setConvertTo] = useState<string | null>("WBNB");
  const [price, setPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [address, setAddress] = useState<string | null>("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
  const [BNBTokens, setBNBTokens] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<AxiosResponse | null>(null);
  const [tokenInfoFrom, setTokenInfoFrom] = useState();
  const [tokenInfoTo, setTokenInfoTo] = useState();
  
  useEffect(() => {
    const getTokenList = async () => {
      try {
        const response = await axios.get(TOKEN_URL);
        const newTokenMap = new Map();
        const newOptions = [];

        response.data.tokens.forEach((t) => {
          newOptions.push(t.symbol);
          newTokenMap.set(t.symbol, t.address);
        });

        setTokenToAddress(newTokenMap);
        setOptions([...new Set(newOptions)]); 
      } catch (error) {
        console.error("Error fetching token list:", error);
      }
    };

    getTokenList();
  }, []);

  
  useEffect(() => {
    const getTokenPrice = async () => {
      if (!convertFrom || !convertTo || !tokenToAddress.has(convertFrom) || !tokenToAddress.has(convertTo)) {
        return;
      }

      try {
        const amountInWei = web3.utils.toWei("1", "ether"); 
        const fromAddress = tokenToAddress.get(convertFrom);
        const toAddress = tokenToAddress.get(convertTo);

        const amounts = await router.methods.getAmountsOut(amountInWei, [fromAddress, toAddress]).call();
        const amountOut = web3.utils.fromWei(amounts[1].toString(), "ether");

        setPrice(Number(amountOut));

        getTokenInfo(convertFrom).then(data => {
          setTokenInfoFrom({ name: data?.name, decimals: data?.decimals, totalSupply: data?.totalSupply});
        });
        getTokenInfo(convertTo).then(data => {
          setTokenInfoTo({ name: data?.name, decimals: data?.decimals, totalSupply: data?.totalSupply});
        });
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };
    const intervalPrice = setInterval(getTokenPrice, 2000);
    
    return () => {
      clearInterval(intervalPrice);
    }
  }, [convertFrom, convertTo, tokenToAddress]);

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = () => {
    if(!address)return;
    getBalance();
    getTransactions();
  };

  const getBalance = async () => {
    try {
        const response = await axios.get(BSC_SCAN_API, {
          params: {
            module: "account",
            action: "balance",
            address: address,
            apikey: BSC_API_KEY
          }
        });
        if(response.data.status !== "1"){
          console.log("Error fetching token list");
          return;
        }
        
        setBNBTokens(response.data.result);
    } catch (error) {
        console.error("Error fetching token list:", error);
    }
  };

  const getTransactions = async () => {
    try {
        const response = await axios.get(BSC_SCAN_API, {
          params: {
            module: "account",
            action: "txlist",
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 5,
            sort: "desc",
            apikey: BSC_API_KEY
          }
        });
        console.log(response);
        if(response.data.status !== "1"){
          console.log("Error fetching transcation list");
          return;
        }
        
        setTransactions(response);

    } catch (error) {
        console.error("Error fetching transaction list:", error);
    }
  };

  const getTokenInfo = async (tokenSymbol: string) => {
    try {
      const tokenContract = new web3.eth.Contract(tokenABI, tokenToAddress.get(tokenSymbol));

      const name = await tokenContract.methods.name().call();
      const symbol = await tokenContract.methods.symbol().call();
      const decimals = await tokenContract.methods.decimals().call();
      const totalSupply = await tokenContract.methods.totalSupply().call();
      return {name: name, symbol: symbol, decimals: decimals, totalSupply: totalSupply}
    }
    catch(error){

    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-10">
      <h1>Convert</h1>
      <p>Enter desired amount:</p>
      <input
        type="text"
        style={{
          width: '65%',
          marginBottom: '32px',
          padding: '8px',
          fontSize: '16px',
          boxSizing: 'border-box',
        }}
        placeholder="Type desired amount"
        value={amount}
        onChange={handleInputChange}
        className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
      />
      <DropdownCrypto options={options} onOptionSelect={setConvertFrom} /> to
      <DropdownCrypto options={options} onOptionSelect={setConvertTo} />
      {price ? <p>{amount} {convertFrom} = {price*amount} {convertTo}</p> : <h4>Loading price...</h4>}
      {tokenInfoFrom && tokenInfoTo ? <><h4>Info about tokens:</h4> 
      <p>{tokenInfoFrom.name}</p>
      <p>Decimals: {tokenInfoFrom.decimals}</p>
      <p>Total Amount: {tokenInfoFrom.totalSupply}</p>
      
      <p>{tokenInfoTo.name}</p>
      <p>Decimals: {tokenInfoTo.decimals}</p>
      <p>Total Amount: {tokenInfoTo.totalSupply}</p>
      </> : <h4>Loading info about tokens...</h4>}
      <h1>BSC Wallet Balance</h1>
      <input
        type="text"
        style={{
          width: '65%',
          padding: '8px',
          margin: '8px',
          fontSize: '16px',
          boxSizing: 'border-box',
        }}
        placeholder="Type BNS address"
        value={address ? address : ""}
        onChange={handleInputChange2}
        className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div></div>
      <button onClick={handleSubmit}>Check balance</button>
        { BNBTokens !== null ? <p> BNB: {web3.utils.fromWei(BNBTokens,"ether")}</p> : <p>Loading BNB tokens....</p>}
        <h4>Last transactions:</h4>
        { transactions?.data.result.map(result => (
          <p>From: <div>{result.from}</div> To: <div>{result.to}</div> Value: {web3.utils.fromWei(result.value,"ether")} BNB</p>
        ))}
    </div>
  );
}

export default App;
