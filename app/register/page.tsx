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
        <main> 
            <h1> REGISTER </h1>
            <form onSubmit={handleSubmit}> 
                <input
                placeholder="Email"
                value={email}
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                />
                <input
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e)=> setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}> 
                {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {error && <p> {error} </p>}
        </main>

    ); 
}