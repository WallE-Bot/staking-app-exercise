import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Address, Balance, Wallet, Account } from "../../components";
import './WalletPanel.css';

export default function WalletPanel({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {

  const [collapsed, toggleCollapsed] = useState(false);

  const handleTabClick = () => {
    const newCollapsed = !collapsed;
    toggleCollapsed(newCollapsed);
  }

  const generateCollapsedClass = () => {
    return collapsed ? ' collapsed' : '';
  }

  useEffect(() => {

  }, []);

  return (
    <div
      className={`wallet-panel${generateCollapsedClass()}`}
    >
      <Account
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
      <span
        className={`wallet-panel-tab${generateCollapsedClass()}`}
        onClick={handleTabClick}
      >
        wallet
      </span>
    </div>
  );
}
