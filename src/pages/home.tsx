import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000"

export function HomePage(props: {}): ReactElement {

	const TOKEN = parseInt(sessionStorage.getItem('token')!);
	const USERNAME = sessionStorage.getItem('username')!;

  const useNewPlaidLink = async () => {
		console.log(TOKEN)
    const res = await fetch(`${BACKEND_URL}/newLinkToken?username=${USERNAME}`)
		const response = await res.json();
		if (!(res.status === 200 && response.result === 'success')) {
			console.log('ERR') //Replace with show err to user
		} else {
			// console.log(response.data.link_token);
			sessionStorage.setItem('linkToken', response.data.link_token);
			console.log(sessionStorage.getItem("linkToken"))
			navigate('/addSource');
		}
  };

	const navigate = useNavigate()

  return (
		<div className="flex items-center justify-center h-screen bg-gradient-to-t from-zinc-800 to-neutral-900">
			<button className="bg-red-500" type="button" onClick={useNewPlaidLink}>
				Begin Plaid flow
			</button>
		</div>
  );
}
