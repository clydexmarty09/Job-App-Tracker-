"use client"; 
import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link";

export default function Register() {

    const router = useRouter(); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 

    async function handleSubmit(e: any) {
        e.preventDefault(); 
        setError(""); 
        setLoading(true); 

        try {

            const res = await fetch("/api/auth/register", {
                method:"POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify({
                    email, password, 
                }), 
            }); 

            const data = await res.json()
            if(!res.ok) {
                setError(data.error || "Registration Failed")
                return; 
            }

            console.log(data); 

            router.push("/login"); 

        } catch {
            setError("Registration failed"); 

        } finally {
            setLoading(false); 
        }
    }

    return(
     <main className="landing-page">
        {/*flex-1 expands to fill all the remaining vertical space */}
        <div className="flex-1 flex items-center justify-center md:items-start md:pt-20">
         <div className="w-full max-w-md flex flex-col items-center">
            <h1 className="text-2xl font-medium p-3"> REGISTER </h1>
   
            <form className="form-preset" onSubmit={handleSubmit}> 
                <input
                className="form-input"
                placeholder="Email"
                value={email}
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                />
                <input
                className="form-input"
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e)=> setPassword(e.target.value)}
                />
                <button className="btn-submit" type="submit" disabled={loading}> 
                {loading ? "Registering..." : "Register"}
                </button>
            </form>
            

            
            {error && <p> {error} </p>}
            </div>
            </div>

            <p className="text-center text-xs text-gray-700 mt-auto p-5"> Have an account? <span> <Link className="text-blue-500/80 hover:underline" href="/login"> Log In </Link> instead </span> </p>

        </main>

    ); 
}