import { ethers } from "ethers";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV_BACKEND_URL } from "../env";

const BACKEND_URL = ENV_BACKEND_URL ?? "http://localhost:4000";

const provider = ethers.getDefaultProvider();

export function HomePage(props: {}): ReactElement {
  const TOKEN = parseInt(sessionStorage.getItem("token")!);
  const USERNAME = sessionStorage.getItem("username")!;

  const useAccountLink = async () => {
    // console.log(TOKEN);
    const res = await fetch(`${BACKEND_URL}/newLinkToken?username=${USERNAME}`);
    const response = await res.json();
    if (!(res.status === 200 && response.result === "success")) {
      console.log("ERR"); //Replace with show err to user
    } else {
      // console.log(response.data.link_token);
      sessionStorage.setItem("linkToken", response.data.link_token);
      // console.log(sessionStorage.getItem("linkToken"));
      navigate("/addSource");
    }
  };

  const goToTransactions = async (account: any) => {
    navigate(`/transactions?item=${account.item_id}&account=${account.account_id}`)
  };

  function AccountTile(props: { account: any }): ReactElement {
    const account = props.account;
    return (
      <div className="block w-full bg-transparent px-8 py-3">
        <button onClick={() => goToTransactions(account)} className="flex flex-row justify-between w-full bg-gradient-to-r p-0 from-sky-200 to-sky-600 hover:from-emerald-200 hover:to-emerald-600 rounded-lg">
          <div className="relative h-full min-h-[100px] w-[60%] bg-sky-300 rounded-lg">
            <p className="absolute max-w-[85%] truncate top-3 left-3 text-black font-semibold">
              {account.name}
            </p>
            <p className="absolute bottom-3 left-3 text-black font-semibold">
              {account.subtype}
            </p>
          </div>
          <div className="relative h-[38%] bg-transparent">
            <p className="absolute top-3 right-3 text-black font-semibold">
              {account.balances.iso_currency_code}
            </p>
            <p className="absolute top-8 right-3 text-black text-2xl font-semibold">
              {account.balances.current}
            </p>
          </div>
        </button>
      </div>
    );
  }

  function FutureData(props: { dataLoaded: boolean }): ReactElement {
    if (!dataLoaded) {
      return <p className="text-white p-6 font-semibold">LOADING</p>;
    } else {
      // console.log(accountData);
      const AccountLI = (accountData as Array<any>).map((account) => {
        return <AccountTile account={account}></AccountTile>;
      });
      return <>{AccountLI}</>;
    }
  }

  let [dataLoaded, setdataLoaded] = useState(false);
  let [accountData, setAccountData]: [Array<any>, any] = useState([]);
  let [crytoBalance, setcrytoBalance] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `${BACKEND_URL}/getAllAccountData?username=${USERNAME}&token=${TOKEN}`
      );
      const resdata = await res.json();
      let accountArray = (resdata.data as Array<any>)

      const walletAddress = sessionStorage.getItem('crpytoAccount');
      if (walletAddress) {
        const balance = await provider.getBalance(walletAddress);
        setcrytoBalance(parseFloat(ethers.utils.formatEther(balance)))
        accountArray.push({
          name: walletAddress,
          subtype: 'crypto wallet',
          balances: {
            current: crytoBalance,
            iso_currency_code: 'ETH'
          }
        })
      }

      setAccountData(accountArray);
      setdataLoaded(true);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	const totalStandardBalance = (): number => {
		let tot: number = 0;
		for(const account of (accountData as unknown as Array<any>)) {
			tot = tot + account.balances.current
		}
		return tot;
	}

  const navigate = useNavigate();

  return (
    <div className="flex flex-col pb-10 items-center justify-start h-full min-h-screen bg-gradient-to-b from-zinc-800 to-neutral-900">
      {/* <button className="bg-red-500" type="button" onClick={useAccountLink}>
				Begin Plaid flow
			</button> */}

      <div className="block pt-10 bg-transparent">
        <img
          className="object-contain h-20 w-full"
          src="/fibox_logo_orange.png"
          alt="logo"
        ></img>
      </div>

      <div className="flex justify-between self-start flex-row pt-10 px-7 pb-4 p-4 min-h-max w-full">
        <div className="flex flex-col items-start">
          <h1 className="inline text-lg text-gray-400 pb-0">Welcome</h1>
          <h1 className="text-3xl font-bold pb-3 text-slate-100">Dashboard</h1>
        </div>
        <div className="text-white self-center font-semibold text-center bg-sky-600 rounded-lg h-12 w-12">
          <p className="text-xl font-semibold mt-[10px]">{USERNAME.at(0)?.toUpperCase()}</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-transparent px-7 p-4 min-h-4 w-full">
        <div className="flex flex-col pb-5 items-center justify-start rounded-lg bg-transparent border border-gray-500 min-h-4 w-full">
          <div className="flex flex-row justify-between items-center w-full pt-4 pb-5 px-6">
            <h1 className="text-white font-semibold text-xl">My Accounts</h1>
            <button
              onClick={useAccountLink}
              className="text-white rounded-2xl bg-sky-600 hover:bg-sky-800 w-6 pb-1 h-full"
            >
              +
            </button>
          </div>

          <FutureData dataLoaded={dataLoaded}></FutureData>
        </div>
      </div>

      <div className="flex flex-col w-screen bg-transparent">
        <h1 className="block self-start px-7 pt-4 text-3xl font-bold pb-0 text-slate-100">
          Overview
        </h1>

        <div className="flex flex-col w-full px-9 py-3 items-stretch justify-start bg-transparent">

          <div className="flex relative flex-row w-full bg-transparent px-3 justify-start items-center">
            <div className="text-white self-center font-semibold text-center bg-sky-600 rounded-lg h-12 w-12">
              <p className="text-xl font-semibold mt-[10px]">$</p>
            </div>
						<div className="flex flex-col h-full w-[70%] items-start justify-center p-4 bg-transparent">
							<p className="inline text-sm text-gray-400 pb-0">Standard Balance</p>
							<p className="text-xl font-semibold text-slate-100">{totalStandardBalance()}</p>
						</div>
						<button className="absolute right-4 text-white justify-self-end self-center font-semibold text-center bg-transparent border-2 border-gray-500 hover:bg-gray-600 rounded-lg h-12 w-12">
              <p className="text-2xl font-semibold mt-0 pb-[4px]">{'→'}</p>
            </button>
          </div>

					<div className="flex relative flex-row w-full bg-transparent px-3 justify-start items-center">
            <div className="text-black self-center font-semibold text-center bg-sky-300 rounded-lg h-12 w-12">
              <p className="text-xl font-semibold mt-[10px]">⟠</p>
            </div>
						<div className="flex flex-col h-full w-[70%] items-start justify-center p-4 bg-transparent">
							<p className="inline text-sm text-gray-400 pb-0">Crpto Balance</p>
							<p className="text-xl font-semibold text-slate-100">{crytoBalance}</p>
						</div>
						<button className="absolute right-4 text-white justify-self-end self-center font-semibold text-center bg-transparent border-2 border-gray-500 hover:bg-gray-600 rounded-lg h-12 w-12">
              <p className="text-2xl font-semibold mt-0 pb-[4px]">{'→'}</p>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
