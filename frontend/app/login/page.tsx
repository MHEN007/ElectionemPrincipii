'use client'

import { useState } from "react"
import { API_URL } from "../const"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login(){
    const [ username, setUsername ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const [error, setError] = useState<string>("")

    const year = new Date().getFullYear();

    const router = useRouter()

    const handleLogin = async () => {
        try {

            const response = await fetch(API_URL + '/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
    
            if (!response.ok) {
                const errorMsg = await response.json()
    
                throw new Error(errorMsg.message)
            }
    
            // Redirect to other page
            router.push("/vote")
        } catch (error) {
            if (error instanceof Error)
                setError(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center m-5">
            {/* Title */}
            <div className="flex flex-col items-center">
                <Image src="/perseviam.png" width={100} height={200} alt="Logo Perseviam"/>
                <h1 className="font-bold text-3xl">Electionem Principiis Nostris A.D. {year}</h1>
            </div>

            {/* Error */}
            {error !== "" && (
            <div className="flex flex-col bg-red-300">
                {error}
            </div>
            )}

            {/* Login Form */}
            <div className="flex flex-col mt-20">
                <div className="flex flex-row justify-between m-5">
                    <label className="p-2 font-bold">Nomen</label>
                    <input 
                    className="bg-white mx-10 text-lg border rounded-sm p-2" 
                    type="text" 
                    id="username" 
                    placeholder="Entrare Nomen"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    />
                </div>

                <div className="flex flex-row justify-between m-5">
                    <label className="p-2 font-bold">Password</label>
                    <input 
                    className="bg-white mx-10 text-lg border rounded-sm p-2" 
                    type="password" id="password" 
                    placeholder="Entrare Password"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    />
                </div>

                <div className="flex items-center flex-row justify-center">
                    <button 
                    className="bg-[#D4AF37] text-yellow-900 w-100 p-2 text-lg"
                    onClick={handleLogin}
                    >
                        Entrare
                    </button>
                </div>
            </div>
        </div>
    )
}