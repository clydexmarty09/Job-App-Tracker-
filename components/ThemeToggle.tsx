"use client"; 
import { useState, useEffect}  from "react"; 

export default function ThemeToggle() {


    const [isDark, setIsDark] = useState(true); 

    useEffect(()=> {
        const savedTheme = localStorage.getItem("theme"); 

        if (savedTheme === "light") {
            setIsDark(false); 
        }

        if (savedTheme === "dark") {
            setIsDark(true) ; 
        }
    },[])

    useEffect(()=> {
        const root = document.documentElement; 

        if (isDark) {
            root.classList.add("dark"); 
            localStorage.setItem("theme", "dark"); 
        } else {
            root.classList.remove("dark"); 
            localStorage.setItem("theme", "light") ; 
        }
    }, [isDark]); 

    return (
        <button 
        type="button"
        onClick={()=> setIsDark((prev)=> !prev)}
        className="fixed top-4 right-4 z-50 border rounded-md mx-3 py-2 text-sm"
        >
            {isDark ? "Light Mode" : "Dark Mode"}
        </button>
    ); 
}