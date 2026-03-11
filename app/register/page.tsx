"use client"; 
import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 

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
        <main className="min-h-screen m-auto p-4 flex flex-col items-center"> 
            <h1 className="text-2xl font-medium p-3"> REGISTER </h1>
            <form className="p-4 flex gap-20" onSubmit={handleSubmit}> 
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
                <button className="border rounded border-gray-500 bg-blue-300/60 p-3" type="submit" disabled={loading}> 
                {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {error && <p> {error} </p>}
        </main>

    ); 
}