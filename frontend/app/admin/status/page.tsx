'use client'

import { API_URL } from "@/app/const"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Simple loading spinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
)

export default function Status() {
    const [vicariusVotingStatus, setVicariusVotingStatus] = useState([])
    const [vicariaVotingStatus, setVicariaVotingStatus] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter();

    useEffect(() => {
        const fetchVotingStatus = async () => {
            try {
                setIsLoading(true)
                const req = await fetch(`${API_URL}/vote/status`, {
                    method: "GET",
                    credentials: "include"
                })

                if (!req.ok) {
                    const errorData = await req.json()
                    throw new Error(errorData.message || "Failed to fetch data")
                }

                const respBody = await req.json()

                setVicariusVotingStatus(respBody?.vicariusVoteStatus || [])
                setVicariaVotingStatus(respBody?.vicariaVoteStatus || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchVotingStatus()
    }, [])

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Voting Live Status
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Real-time overview of current voting progress.
                    </p>

                    <button 
                    onClick={() => router.push("/admin")}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm cursor-pointer"
                >
                    ← Back to Admin
                </button>
                </div>


                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                        <p className="font-medium">Error loading status</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    /* Two Column Layout */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Vicarius Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vicarius Voting Status</h2>
                                <p>Quorum: {Math.floor(vicariaVotingStatus.length * 2/3)}</p>
                            </div>
                            <div className="overflow-x-auto">
                                <StatusTable data={vicariusVotingStatus} />
                            </div>
                        </div>

                        {/* Vicaria Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vicaria Voting Status</h2>
                                <p>Quorum: {Math.floor(vicariaVotingStatus.length * 2/3)}</p>
                            </div>
                            <div className="overflow-x-auto">
                                <StatusTable data={vicariaVotingStatus} />
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

// Sub-component for tables to prevent repetitive code
function StatusTable({ data }: { data: any[] }) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No records found.
            </div>
        )
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/70 dark:bg-gray-800/70">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3 text-right">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.map((v, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {v?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide shadow-sm ${
                                v?.status 
                                    ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" 
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            }`}>
                                <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${v?.status ? "bg-green-500" : "bg-rose-500"}`}></span>
                                {v?.status ? "Voted" : "Not Voted"}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}