import { ReactElement, useCallback } from "react";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export function NewItemPage(): ReactElement {
  const TOKEN = parseInt(sessionStorage.getItem("token")!);
  const USERNAME = sessionStorage.getItem("username")!;
  const linkToken = sessionStorage.getItem("linkToken")!;
  // console.log(linkToken)

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
        } else {
          console.log("ERR"); //Replace with show err to user
        }
      });
    },
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

  

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-t from-zinc-800 to-neutral-900">
      <p className="text-white">{linkToken}</p>
      <button onClick={() => open()} type='button' disabled={!ready}>
        Connect a bank account
      </button>
    </div>
  );
}
