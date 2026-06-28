'use client'

import { useState } from "react"
import { API_URL } from "../const"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login(){
    const [ username, setUsername ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [visibility, setVisibility] = useState<boolean>(false)

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

                <div className="relative">
                    <label htmlFor="password" className="mb-2 block font-bold">
                        Password
                    </label>
                    <input
                        id="password"
                        type={!visibility ? "password" : "text"}
                        autoComplete="current-password"
                        placeholder="Entrare Password"
                        className="w-full rounded border bg-white p-3 pr-12 text-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setVisibility(!visibility)}
                        className="absolute right-3 top-[48px] text-gray-500 hover:text-gray-800"
                        aria-label={visibility ? "Hide password" : "Show password"}
                    >
                        {visibility ? (
                            // Eye-off icon (password visible → click to hide)
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            // Eye icon (password hidden → click to show)
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
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