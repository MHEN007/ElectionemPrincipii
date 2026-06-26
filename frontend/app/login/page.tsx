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
        <div className="flex flex-col items-center px-4 py-8">
            {/* Title */}
            <div className="flex flex-col items-center text-center">
                <Image
                src="/perseviam.png"
                width={100}
                height={200}
                alt="Logo Perseviam"
                />

                <h1 className="mt-4 text-2xl md:text-3xl font-bold">
                Electionem Principiis Nostris A.D. {year}
                </h1>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-6 w-full max-w-md rounded bg-red-200 p-3 text-red-800">
                {error}
                </div>
            )}

            {/* Login Form */}
            <form
                className="mt-10 w-full max-w-md space-y-6"
                onSubmit={(e) => {
                e.preventDefault(); // Prevent page refresh
                handleLogin();
                }}
            >
                <div>
                <label htmlFor="username" className="mb-2 block font-bold">
                    Nomen
                </label>

                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Entrare Nomen"
                    className="w-full rounded border bg-white p-3 text-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>

                <div>
                <label htmlFor="password" className="mb-2 block font-bold">
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Entrare Password"
                    className="w-full rounded border bg-white p-3 text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                <button
                type="submit"
                className="w-full rounded bg-[#D4AF37] p-3 text-lg font-semibold text-yellow-900 transition hover:brightness-95"
                >
                Entrare
                </button>
            </form>
        </div>
    )
}