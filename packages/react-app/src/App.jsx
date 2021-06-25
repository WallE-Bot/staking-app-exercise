import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu, Alert, List } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader,
         useContractReader, useEventListener, useBalance,
         useExternalContractLoader} from "./hooks";
import { Header, TotalStaked, TimeLeft, UserStake, Faucet,
         Ramp, Contract, GasGauge, Balance, Address, StakeWithdrawPanel,
         Execute, FaucetPanel, StakeEventsPanel, NetworkDisplay } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";
import { Hints, ExampleUI, Subgraph } from "./views"
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    📡 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['ropsten']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false

// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork,mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork,"fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);
  if(DEBUG) console.log("👩‍💼 selected address:",address)

  // You can warn the user if you would like them to be on a specific network
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId
  if(DEBUG) console.log("🏠 localChainId",localChainId)

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId
  if(DEBUG) console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if(DEBUG) console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if(DEBUG) console.log("📝 readContracts",readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts",writeContracts)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  //console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  //const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  //

  //keep track of contract balance to know how much has been staked total:
  const stakerContractBalance = useBalance(localProvider, readContracts && readContracts.Staker.address);
  if(DEBUG) console.log("💵 stakerContractBalance", stakerContractBalance )

  //keep track of total 'threshold' needed of ETH
  const threshold = useContractReader(readContracts,"Staker", "threshold" )

  // keep track of a variable from the contract in the local React state:
  const balanceStaked = useContractReader(readContracts,"Staker", "balances",[ address ])

  //📟 Listen for broadcast events
  const stakeEvents = useEventListener(readContracts, "Staker", "Stake", localProvider, 1);

  // keep track of a variable from the contract in the local React state:
  const timeLeft = useContractReader(readContracts,"Staker", "timeLeft")

  // keep track of staker execution feedback
  const executionFeedback = useContractReader(readContracts,"Staker", "executionFeedback")

  const complete = useContractReader(readContracts,"ExampleExternalContract", "completed")

  const exampleExternalContractBalance = useBalance(localProvider, readContracts && readContracts.ExampleExternalContract.address);
  if(DEBUG) console.log("💵 exampleExternalContractBalance", exampleExternalContractBalance )


  let completeDisplay = ""
  if(complete){
    completeDisplay = (
      <div style={{padding:64, backgroundColor:"#eeffef", fontWeight:"bolder"}}>
        🚀 🎖 👩‍🚀  -  Staking App triggered `ExampleExternalContract` -- 🎉  🍾   🎊
        <Balance
          balance={exampleExternalContractBalance}
          fontSize={64}
        /> ETH staked!
      </div>
    )
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  const generateExecutionFeedbackHTML = () => {
    return executionFeedback === ''
      ? ''
      : <p>{executionFeedback}</p>;
  }

  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header
        mainnetProvider={mainnetProvider}
        localProvider={localProvider}
      />

      <main>

        {/* maintain router for now in case needed */}
        <BrowserRouter>

          <Switch>
            <Route exact path="/">

            {/* notification bar for threshold met - move later*/}
            {completeDisplay}

            <NetworkDisplay
              localChainId={localChainId}
              selectedChainId={selectedChainId}
              network={NETWORK}
              networkName={targetNetwork.name}
            />

            <StakeEventsPanel
              stakeEvents={stakeEvents}
              ensProvider={mainnetProvider}
            />

            <TotalStaked
              stakerContractBalance={stakerContractBalance}
              threshold={threshold}
            />

            <TimeLeft
              timeLeft={timeLeft}
              onClickHandler={() => tx( writeContracts.Staker.execute() )}
            />

            <UserStake
              balanceStaked={balanceStaked}
              stakerContractBalance={stakerContractBalance}
              price={price}
            />

            <StakeWithdrawPanel
              price={price}
              withdrawFunction={ (amount) => tx( writeContracts.Staker.withdraw(amount)) }
              stakeFunction = { (amount) => tx( writeContracts.Staker.stake(amount, {value: amount}) ) }
              userBalance={yourLocalBalance}
              balanceStaked={balanceStaked}
              stakerContractBalance={stakerContractBalance}
            />

              {/*
                  🎛 this scaffolding is full of commonly used components
                  this <Contract/> component will automatically parse your ABI
                  and give you a form to interact with it locally
              */}

            </Route>
            <Route path="/contracts">
              <Contract
                name="Staker"
                signer={userProvider.getSigner()}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
              />
              <Contract
                name="ExampleExternalContract"
                signer={userProvider.getSigner()}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </main>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}

      {/* move later */}
      <div style={{marginTop:32,opacity:0.5}}>Created by <Address
        value={"Your...address"}
        ensProvider={mainnetProvider}
        fontSize={16}
      /></div>

        {
          /*  if the local provider has a signer, let's show the faucet:  move to function later*/
          localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname)>=0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
            <FaucetPanel
              localProvider={localProvider}
              price={price}
              ensProvider={mainnetProvider}
              address={address}
              networks={NETWORKS}
              gasPrice={gasPrice}
            />
          ) : (
            ""
          )
        }

    </div>
  );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
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

export default App;
