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

        } catch (error) {
            setError("Invalid ")
        }
    }

    return(
        <main> 
            <h1> REGISTER </h1>
            <form> 
                <input
                placeholder="Email"
                />
                <input
                placeholder="Password"
                />
                <button> Create Account</button>
            </form>
        </main>

    ); 
}