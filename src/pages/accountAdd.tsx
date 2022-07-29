import { ReactElement, useCallback, useState } from "react";
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export function NewItemPage(): ReactElement {
  const TOKEN = parseInt(sessionStorage.getItem("token")!);
  const USERNAME = sessionStorage.getItem("username")!;
  const linkToken = sessionStorage.getItem("linkToken")!;
  // console.log(linkToken)

  const navigate = useNavigate()
  const returnToHome = () => {
    navigate('/home')
  }

  const onSuccessCallback = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      console.log(metadata);
      // log and save metadata
      // exchange public token
      await fetch(
        `${BACKEND_URL}/submitPublicToken?username=${USERNAME}&token=${TOKEN}&public_token=${public_token}`
      ).then(async (res) => {
        sessionStorage.removeItem("linkToken");
        const response = await res.json();
        if (res.status === 200 && response.result === "success") {
          console.log("ACCESS TOKEN SAVED ON BACKEND");
          returnToHome();
        } else {
          console.log("ERR"); //Replace with show err to user
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [TOKEN, USERNAME]
  );

  const config: PlaidLinkOptions = {
    onSuccess: onSuccessCallback,
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
    token: linkToken,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { open, exit, ready } = usePlaidLink(config);

  const INFURA_KEY = process.env.INFURA_KEY ?? '1bf1dac3f0214c0d9d47c6c51c819c86'

  const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK, 
      options: {
        appName: "Web 3 Modal Demo",
        infuraId: INFURA_KEY
      }
    },
    walletconnect: {
      package: WalletConnectProvider, 
      options: {
        rpc: {
          137: 'https://matic-mainnet.chainstacklabs.com',
        },
        infuraId: INFURA_KEY
      }
    }
  };
  // console.log(INFURA_KEY);

  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions // required
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [provider, setProvider] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [library, setLibrary] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [account, setAccount] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [network, setNetwork] = useState();

  
  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library: any = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setNetwork(network);
      sessionStorage.setItem('crpytoAccount', accounts[0])
      returnToHome()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-t from-zinc-800 to-neutral-900">
      <div className="block pt-10 bg-transparent">
        <img
          className="object-contain h-20 w-full"
          src="/fibox_logo_orange.png"
          alt="logo"
        ></img>
      </div>

      <button onClick={() => open()} className="block mt-14 w-max h-max font-semibold text-black rounded-lg bg-white hover:bg-slate-400 text-2xl p-5" type='button' disabled={!ready}>
        Connect a Bank Account
      </button>
      <button onClick={connectWallet} className="block mt-8 w-max h-max font-semibold text-white rounded-lg bg-orange-500 hover:bg-orange-800 text-2xl p-5" type='button' disabled={!ready}>
        Connect a Crypto Wallet
      </button>
      <button onClick={() => navigate('/home')} className="block mt-12 w-max h-max text-white rounded-lg bg-red-500 hover:bg-red-900 text-lg px-5 py-3" type='button' disabled={!ready}>
        <p className="pb-1">Cancel</p>
      </button>
    </div>
  );
}
