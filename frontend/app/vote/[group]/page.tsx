'use client'
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Image from "next/image";
import NotFound from "@/app/not-found";
import { API_URL } from "@/app/const";

export default function Page(){
    const { group } = useParams() as { group: string };
    const router = useRouter();
    const allowedGroup = ["vicarius", "vicaria"];

    if (!allowedGroup.includes(group) ){
        return NotFound();
    }

    type Candidates = {
        id: string,
        name: string
    }

    const [nominee, setNominee] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);
    const [candidates, setCandidates] = useState<Candidates[]>([]);
    const [error, setError] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const handleVote = async () => {
        try {
            if (!checked || nominee === "") {
                alert("Please check the box to vote and select a nominee");
                return;
            }

            const voteResponse = await fetch(API_URL + "/vote", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    voted_id: nominee,
                    token
                })
            })

            if (!voteResponse.ok) {
                const errorMessage = (await voteResponse.json()).message
                throw new Error(errorMessage)
            }

            router.push("/vote")
        } catch (error) {
            if (error instanceof Error)
                setError(error.message)
        }
    }

    const getCandidates = async () => {
        try {
            const candidatesRequest = await fetch(API_URL+ "/candidates/" + group, {
                method: "GET",
                credentials: "include"
            })
    
            if (!candidatesRequest.ok) {
                const errorMessage = (await candidatesRequest.json()).message
                throw new Error(errorMessage)
            }
    
            const { candidates } = await candidatesRequest.json()
            setCandidates(candidates)
        } catch (error) {
            if (error instanceof Error){
                setError(error.message)
            }
        }
    }

    useEffect(() => {
        getCandidates()
    }, [group])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10">
            {/* Main Form Container wrapper for crisp visual balance */}
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col items-center">
                
                {/* Logo Section */}
                <div className="mb-6 transform hover:scale-105 transition-transform duration-200">
                    <Image src="/perseviam.png" width={90} height={180} alt="Logo Perseviam" priority />
                </div>

                {/* Main Heading Text */}
                <h1 className="font-extrabold text-xl sm:text-2xl text-center text-gray-900 dark:text-white tracking-tight mb-8">
                    Eligo in {(group === "vicarius") ? "Perseverantem" : "Serviet"} {(group === "vicarius") ? "Vicarius" : "Vicaria"}
                </h1>

                {/* Error Banner Container */}
                {error !== "" && (
                    <div className="w-full bg-red-300 text-red-900 text-sm font-semibold rounded-lg p-4 mb-6 border border-red-400/30 shadow-sm animate-shake">
                        {error}
                    </div>
                )}

                {/* Selection Dropdown */}
                <div className="w-full mb-6">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Select Nominee</label>
                    <select 
                        className="w-full p-3.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-base font-medium transition" 
                        onChange={(e) => setNominee(e.target.value)} 
                        value={nominee}
                    >
                        <option value="" disabled>~Elige Nomen~</option>
                        {candidates.map((candidate, idx) => (
                            <option key={idx+1} value={candidate.id}>{candidate.name}</option>
                        ))}
                    </select>
                </div>

                {/* Token Input Field */}
                <div className="w-full mb-8">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Security Token</label>
                    <input 
                        type="text" 
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-base placeholder-gray-400 dark:placeholder-gray-500 transition" 
                        placeholder="Insertum Token" 
                        onChange={(e) => setToken(e.target.value)}
                    />
                </div>

                {/* Verification Statement Checklist Bar */}
                <div className="w-full bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 transition">
                    <label htmlFor="check" className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium select-none cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="check" 
                            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                            onChange={() => setChecked(!checked)}
                            checked={checked}
                        />
                        <span>Testor Dominum Deum Omnipotentem, me eum eligere, quem iudico eligi debere</span>
                    </label>
                </div>

                {/* Form Submissions Action Drawer */}
                <div className="w-full flex flex-col gap-3.5">
                    <button 
                        className="bg-green-800 hover:bg-green-700 active:scale-[0.99] w-full p-4 text-white rounded-xl font-bold tracking-wide shadow-md shadow-green-950/20 transition-all cursor-pointer text-center" 
                        onClick={handleVote}
                    >
                        {group === "vicarius" ? "Ad Maiorem Dei Gloriam" : "Soli Deo Gloria"}
                    </button>
                    
                    <button 
                        className="bg-gray-500 hover:bg-gray-600 active:scale-[0.99] w-full p-3.5 text-white rounded-xl font-semibold tracking-wide shadow-sm transition-all cursor-pointer text-center" 
                        onClick={() => router.push("/vote")}
                    >
                        Back
                    </button>
                </div>

            </div>
        </div>
    )
}