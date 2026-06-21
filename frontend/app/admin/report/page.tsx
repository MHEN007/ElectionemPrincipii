'use client'

import { API_URL } from "@/app/const";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type VoteReport = {
    name: string;
    votes: number;
}

export default function Report() {
    const router = useRouter();
    const [vicariusReport, setVicariusReport] = useState<VoteReport[]>([]);
    const [vicariaReport, setVicariaReport] = useState<VoteReport[]>([]);
    const [totalVote, setTotalVote] = useState<number | string>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        try {
            const reportReq = await fetch(`${API_URL}/voteReport`, {
                method: "GET",
                credentials: "include"
            });

            if (!reportReq.ok) {
                const errorData = await reportReq.json();
                throw new Error(errorData.message || "Failed to fetch report data");
            }

            const result = await reportReq.json();

            setVicariusReport(result.vicariusVotes || []);
            setVicariaReport(result.vicariaVotes || []);
            setTotalVote(result.total || 0);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();

        // Auto refresh every 60 seconds
        const intervalId = setInterval(() => {
            fetchReport();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto">
                
                {/* Top Action Bar */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.push("/admin")}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm cursor-pointer"
                    >
                        ← Back to Admin
                    </button>
                    <span className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-3 py-1.5 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Auto-updates every minute
                    </span>
                </div>

                {/* Header Title */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Voting Summary Report
                    </h1>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded shadow-sm">
                        <p className="font-semibold">Failed to update</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        
                        {/* Overall Metrics Banner */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
                            <div>
                                <p className="text-sm uppercase tracking-wider font-semibold opacity-80">Accumulated Results</p>
                                <p className="text-xs opacity-60 mt-0.5">Combining all system brackets</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Total Votes Cast</p>
                                <p className="text-4xl font-black tracking-tight">{totalVote}</p>
                            </div>
                        </div>

                        {/* Dual Column Data Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Vicarius Leaderboard */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <h2 className="font-bold text-gray-900 dark:text-white">Vicarius Votes</h2>
                                </div>
                                <ReportTable list={vicariusReport} />
                            </div>

                            {/* Vicaria Leaderboard */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <h2 className="font-bold text-gray-900 dark:text-white">Vicaria Votes</h2>
                                </div>
                                <ReportTable list={vicariaReport} />
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Reusable elegant sub-table
function ReportTable({ list }: { list: VoteReport[] }) {
    if (list.length === 0) {
        return <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">No data available</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50/30 dark:bg-gray-800/30">
                        <th className="px-6 py-3 w-16 text-center">Rank</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3 text-right">Votes</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {list.map((rep, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-3.5 text-center text-sm font-bold text-gray-400 dark:text-gray-500">
                                #{idx + 1}
                            </td>
                            <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">
                                {rep.name}
                            </td>
                            <td className="px-6 py-3.5 text-sm font-mono font-bold text-right text-indigo-600 dark:text-indigo-400">
                                {rep.votes.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}