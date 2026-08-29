"use client"; 
import { useState, useEffect, useRef } from "react"; 
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
    //const [loading, setLoading] = useState(false) ;
    const [company, setCompany] = useState("");
    const [pay, setPay] =  useState(""); 
    const [status, setStatus] = useState(""); 
    const [position, setPosition] = useState(""); 
    const [location, setLocation] = useState("");
    
    // states for pagination -> switched to scrolling 
    // const [page, setPage] = useState(1); 
    // const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);  
    const [hasMore, setHasMore] = useState(true); 
    const [offset, setOffset] = useState(0); 
    const limit = 10; 

    const [initialLoad, setInitialLoad] = useState(false); 
    const [loadMore, setLoadMore] = useState(false); 
    const [hasFetched, setHasFetched] = useState(false); 
    const [saving, setSaving] = useState(false); 
    //console.log(applications.length);
    
    // for filtering/searching 
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");  

    // for toggling different parts of the page for cleaner UI 
    const [showForm, setShowForm] = useState(false);
    const [showSort, setShowSort] = useState(false);  

    // for searching 
    const [companySearch, setCompanySearch] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("");  

    const loadMoreRef = useRef<HTMLDivElement | null>(null); 
    const fetchingRef = useRef(false); 

    // page refresh helper 
    async function refresh() {
        setApplications([]);
        setOffset(0); 
        setHasMore(true); 
        await fetchApplications(0, true); 
    }

    // helper functions for getting the date right
    function startLocalDay(date: string) {
        const [year, month, day] = date.split("-").map(Number); 

        return new Date(year, month - 1, day, 0,0,0,0);  // new Date(year,month, day, hour, minute, second, milisecond)
    }

    function endLocalDay(date: string) {
        const [year, month, day] = date.split("-").map(Number); 

        return new Date(year, month - 1, day, 23, 59,59, 999); 
    }

    async function fetchApplications(currentOffset : number, isInitial = false) {

        // debugging
        console.log("Fetching offset", currentOffset); 
        if(fetchingRef.current) return; 
        fetchingRef.current = true; 

        //if((initialLoad || loadMore) || !hasMore) return; 
       
        if(initialLoad || loadMore) return; 
        if(!isInitial && !hasMore) return; 

        if(isInitial) {
            setInitialLoad(true); 
        } else {
            setLoadMore(true); 
        }

        // setLoading(true); 
        setError(""); 
        // const id = localStorage.getItem("userId") 

        // if(!id) {
        //     setError("Cannot retrieve data")
        //     setLoading(false); 

        //     return
        // }
        

        try {
            const response = await fetch(`/api/applications?limit=${limit}&offset=${currentOffset}`); 
            const data = await response.json()

            if(!response.ok) {
                setError(data.error || "Failed to load applications"); 
                // setLoading(false); 
                return; 
            } 

            //setApplications(data.applications);
            // setTotalPages (data.totalPages); 
            setTotalCount(data.totalCount); 
            setApplications((prev)=> [...prev, ...data.applications]);
            setOffset(currentOffset + limit);
            
            console.log(currentOffset);  

            if(!data.hasMore) {
                setHasMore(false); 
            }

        } catch {
            setError("Failed to load applications")

        } finally {
            //setLoading(false); 
            
            if(isInitial) {
                setInitialLoad(false); 
            } else {
                setTimeout(()=> {
                    setLoadMore(false); 
                }, 300)
               
            }
            setHasFetched(true); 
            fetchingRef.current = false; 
        }
    }

    async function handleApplication(e: any) {
        e.preventDefault(); 
        setError("");
        setSaving(true)
        // setLoading(true);  

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
            

            await refresh(); 
        } catch {
            setError("Failed to create applications")
        } finally {
            //setLoading(false);
            setTimeout(()=> {
                setSaving(false);  
            }, 400); 
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

            const data = await res.json(); 

        
        if (!res.ok) {
            //throw new Error("Cannot delete data"); 
            setError(data.error || "Canot delete data.")
        }
            
        //await fetchApplications(page); 
        setApplications((prev)=> prev.filter((app)=> app.id !== id)); 
       // setTotalCount((prev)=> prev - 1)
        
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

          await refresh(); 
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

            await refresh(); 
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

                await fetchApplications(0, true); 
            } catch {
                router.push("/login"); 
            }
        }

        checkAuth();
    }, [router])   
   
    useEffect(()=> {

        const observer = new IntersectionObserver(  // watch bottom marker and tell when it comes into view 
            (entries) => { // function runs whenever the watched elements visibility changes 
                const first = entries[0];  // bottom marker div 
          
                if(first.isIntersecting && hasMore && !loadMore) { // check if the watched element is visible on the viewport 
                  fetchApplications(offset, false) // load next chunk starting from the current offset 
                }
            }, 
            { rootMargin: "300px 0px", threshold : 0.1 }  // only trigger when the element is fully visible 
        ); 

        const current = loadMoreRef.current; // grabs the actual DOM the ref is pointing to 

        if(current) {
            observer.observe(current);  // if bottom marker exists, start watching it 
        }

        // cleanup function: stop watching the old element 
        return () => {
            if (current) {
                observer.unobserve(current)
            }
        }; 
    }, [offset, hasMore, loadMore])

    function getStatusColor(status: string | null) {

        if (status === "Offer") { return "text-green-700"; } 
        if (status === "Rejected") { return "text-red-700";}
        if (status === "Interviewed") { return "text-blue-700";}
        if (status === "Applied") { return "text-amber-500";}

        return "text-gray-700/70"
    }

    /*
    declare actual variables for the status cards here 
    */
    const applicationsTotal = applications.length; 
    
    const appliedTotal = 
        applications.filter((app)=> 
            app.status === "Applied").length; 

    const offerTotal = 
        applications.filter((app)=> 
            app.status === "Offer").length; 

    const interviewTotal = 
        applications.filter((app)=> 
            app.status === "Interviewed").length; 

    const rejectedTotal = 
        applications.filter((app)=> 
            app.status === "Rejected").length

    const filteredApplications = applications.filter((app)=> {
        const appDate = new Date(app.created_at); 

        if(statusFilter) {
            if(app.status !== statusFilter) {
                return false; 
            }
        }
       
        if(companySearch) {
            const companyMatches = app.company 
                .toLowerCase()
                .includes(companySearch.toLowerCase()); 

            if(!companyMatches) {
            return false; 
            }
        }

        if(startDate) {
            const start = startLocalDay(startDate);

             if(appDate < start) {
                return false; 
            }
        }

        if(endDate) {
            const end = endLocalDay(endDate); 
            end.setHours(23,59,59,999); 

            if(appDate > end) {
                return false; 
            }
        }

        return true; 
    })

    return (
        
        <main className="min-h-dvh w-full max-w-6xl gap-6 p-4 m-auto flex flex-col"> 

        <header className="flex items-center justify-between py-1">
            <div> 
                <h1 className="text-3xl md:text-3xl font-semibold"> DASHBOARD</h1>
                <p className="text-sm text-gray-500"> Track and manage your job applications </p>
                
            </div>
            <button className="underline md:text-lg hover:text-blue-400" onClick={()=> logOut()}> Log Out  </button>
        </header>

        <section className="top-sections">
            <div className="text-sm grid grid-cols-2 gap-3 md:grid-cols-5">
                <p className="text-xs"> Total Applications: <span className="font-bold"> {totalCount} </span>  </p>
                <p className="text-xs text-right md:text-left"> Applied: <span className="text-amber-500 font-bold"> {appliedTotal} </span> </p>
                <p className="text-xs"> Interviewed: <span className="text-blue-700 font-bold">  {interviewTotal}</span> </p>
                <p className="text-xs text-right md:text-left"> Accepted: <span className="text-green-700 font-bold"> {offerTotal} </span> </p>
                <p className="text-xs"> Denied: <span className="text-red-700 font-bold"> {rejectedTotal} </span> </p>
            </div>
         </section>

        <section className="top-sections" > 
            <button
            type="button"
            onClick={()=> setShowSort((prev)=> !prev)}
            className="w-full flex items-center justify-between"
            >
                <div className="text-left"> 
                    <h2 className="font-semibold"> Filter by date </h2>
                </div> 
                 <span className="text-sm underline"> {showSort ? "Hide": "Filter"} </span>
            </button> 

            {showSort && 
                <div className="flex gap-3 py-2"> 
                    
                        <input
                        placeholder="From (start date)"
                        className="w-full border rounded-md p-1 text-xs "
                        type="date"
                        value={startDate}
                        onChange={(e)=> setStartDate(e.target.value)}
                        
                        ></input>

                        <input
                        placeholder="To (end date)"
                        className="w-full border rounded-md p-1 text-xs "
                        type="date"
                        value={endDate}
                        onChange={(e)=> setEndDate(e.target.value)}
                        >
                        </input>

                        <button type="button" 
                        className="border rounded-md px-3 py-1 text-xs"
                        onClick={()=> {
                            setStartDate("")
                            setEndDate("")
                        }}
                        > 
                        Clear
                        </button>

                        <p className="text-xs text-gray-500"> Showing {filteredApplications.length} of {applications.length} </p>

                    </div>
                }   
                
         </section>
        
                    
            { error && <p> {error}</p>}
            <section className="top-sections">
                <button
                type="button"
                className="w-full flex items-center justify-between"
                onClick={()=> setShowForm((prev)=> !prev)}
                >
                    <div className="text-left">
                        <h2 className="font-semibold"> Add Application</h2>
                        <p className="text-sm text-gray-500 my-1"> Create a new job application entry </p>
                    </div> 
                    <span className="text-sm underline"> {showForm ? "Hide" : "Add+"} </span>
                    
                
                </button>

                {showForm && (
                    <form className="grid grid-cols-1 md:grid-cols-6 gap-3" onSubmit={handleApplication}> 
                
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
                        
        
                        <button className="btn-2" type="submit" disabled={saving}> 
                            {saving ? "Saving..." : "Add Application"}
                        </button>

                        </form>
                )}
              
            </section> 

            {initialLoad || !hasFetched ? 
            (   <p> Loading... </p> ) : 
            applications.length === 0 ? 
            (   <p className="text-red-600/80"> No applications yet. </p>):
        
            (
                <div className="pt-4 flex flex-col text-xs md:text-sm gap-4">   



                <h2 className="font-semibold text-2xl tex-center"> CURRENT APPLICATIONS </h2>
                    <section className="top-sections">
                       
                        <input 
                        value={companySearch}
                        onChange={(e)=> setCompanySearch(e.target.value)}
                        type="text"
                        placeholder="Search Company"
                        className="border rounded-md border-gray-400 p-1 my-1 placeholder:text-xs"
                        />
{/* 
                        <select
                            className="border rounded-md border-gray-400 p-1 text-xs"
                            value={statusFilter}
                            onChange={(e)=> setStatusFilter(e.target.value)}
                        >

                            <option value="">All statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewed">Interviewed</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>

                        </select> */}
                        
                </section>
                    {filteredApplications.map((app)=> (
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
                            <span className="text-gray-500 wrap-break-word"> {new Date(app.created_at).toLocaleString()} </span>
                        </p>

                        <button className="delete-btn" onClick={()=> handleDelete(app.id)}> DELETE</button>
                        
                        
        
                        </div>

                        
                    ))}

                    {loadMore && (
                        <p className="text-center py-3 text-gray-500"> Loading more... </p>
                    )}

                    <div ref={loadMoreRef} className="h-1"> </div>

                    {/* <div className="flex items-center text-center gap-4 py-4"> 
                            <button className="prev-next" type="button" onClick={()=> setPage((prev)=> prev - 1)} disabled={page === 1 || loading }> PREVIOUS </button>
                            <button className="prev-next" type="button" onClick={()=> setPage((prev)=> prev + 1)} disabled={page === totalPages || loading }> NEXT </button>
                    </div>  */}
                  

                </div>


        )}
        </main>

    ); 
}