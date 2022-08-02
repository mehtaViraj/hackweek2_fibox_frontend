import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ENV_BACKEND_URL } from "../env";

const BACKEND_URL = ENV_BACKEND_URL ?? "http://localhost:4000";

export function TransactionDisplay(): ReactElement {
  const TOKEN = parseInt(sessionStorage.getItem("token")!);
  const USERNAME = sessionStorage.getItem("username")!;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
  const item_id = searchParams.get('item');
	const account_id = searchParams.get('account');

  function TransactionTile(props: { transaction: any }): ReactElement {
    const transaction = props.transaction;
    return (
      <div className="block w-full bg-transparent px-5 py-0">
        <div className="flex flex-col items-center justify-center border-t-2 border-orange-600 w-full px-2 py-4">
					<div className="flex flex-row pb-0 mb-0 justify-between w-full">
						<p className="text-gray-300 font-semibold">{transaction.name}</p>
            <p className="text-white font-bold">{`${transaction.iso_currency_code} ${transaction.amount}`}</p>
					</div>
          <p className="text-gray-600 self-start pt-0 mt-0">{transaction.date}</p>
        </div>
			</div>
    );
  }

  function FutureData(props: { dataLoaded: boolean }): ReactElement {
    if (!dataLoaded) {
      return <p className="text-white p-6 font-semibold">LOADING</p>;
    } else {
      const TransactionsLI = (transactions as Array<any>).map((transaction) => {
        return <TransactionTile transaction={transaction}></TransactionTile>;
      });
      return <>{TransactionsLI}</>;
    }
  }

  let [dataLoaded, setdataLoaded] = useState(false);
  let [transactions, settransactionsData]: [Array<any>, any] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `${BACKEND_URL}/getTransactions?token=${TOKEN}&username=${USERNAME}&account_id=${account_id}&item_id=${item_id}`
      );
      const resdata = await res.json();
      let transactionsArray = (resdata.data as Array<any>)
      settransactionsData(transactionsArray);
      setdataLoaded(true);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate()

  return(
		<div className="flex flex-col px-2 pt-6 pb-16 items-center justify-start h-max min-h-screen bg-gradient-to-b from-zinc-800 to-neutral-900">
      <div className="flex flex-row bg-transparent w-full items-center justify-start">
        <button onClick={() => navigate('/home')} className="ml-5 text-white justify-start self-center font-semibold text-center bg-transparent border-2 border-gray-500 hover:bg-gray-600 rounded-lg h-12 w-12">
          <p className="text-2xl font-semibold mt-0 pb-[4px]">{'⇦'}</p>
        </button>
        <h1 className="text-3xl mt-8 ml-4 self-start font-bold pb-8 text-slate-100">Recent Transactions</h1>
      </div>
			<FutureData dataLoaded={dataLoaded}></FutureData>
		</div>
	);
}
