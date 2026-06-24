'use client'

import { API_URL } from "@/app/const";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [newToken, setNewToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRound = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const newTokenReq = await fetch(`${API_URL}/vote/token`, {
                method: "POST",
                credentials: "include"
            });

            if (!newTokenReq.ok) {
                throw new Error(`Server responded with status: ${newTokenReq.status}`);
            }

            const newTokenResp = await newTokenReq.json();
            setNewToken(newTokenResp.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-xl mx-auto">
            {/* Back Button */}
            <div>
                <button 
                    onClick={() => router.push("/admin")}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm cursor-pointer"
                >
                    ← Back to Admin
                </button>
            </div>

            {/* Action Card */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Round Management</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate a secure cryptographic token to initialize a new voting round.</p>
                
                <button 
                    className="w-full sm:w-auto self-start bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm" 
                    onClick={handleRound}
                    disabled={isLoading}
                >
                    {isLoading ? "Generating Round..." : "Create New Round"}
                </button>
            </div>

            {/* Error Feedback */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Success Token Display */}
            {newToken && (
                <div className="flex flex-col gap-2 p-4 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                    <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                        ✨ Token Generated Successfully!
                    </span>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 rounded font-mono text-sm break-all my-1 select-all">
                        {newToken}
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Please save this token somewhere secure immediately. You won't be able to see it again.
                    </p>
                </div>
            )}
        </div>
    );
}