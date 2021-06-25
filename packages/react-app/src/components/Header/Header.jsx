import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { PageHeader, Button } from "antd";
import { Account, Address, WalletPanel } from "../../components";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useUserAddress } from "eth-hooks";
import { useUserProvider, useExchangePrice, useBalance, useGasPrice } from "../../hooks";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORKS } from "../../constants";
import { Transactor } from "../../helpers";
import { parseEther, formatEther } from "@ethersproject/units";

export default function Header(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const { mainnetProvider, localProvider } = props;
  const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork,mainnetProvider);
  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork,"fast");

  const localProviderUrl = targetNetwork.rpcUrl;
  const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
  const blockExplorer = targetNetwork.blockExplorer;

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  const faucetTx = Transactor(localProvider, gasPrice);

  const yourLocalBalance = useBalance(localProvider, address);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    // since PageHeader was used as the Header, use div for now
    <div className='header'>
      <a href="/" /*target="_blank" rel="noopener noreferrer"*/>
        <PageHeader
          title="Staking App Demo"
          subTitle="practice exercise"
          style={{ cursor: "pointer" }}
        />
      </a>

      {/* wallet panel */}
      <WalletPanel
        address={address}
        localProvider={localProvider}
        userProvider={userProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
      />
    </div>
  );
}

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

 window.ethereum && window.ethereum.on('chainChanged', chainId => {
  setTimeout(() => {
    window.location.reload();
  }, 1);
})
