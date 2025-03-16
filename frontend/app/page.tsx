'use client'

import { useState } from "react"
import { API_URL } from "./const"

export default function Home(){
    const [ username, setUsername ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")

    const handleLogin = async () => {
        const response = await fetch(API_URL + '/login', {
            method: "POST",
            body: JSON.stringify({
                "username": username,
                "password": password,
            })
        })

        if (!response) {
            console.error("LOGIN FAILED")
        }

        // Redirect to other page
    }

    return (
        <div className="flex flex-col items-center m-5">
            {/* Title */}
            <div>
                <h1 className="font-bold text-3xl">Electionem Principiis Nostris A.D. 2025</h1>
            </div>

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
                    className="bg-green-800 text-yellow-100 w-100 p-2 text-lg"
                    onClick={handleLogin}
                    >
                        Entrare
                    </button>
                </div>
            </div>
        </div>
    )
}