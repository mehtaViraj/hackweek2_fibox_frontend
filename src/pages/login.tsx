import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000"

export function LoginPage(props: {}): ReactElement {

  const onSubmitHandler = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await fetch(`${BACKEND_URL}/login?username=${e.target[0].value}&password=${e.target[1].value}`)
      .then(async (res)=>{
        const response = await res.json()
        if (res.status === 200 && response.result === 'success') {
          // console.log(response.data.token)
          sessionStorage.setItem('token', response.data.token)
          sessionStorage.setItem('username', e.target[0].value)
          // console.log(parseInt(sessionStorage.getItem('token')!))
          navigate('/home')
        } else {
          console.log('ERR') //Replace with show err to user
        }
      })
  }

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-zinc-800 to-neutral-900">
      <div className="relative bg w-max h-max rounded-lg p-1 m-0">
        <h1 className="text-3xl font-bold pb-3 text-slate-100">Hey There!</h1>
        <h1 className="text-lg text-gray-400 pb-10">Let's check back in</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="pr-5 py-2 border-b border-gray-400">
            <input
              className="shadow bg-transparent appearance-none rounded w-full pt-3 px-2 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            ></input>
          </div>
          <div className="pr-5 py-2 border-b border-gray-400">
            <input
              className="shadow bg-transparent appearance-none rounded w-full pt-3 px-2 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="password"
              placeholder="Password"
            ></input>
          </div>
          <div className="pt-10">
            <button
              type="submit"
              className=" text-center hover:cursor-pointer text-black font-semibold bg-white hover:bg-gray-400 align-middle rounded-lg w-full h-max mx-1 mt-2 py-1 px-3"
            >
              Enter
            </button>
          </div>
          <div className="pt-0">
            <button
              type="button"
              onClick={()=>{navigate('/signup')}}
              className="text-white font-semibold text-center hover:cursor-pointer bg-orange-600 hover:bg-orange-900 align-middle rounded-lg w-full h-max mx-1 m-2 pt-1 pb-[5px] px-3"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
