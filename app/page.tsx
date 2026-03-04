"use client"; 

import {useState} from "react"; 

export default function Home() {
  
  const [counter, setCounter] = useState(0); 
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black gap-6">
        <h1 className="items-center m-auto p-4 font-semibold"> Job App Tracker </h1>

        <p> {counter} </p>
        <button className="text-black border border-green-500/70 rounded-md p-4" onClick={()=> 
          setCounter(counter+1)
        }> Increase counter </button>

        <button className="text-black border border-red-500/70 rounded-md p-4" onClick={()=>
          setCounter(counter-1)
        }> Decrease counter </button>
      </main>
    </div>
  );
}
 