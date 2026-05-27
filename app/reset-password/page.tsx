"use client"; 
import { useSearchParams, useRouter} from "next/navigation";
import { useState } from "react";

export default function PasswordReset() {
    
    const router = useRouter(); 

    const searchParams = useSearchParams(); 
    const token = searchParams.get("token"); 

    const [pw, setPw] = useState(""); 
    const [confirmPw, setConfirmPw]= useState(""); 

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const[success, setSuccess] = useState(false); 

    const resetPassword = async(e:React.SubmitEvent<HTMLFormElement>) => {
        
        e.preventDefault(); 
        setLoading(true); 
        setError("");

        if(!token) {
            setError("Token not found."); 
            setLoading(false); 
            return; 
        }

        if(pw !==confirmPw) {
            setError("Passwords do not match!"); 
            setLoading(false); 

            return; 
        }

        try {

            const res = await fetch(`/api/auth/reset-password`, {

                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, body: JSON.stringify({password: pw, token}), 
            })

            if(!res.ok) {
                setError("Cannot update password"); 
                return; 
            }

            setTimeout(()=> {
                setSuccess(true); 

                setTimeout(()=> setSuccess(false), 3000); 
            }, 500)

            router.push(`/login`); 
            
        } catch (e) {
            console.error(e)
            setError("Cannot update password"); 
            return; 

        } finally {
            setLoading(false); 
        }
    }

    return (
        <main className="landing-page"> 
            <div className="landing-page-outer-div"> 
                <div className="landing-page-inner-div"> 
                    <h1 className="text-center font-medium text-2xl p-3"> RESET PASSWORD </h1>
                  
                    <form onSubmit={resetPassword} className="form-preset"> 
                       
                        <input 
                        className="form-input"
                        placeholder="Enter password"
                        value={pw}
                        onChange={(e)=> setPw(e.target.value)}
                        type="password"
                        /> 
                      
                        
                        <input 
                        className="form-input"
                        placeholder="Confirm password"
                        value={confirmPw}
                        onChange={(e)=> setConfirmPw(e.target.value)}
                        type="password"
                        />  
                    
                        <button disabled={loading} className="btn-1"> {loading ? "Loading..." : "Update Password"} </button>

                    </form>
                    {error && (
                        <p className="text-red-500/80 text-sm"> {error} </p>
                    )}

                    {success && (
                        <p className="text-green-500/80 text-sm"> Password reset succesfully! </p>
                    )}


                </div>
            </div>
        </main>
    )
}