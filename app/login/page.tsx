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

        //localStorage.setItem("userId", data.user.id);  // saves logged in user's ID in the browser's local storage
        router.push("/dashboard");  // naviagtes user to dashboard page 
    }
   
   
    return(
       <main className="landing-page">
            <div className="flex-1 flex items-center justify-center md:items-start md:pt-20">
            <div className="w-full max-w-md flex flex-col items-center">
                <h1 className="text-center font-medium text-2xl p-3"> LOGIN</h1>


                <form className="form-preset" onSubmit={handleSubmit}> 
                    <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="Email"
                    /> 

                    <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    placeholder="Password"
                    />

                    <button className="btn-submit" type="submit"> Login </button>
                </form>

               

            {error && <p className="text-red-600 text-xs p-2"> {error} </p>}
         </div> 
         </div> 

          <p className="text-center text-xs text-gray-700 mt-auto p-5"> Don't have an account? <span> <Link className="text-blue-500/80 hover:underline" href="/register"> Register </Link> instead </span> </p>
        </main>

    ); 
}