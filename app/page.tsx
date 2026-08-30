"use client"; 

import Link from "next/link";  

export default function Home() {
  
  
  return (
    <div className="overflow-hidden flex min-h-dvh items-center justify-center bg-background text-foreground font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center px-6 py-8 gap-6">
        <h1 className="items-center m-auto p-4 font-bold text-2xl"> Job App Tracker </h1>
        <p className="text-gray-500 text-sm md:text-base text-center max-w-sm"> 
          Track job applications, update their status, and stay organized. 
        </p>
  

        <div className="flex gap-10 md:gap-24 mt-4 p-4 font-semibold"> 
          <Link className="bg-blue-300/60 border text-sm md:text-base rounded-md border-gray-600 p-2 md:p-4 hover:scale-110 transition w-28 md:w-40 text-center" href="/register"> Register </Link>
          <Link className="bg-blue-300/60 border text-sm md:text-base rounded-md border-gray-600 p-2 md:p-4 hover:scale-110 transition w-28 md:w-40 text-center" href="/login"> Log In </Link>
        </div>
      </main>
    </div>
  );
}
 
