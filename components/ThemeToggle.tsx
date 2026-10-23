"use client"; 
import { useState, useEffect}  from "react"; 

export default function ThemeToggle() {


    const [isDark, setIsDark] = useState(()=> {
        if (typeof window === "undefined") {
            return true;
        }

        return localStorage.getItem("theme") !== "light";
    }); 

    useEffect(()=> {
        const root = document.documentElement; 

        if (isDark) {
           root.classList.remove("light")
           localStorage.setItem("theme", "dark")
        } else {
            root.classList.add("light"); 
            localStorage.setItem("theme", "light") ; 
        }
    }, [isDark]); 

    return (
        <button 
        type="button"
        onClick={()=> setIsDark((prev)=> !prev)}
        className="border rounded-md px-3 py-2 text-sm"
        suppressHydrationWarning
        >
            {isDark ? "Light Mode" : "Dark Mode"}
        </button>
    ); 
}
