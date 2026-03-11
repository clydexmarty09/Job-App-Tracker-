"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link"; 

export default function Login() {
    
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(""); 
    const router = useRouter(); 

    // stop page refresh-> send email/password to backend-> wait for backend response-> if login failed, show error->if login succeed save user id -> go to dashboard 
    async function handleSubmit(e: any) {
        e.preventDefault(); // stops browser default form submission behavior  
        setError("");  // clears any old error message before new login attempt 

        const response = await fetch("/api/auth/login", {  // send HTTP request to backed login route 
            method: "POST", 
            headers: {
                "Content-Type": "application/json",  // send JSON data
            }, 
            body: JSON.stringify({  // turns JS object inton JSON string
                email, password,
            }), 
        }); 

        const data = await response.json(); // reads response body and converts it from JSON to JS object
        if(!response.ok) {  // if true: 200 
            setError(data.error || "Login failed"); 
            return; 
        }

        localStorage.setItem("userId", data.user.id);  // saves logged in user's ID in the browser's local storage
        router.push("/dashboard");  // naviagtes user to dashboard page 
    }
   
   
    return(
        <main className="min-h-screen m-auto p-4 flex flex-col items-center"> 
            <h1 className="font-medium text-2xl p-3"> LOGIN</h1>


        <form className="flex gap-20 p-4" onSubmit={handleSubmit}> 
            <input
            className="border border-gray-300 rounded-md p-2"
             type="email"
             value={email}
             onChange={(e)=> setEmail(e.target.value)}
             placeholder="Email"
             /> 

             <input
             className="border border-gray-300 rounded-md p-2"
             type="password"
             value={password}
             onChange={(e)=> setPassword(e.target.value)}
             placeholder="Password"
             />

             <button className="transition hover:scale-105 text-center border rounded w-20 p-3 border-gray-500 bg-blue-300/60" type="submit"> Login </button>
        </form>

         <p className="text-xs text-gray-700 mt-auto p-5"> Don't have an account? <span> <Link className="text-blue-500/80 hover:underline" href="/register"> Register </Link> instead </span> </p>

        {error && <p className="text-red-600 text-xs p-2"> {error} </p>}
        </main>

    ); 
}