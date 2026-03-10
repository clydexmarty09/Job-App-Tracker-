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
                        </div>
                    ))}
                </div>
        )}
        </main>

    ); 
}