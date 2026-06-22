'use client'

import Link from "next/link";
import Image from "next/image";
import { API_URL } from "../const";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function Page(){
    const router = useRouter();
    const [group, setGroup] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>("");

    const handleLogout = async () => {
        try {
            const response = await fetch(API_URL + "/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            if (!response.ok) {
                console.error("LOGOUT FAILED");
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            router.push("/");
        }
    };

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                // FIXED: Removed server-side 'cookieStore' which causes runtime errors on client-side
                const authorizationLevel = await fetch(API_URL + "/clearance", {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                    credentials: "include"
                });

                if (authorizationLevel.ok) {
                    const resp = await authorizationLevel.json();
                    setGroup(resp.group || "");
                    setName(resp.name || "");
                }
            } catch (error) {
                console.error("Authorization fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-500 font-medium">
                Carregando (Loading)...
            </div>
        );
    }

    return (
        <div className="min-h-screen  px-4 py-6 md:p-10 flex flex-col items-center">
            
            {/* Header Section: Unstacks dynamically based on screen size */}
            <div className="w-full max-w-4xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                
                {/* Logo wrapper */}
                <div className="flex-shrink-0  p-2 rounded-lg">
                    <Image 
                        src="/perseviam.png" 
                        width={80} 
                        height={160} 
                        alt="Logo Perseviam" 
                        className="object-contain max-h-[100px] w-auto"
                    />
                </div>

                {/* Typography with optimized responsive sizing */}
                <h1 className="font-bold text-gray-800 text-base md:text-xl leading-relaxed flex-grow">
                    Communitas Persevera-Serviam <br /> 
                    <span className="text-gray-600 text-sm md:text-base font-semibold">Officium Camerarii</span> <br /> 
                    <span className="text-blue-700 text-xs md:text-sm uppercase tracking-wider font-semibold">Commisio Electionis</span>
                </h1>

                <div className="flex font-bold justify-center p-3">
                    Salute, {name}!
                </div>

                {/* Logout Button full-width on tiny screens */}
                <div className="w-full md:w-auto flex justify-center md:justify-end">
                    <button 
                        className="w-full md:w-auto bg-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm" 
                        onClick={handleLogout}
                    >
                        Exitus (Logout)
                    </button>
                </div>
            </div>

            {/* Voting Area */}
            <div className="w-full max-w-4xl mt-6">
                {/* Grid layout swaps seamlessly from 1 column on mobile to 2 columns on tablet/desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

                    { /*
                        <Link href="/vote/praefect" className="group block">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-6 text-white rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:-translate-y-0.5 text-center flex flex-col h-full justify-center">
                                <span className="font-bold text-lg md:text-xl tracking-wide">
                                    Suffragium Praefectum
                                </span>
                                <span className="text-orange-100 text-xs md:text-sm mt-1 block font-medium">
                                    (Suara untuk Praefectum)
                                </span>
                            </div>
                        </Link>
                    */}
                    
                    { (group === "PVRA" || group === "PSVM") && ( 
                        <Link href="/vote/vicarius" className="group block">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 p-6 text-white rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:-translate-y-0.5 text-center flex flex-col h-full justify-center">
                                <span className="font-bold text-lg md:text-xl tracking-wide">
                                    Suffragium Vicarium
                                </span>
                                <span className="text-orange-100 text-xs md:text-sm mt-1 block font-medium">
                                    (Suara untuk Vicarius)
                                </span>
                            </div>
                        </Link>
                    ) }

                    { (group === "SRVM" || group === "PSVM") && ( 
                        <Link href="/vote/vicaria" className="group block">
                            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 p-6 text-white rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:-translate-y-0.5 text-center flex flex-col h-full justify-center">
                                <span className="font-bold text-lg md:text-xl tracking-wide">
                                    Suffragium Vicariam
                                </span>
                                <span className="text-emerald-100 text-xs md:text-sm mt-1 block font-medium">
                                    (Suara untuk Vicaria)
                                </span>
                            </div>
                        </Link>
                    ) }
                    
                </div>
            </div>
        </div>
    );
}