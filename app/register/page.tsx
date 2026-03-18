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
        <main className="min-h-dvh m-auto p-4 flex flex-col items-center"> 
            <h1 className="text-2xl font-medium p-3"> REGISTER </h1>
   
            <form className="p-4 flex flex-col md:flex-row gap-10 md:gap-20" onSubmit={handleSubmit}> 
                <input
                className="border rounded-md p-2 border-gray-300"
                placeholder="Email"
                value={email}
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                />
                <input
                className="border rounded-md p-2 border-gray-300"
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e)=> setPassword(e.target.value)}
                />
                <button className="hover:scale-105 transition text-sm md:text-base w-full md:w-40 border rounded border-gray-500 bg-blue-300/60 p-2 md:p-3" type="submit" disabled={loading}> 
                {loading ? "Registering..." : "Register"}
                </button>
            </form>
            

            <p className="text-xs text-gray-700 mt-auto p-5"> Have an account? <span> <Link className="text-blue-500/80 hover:underline" href="/login"> Log In </Link> instead </span> </p>

            {error && <p> {error} </p>}
        </main>

    ); 
}