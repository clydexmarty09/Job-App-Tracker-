"use client"; 
import { useState } from "react"; 


export default function PasswordReset() {

    const [email, setEmail] = useState("")
    const [error, setError] = useState<string>(""); 
    const [loading, setLoading] = useState(false); 

    const sendEmail = async () => {

        setLoading(true); 
        setError(""); 

        try {
            const res = await fetch(`/api/`)
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
                    
                    <form className="form-preset">
                        <input
                        className="form-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        />

                        <button className="btn-1" type="submit"> Submit </button>

                    </form>
                </div>
            </div>

       </main> 
    ); 
}