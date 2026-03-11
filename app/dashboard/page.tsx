"use client"; 
import { useState, useEffect } from "react"; 

type Application = {
    id: string; 
    company: string; 
    position: string; 
    pay: number | null; 
    status: string | null; 
}; 

export default function Dashboard() {


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
        const id = localStorage.getItem("userId") 

        if(!id) {
            setError("Cannot retrieve data")
            setLoading(false); 

            return
        }

        try {
            const response = await fetch(`/api/applications/?userId=${id}`); 
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

        const userId = localStorage.getItem("userId"); 

        if(!userId) {
            setError("You musut be logged in"); 
            setLoading(false); 
            return; 
        }

        try {
            const res =  await fetch("/api/applications", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify({
                    userId, company, position, status, pay: pay ? Number(pay) : null, 
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

        const res = await fetch(`/api/applications/${id}`, 
            {
                method: "PATCH", 
                headers: {
                    "Content-Type": "applications/json", 
                }, 
                body: JSON.stringify({
                    status: newChange, 
                }),
            }
        ); 

        const data = await res.json(); 
        if(!data.ok) {
            setError(data.error || "Update failed"); 
            return; 
        }

        await fetchApplications(); 
    }

    useEffect(()=> {
        fetchApplications(); 
    }, [])


    return (
        <main> 
            <h1> DASHBOARD</h1>

            { error && <p> {error}</p>}
            <form onSubmit={handleApplication}> 
            
            <input
            value={company}
            type="text"
            placeholder="Insert company"
            onChange={(e)=> setCompany(e.target.value)}
            />

            <input
            value={position}
            type="text"
            placeholder="Insert position"
            onChange={(e)=> setPosition(e.target.value)}
            />

            <input
            value={pay}
            type="number"
            placeholder="Insert pay if applicable"
            onChange={(e)=> setPay(e.target.value)}
            /> 

            <input
            value={status}
            type="status"
            placeholder="Status"
            onChange={(e)=> setStatus(e.target.value)}
            />

            <button type="submit" disabled={loading}> 
                {loading ? "Saving..." : "Add Application"}
            </button>

            </form>

            {loading ? (
                <p> Loading... </p> ) : 
            applications.length === 0 ? (
                <p> No applications yet. </p>
            ): (
                <div>   
                    {applications.map((app)=> (
                        <div key={app.id}> 
                        <p> {app.company}  </p>
                        <p> {app.position} </p>
                        <p> {app.pay ?? "No pay listed"} </p>
                        <p> {app.status || "No status"} </p>

                        <button onClick={()=> handleDelete(app.id)}> DELETE</button>
                        
                        </div>
                    ))}

                </div>
        )}
        </main>

    ); 
}