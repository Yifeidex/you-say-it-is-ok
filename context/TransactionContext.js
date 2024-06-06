import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { client } from '../lib/sanityClient';
import Transactions from '../lib/Transactions.json';  // 确保路径正确

export const TransactionContext = React.createContext();

let eth;

if (typeof window !== 'undefined') {
  eth = window.ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  // 使用 Uniswap V2 Router02 的地址和 ABI
  const transactionContract = new ethers.Contract(
    "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",  // 使用正确的合约地址
    Transactions.abi,
    signer,
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const router = useRouter();
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    path: [],  // 确保 path 数组中包含了正确的代币地址
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,  // 设置合理的 deadline
  });

  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const userDoc = {
        _type: 'users',
        _id: currentAccount,
        userName: 'Unnamed',
        address: currentAccount,
      };

      await client.createIfNotExists(userDoc);
    })();
  }, [currentAccount]);

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    if (!eth) return alert('Please install MetaMask.');

    const accounts = await eth.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    }
  };

  const swapTokens = async () => {
    const { addressTo, amount, path, deadline } = formData;
    const transactionContract = getE
    return amountOut;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        swapTokens,  // 提供给组件调用的新函数
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
