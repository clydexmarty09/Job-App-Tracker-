"use client"; 
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";

type Application = {
    id: string; 
    company: string; 
    position: string; 
    pay: number | null; 
    status: string | null; 
    created_at : string;
    location: string;  
}; 

export default function Dashboard() {

    const router = useRouter(); // for checking proper proper user log in
    const [error, setError] = useState(""); 
    const [applications, setApplications] = useState<Application[]>([]) 
    const [loading, setLoading] = useState(false) ;
    const [company, setCompany] = useState("");
    const [pay, setPay] =  useState(""); 
    const [status, setStatus] = useState(""); 
    const [position, setPosition] = useState(""); 
    const [location, setLocation] = useState(""); 

    async function fetchApplications() {
        setLoading(true); 
        setError(""); 
        // const id = localStorage.getItem("userId") 

        // if(!id) {
        //     setError("Cannot retrieve data")
        //     setLoading(false); 

        //     return
        // }
        

        try {
            const response = await fetch(`/api/applications`); 
            const data = await response.json()

            if(!response.ok) {
                setError(data.error || "Failed to load applications"); 
                setLoading(false); 
                return; 
            } 

            setApplications(data); 
        } catch {
            setError("Failed to load applications")

        } finally {
            setLoading(false); 
        }
    }

    async function handleApplication(e: any) {
        e.preventDefault(); 
        setError("");
        setLoading(true);  

        // const userId = localStorage.getItem("userId"); 

        // if(!userId) {
        //     setError("You musut be logged in"); 
        //     setLoading(false); 
        //     return; 
        // }

        try {
            const res =  await fetch("/api/applications", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify({
                    company, position, status, pay: pay ? Number(pay) : null, location,
                }),
                
            }); 

            const data = await res.json(); 

            if(!res.ok) {
                setError(data.error || "Failed to create applications"); 
                return; 
            }

            setCompany("")
            setPosition(""); 
            setStatus("")
            setPay("")
            setLocation(""); 

            await fetchApplications(); 
        } catch {
            setError("Failed to create applications")
        } finally {
            setLoading(false);
        }
    }

    // this function handles deleting the entire application from DB 
    async function handleDelete(id: string) {
        // send DELETE 

        setError(""); 

        try {
            const res = await fetch(`/api/applications/${id}`,{

                method: "DELETE", 
            }); 

        
        if (!res.ok) {
            throw new Error("Cannot delete data"); 
        }
            await fetchApplications(); 
        }
        // if successful, fetchApplications 
      

        catch {
            setError("Cannot delete data"); 
        }
    }

    // This function handles updating the status of the application
    async function handleStatusChange( id: string, newChange: string) {
        setError(""); 

        try {
            const res = await fetch(`/api/applications/${id}`, 
                {
                    method: "PATCH", 
                    headers: {
                        "Content-Type": "application/json", 
                    }, 
                    body: JSON.stringify({
                        status: newChange, 
                    }),
                }
            ); 

            const data = await res.json(); 
            if(!res.ok) {
                setError(data.error || "Update failed"); 
                return; 
            }

          await fetchApplications(); 
        } catch {
            setError("Update failed"); 
        }

    }

    async function handlePayChange( id: string, newPay: string) {
        setError(""); 

        try {
            const res = await fetch(`/api/applications/${id}`,
                {
                    method: "PATCH", 
                    headers: {
                        "Content-Type" : "application/json",
                    }, 
                    body : JSON.stringify({
                        pay: newPay === "" ? null: Number(newPay),
                    }),
                }
            ); 

            const data = await res.json(); 
            if(!res.ok) {
                setError(data.error || "Update failed"); 
                return; 
            }

            await fetchApplications(); 
        } catch {
            setError("Failed to update")
        }
    }

    async function logOut() { 

        try {
            await fetch("/api/auth/logout", { // sends POST to /api/auh/logout
                method: "POST",  // server kills session and clears cookie
            }); 
        } finally {
            router.push("/login");   // frontend goes to login no matter what 
        }
    }

    useEffect(()=> {
        //fetchApplications(); 

        async function checkAuth() {
            try {
                const res = await fetch("/api/auth/me");  // sends request-> backend reads session cookie 

                if(!res.ok) { // check if valid 
                    router.push("/login"); 
                    return; 
                }

                await fetchApplications(); 
            } catch {
                router.push("/login"); 
            }
        }

        checkAuth();
    }, [router])   
    
    function getStatusColor(status: string | null) {

        if (status === "Offer") { return "text-green-700"; } 
        if (status === "Rejected") { return "text-red-700";}
        if (status === "Interviewed") { return "text-blue-700";}
        if (status === "Applied") { return "text-amber-500";}

        return "text-gray-700/70"
    }

    return (

       
        <main className="min-h-dvh w-full max-w-6xl p-4 m-auto flex flex-col"> 

        <div> 
               <button className="underline text-baseline md:text-lg hover:text-blue-400" onClick={()=> logOut()}> Log Out  </button>
        </div>
         
            <h1 className="text-center py-6 md:py-10 text-2xl md:text-3xl font-semibold"> DASHBOARD</h1>

            { error && <p> {error}</p>}
            <div className="md:w-full flex justify-center md:justify-start">
                <form className="w-full mx-auto md:mx-0 max-w-sm rounded-lg p-5 flex flex-col gap-4
                md:max-w-none md:p-0 md:flex-row" onSubmit={handleApplication}> 
            
                    <input
                    className="border border-gray-400 rounded p-2"
                    value={company}
                    type="text"
                    placeholder="Insert company"
                    required
                    onChange={(e)=> setCompany(e.target.value)}
                    />
                    
            
                    <input
                    className="border border-gray-400 rounded p-2"
                    value={position}
                    type="text"
                    placeholder="Insert position"
                    required
                    onChange={(e)=> setPosition(e.target.value)}
                    />
                    
            
                    <input
                    className="border border-gray-400 rounded p-2"
                    value={pay}
                    type="number"
                    placeholder="Insert pay"
                    onChange={(e)=> setPay(e.target.value)}
                    /> 

                    <input className="border border-gray-400 rounded p-2"
                    value={location}
                    type="text"
                    placeholder="Insert Location"
                    onChange={(e)=> setLocation(e.target.value)}
                    />

                    <select
                    className={`border border-gray-400 p-2 rounded ${getStatusColor(status)}`}
                    value={status}
                    onChange={(e)=> setStatus(e.target.value)}
                    required
                    >
                        <option value=""> No status </option>
                        <option value="Applied"> Applied </option> 
                        <option value="Interviewed"> Interviewed </option>
                        <option value="Offer"> Offer </option>
                        <option value="Rejected"> Rejected </option>
                        
                    </select> 
                       
    
                    <button className="hover:scale-105 transition border w-full rounded-md border-gray-500 bg-blue-300/60 p-1" type="submit" disabled={loading}> 
                        {loading ? "Saving..." : "Add Application"}
                    </button>

                </form>
            </div>

            {loading ? (
                <p> Loading... </p> ) : 
            applications.length === 0 ? (
                <p className="text-red-600/80"> No applications yet. </p>
            ): (
                <div 
                className="pt-4 flex flex-col text-xs md:text-sm gap-4">   
                    {applications.map((app)=> (
                        <div className="border p-3 md:p-0 rounded-lg border-gray-300 shadow-sm md:border-none grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-6 md:items-center" key={app.id}> 
                        <p> 
                            <span className="font-semibold"> Company: </span>
                            <span className="text-green-700 wrap-break-word"> {app.company} </span> 
                        </p>
                        <p> 
                            <span className="text-semibold"> Position: </span>
                            <span className="text-green-700 wrap-break-word"> {app.position} </span> 
                            </p>
                       
                        {/*<p> 
                            <span className="text-semibold"> Pay:</span> 
                            <span className="text-green-700 wrap-break-word"> {app.pay ?? "No pay listed"} </span> 
                        </p>*/}

                        <input
                            className="border border-gray-400 rounded-md p-2"
                            type="number"
                            defaultValue={app.pay ?? ""}
                            onBlur={(e)=> handlePayChange(app.id, e.target.value)}           
                        />

                        <p> 
                            <span className="text-semibold"> Location: </span>
                            <span className="text-green-700 wrap-break-word"> {app.location} </span>

                        </p>
                        
                        <select
                        className={`rounded border border-gray-400 p-2 w-full ${getStatusColor(app.status)}`} 
                        value={app.status ?? ""}
                        onChange={(e)=> handleStatusChange(app.id, e.target.value)}> 

                            <option value=""> No Status </option>
                            <option value="Applied"> Applied </option>
                            <option value="Interviewed"> Interviewed </option>
                            <option value="Offer"> Offer </option>
                            <option value="Rejected"> Rejected </option>
                        
                        </select>

                        <p> 
                            <span className="font-semibold"> Added: </span>
                            <span className="text-gray-800/70 wrap-break-word"> {new Date(app.created_at).toLocaleString()} </span>
                        </p>

                        <button className="bg-red-500/80 hover:scale-105 transition border border-gray-500 p-2 rounded font-semibold" onClick={()=> handleDelete(app.id)}> DELETE</button>
                        
                        </div>
                    ))}

                </div>
        )}
        </main>

    ); 
}