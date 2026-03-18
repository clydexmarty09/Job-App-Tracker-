"use client"; 

import {useState} from "react";
import Link from "next/link";  

export default function Home() {
  
  //const [counter, setCounter] = useState(0); 
  
  return (
    <div className="sm:p-4 sm:m-4 flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center p-10 bg-white dark:bg-black gap-6">
        <h1 className="items-center m-auto p-4 font-bold text-2xl"> Job App Tracker </h1>
        <p className="text-gray-500 text-sm md:text-base text-center max-w-sm"> 
          Track job applications, update their status, and stay organized. 
        </p>
  

        {/* <p> {counter} </p>
        <button className="text-black border border-green-500/70 rounded-md p-4" onClick={()=> 
          setCounter(counter+1)
        }> Increase counter </button>

        <button className="text-black border border-red-500/70 rounded-md p-4" onClick={()=>
          setCounter(counter-1)
        }> Decrease counter </button> */}

        <div className="flex gap-10 md:gap-24 mt-4 p-4 font-semibold"> 
          <Link className="bg-blue-300/60 border text-sm md:text-base rounded-md border-gray-600 p-2 md:p-4 hover:scale-110 transition w-28 md:w-40 text-center" href="/register"> Register </Link>
          <Link className="bg-blue-300/60 border text-sm md:text-base rounded-md border-gray-600 p-2 md:p-4 hover:scale-110 transition w-28 md:w-40 text-center" href="/login"> Log In </Link>
        </div>
      </main>
    </div>
  );
}
 