"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation";

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
        <main> 
            <h1> LOGIN</h1>


        <form onSubmit={handleSubmit}> 
            <input
             type="email"
             value={email}
             onChange={(e)=> setEmail(e.target.value)}
             placeholder="Email"
             /> 

             <input
             type="password"
             value={password}
             onChange={(e)=> setPassword(e.target.value)}
             placeholder="Password"
             />

             <button type="submit"> Login </button>
        </form>

        {error && <p> {error} </p>}
        </main>

    ); 
}