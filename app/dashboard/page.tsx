"use client"; 
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";

type Application = {
    id: string; 
    company: string; 
    position: string; 
    pay: number | null; 
    status: string | null; 
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
                    company, position, status, pay: pay ? Number(pay) : null, 
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

       
        <main className="min-h-screen m-auto p-5 flex flex-col items-endcenter"> 

        <div> 
               <button className="underline text-lg hover:text-blue-400" onClick={()=> logOut()}> Log Out  </button>
        </div>
         
            <h1 className="pt-10 text-3xl font-semibold"> DASHBOARD</h1>

            { error && <p> {error}</p>}
            <form className="flex gap-6 py-4" onSubmit={handleApplication}> 
            
            <input
            className="border border-gray-400 rounded"
            value={company}
            type="text"
            placeholder="Insert company"
            onChange={(e)=> setCompany(e.target.value)}
            />

            <input
            className="border border-gray-400 rounded"
            value={position}
            type="text"
            placeholder="Insert position"
            onChange={(e)=> setPosition(e.target.value)}
            />

            <input
            className="border border-gray-400 rounded"
            value={pay}
            type="number"
            placeholder="Insert pay"
            onChange={(e)=> setPay(e.target.value)}
            /> 

            <select
            className={`border border-gray-400 rounded ${getStatusColor(status)}`}
            value={status}
            onChange={(e)=> setStatus(e.target.value)}
            >
                <option value=""> No status </option>
                <option value="Applied"> Applied </option> 
                <option value="Interviewed"> Interviewed </option>
                <option value="Offer"> Offer </option>
                <option value="Rejected"> Rejected </option>
                
            </select> 

            <button className="hover:scale-105 transition border rounded-md border-gray-500 bg-blue-300/60 p-2 " type="submit" disabled={loading}> 
                {loading ? "Saving..." : "Add Application"}
            </button>

            </form>

            {loading ? (
                <p> Loading... </p> ) : 
            applications.length === 0 ? (
                <p className="text-red-600/80"> No applications yet. </p>
            ): (
                <div className="pt-4 flex flex-col text-xs gap-4">   
                    {applications.map((app)=> (
                        <div className="grid grid-cols-5 gap-10 items-center" key={app.id}> 
                        <p> Company: <span className="text-gray-800/70"> {app.company} </span> </p>
                        <p> Position: <span className="text-gray-800/70"> {app.position} </span> </p>
                        <p> Pay: <span className="text-green-700"> {app.pay ?? "No pay listed"} </span> </p>
                        
                        <select
                        className={`${getStatusColor(status)}`} 
                        value={app.status ?? ""}
                        onChange={(e)=> handleStatusChange(app.id, e.target.value)}> 

                            <option value=""> No Status </option>
                            <option value="Applied"> Applied </option>
                            <option value="Interviewed"> Interviewed </option>
                            <option value="Offer"> Offer </option>
                            <option value="Rejected"> Rejected </option>
                        
                        </select>

                        <button className="hover:scale-105 transition border border-gray-500 p-2 rounded font-semibold" onClick={()=> handleDelete(app.id)}> DELETE</button>
                        
                        </div>
                    ))}

                </div>
        )}
        </main>

    ); 
}