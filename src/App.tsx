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

const router = new web3.eth.Contract(routerABI, PANCAKE_ROUTER);

function App() {
  const [tokenToAddress, setTokenToAddress] = useState(new Map());
  const [options, setOptions] = useState<string[]>([]);
  const [convertFrom, setConvertFrom] = useState<string | null>(null);
  const [convertTo, setConvertTo] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [address, setAddress] = useState<string | null>(null);
  const [BNBTokens, setBNBTokens] = useState<number | null>(null);
  
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

        console.log(` Fetching price for ${convertFrom} (${fromAddress}) -> ${convertTo} (${toAddress})`);

        const amounts = await router.methods.getAmountsOut(amountInWei, [fromAddress, toAddress]).call();
        const amountOut = web3.utils.fromWei(amounts[1].toString(), "ether");

        setPrice(Number(amountOut));
      } catch (error) {
        console.error("Error fetching price:", error);
      }
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
          console.log(response);
          if(response.data.status !== "1"){
            console.log("Error fetching token list");
            return;
          }
          
          setBNBTokens(Number(response.data.result));

      } catch (error) {
          console.error("Error fetching token list:", error);
      }
    };
    const intervalPrice = setInterval(getTokenPrice, 1000);
    
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
    getBalance(address);
  };

  let getBalance = async (address: string) => {
    try {
        const response = await axios.get(BSC_SCAN_API, {
          params: {
            module: "account",
            action: "balance",
            address: address,
            apikey: BSC_API_KEY
          }
        });
        console.log(response);
        if(response.data.status !== "1"){
          console.log("Error fetching token list");
          return;
        }
        
        setBNBTokens(Number(response.data.result));
    } catch (error) {
        console.error("Error fetching token list:", error);
    }
  };

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
      {price ? <p>💰 {amount} {convertFrom} = {price*amount} {convertTo}</p> : <p>Loading price...</p>}
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
        { BNBTokens !== null ? <p> BNB: {BNBTokens/1000000000000000000}</p> : <p>Loading BNB tokens....</p>}
    </div>
  );
}

export default App;
