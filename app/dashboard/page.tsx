"use client"; 
import { useState, useEffect } from "react"; 

export default function Dashboard() {


    const [error, setError] = useState(""); 
    const [applications, setApplications] = useState([]) 
    const [loading, setLoading] = useState(false) ; 

    useEffect(() => {

        async function fetchApplications() {
            setLoading(true); 
            setError(""); 
            const id = localStorage.getItem("userId") 

            if(!id) {
              setError("Cannot retrieve data")
              setLoading(false); 

              return
            }

            const response = await fetch(`/api/applications/?userId=${id}`); 
            const data = await response.json()

            if(!response.ok) {
                setError(data.error || "Failed to load applications"); 
                setLoading(false); 
                return; 
            } 

            setApplications(data); 
            setLoading(false); 
        }
        fetchApplications(); 
    }, []); 

    if (loading) {
        return <p> Loading... </p>
    }

    if (error) {
        return <p> { error } </p>
    }

    return (
        <main> 
            <h1> DASHBOARD</h1>
            {applications.length === 0 ? (
                <p> No applications yet. </p>
            ): (
                <p> Applications loaded.</p>
            )
            }
        </main>


    ); 
}