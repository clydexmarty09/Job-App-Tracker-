"use client"; 
import { useState } from "react"; 


export default function ForgotPasswordRequest() {

    const [email, setEmail] = useState("")
    const [error, setError] = useState<string>(""); 
    const [loading, setLoading] = useState(false); 

    const sendEmail = async (e:React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault(); 
        setLoading(true); 
        setError(""); 

        try {
            const res = await fetch(`/api/auth/password-reset`, 
                 {
                    method: "POST", 
                    headers:  {
                        "Content-Type": "application/json", 
                    },  body: JSON.stringify({ email }), 
            }); 
        
            if(!res.ok) {
                setError("An error has occured.")
                return; 
            }
                 
                 
        } catch (e) {
            console.error(e); 
            setError("Cannot send email"); 
            return; 
        } finally {
            setLoading(false); 
        }
    }

    return (
       <main className="landing-page"> 

            <div className="landing-page-outer-div">
                <div className="landing-page-inner-div">
                    <h1 className="text-center font-medium text-2xl p-3"> RESET PASSWORD</h1>
                    <p className="text-gray-500 text-sm my-2"> Please enter your email: </p>
                    
                    <form className="form-preset" onSubmit={sendEmail} >
                        <input
                        className="form-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        />

                        <button disabled={loading} className="btn-1" type="submit"> {loading ? "Submitting..." : "Submit "} </button>

                    </form>
                    {error && (
                        <p className="text-red-500/80 text-sm"> {error} </p>
                    )}
                </div>
            </div>

       </main> 
    ); 
}