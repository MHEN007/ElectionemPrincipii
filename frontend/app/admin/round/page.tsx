'use client'

import { API_URL } from "@/app/const";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// 1. Defined a TypeScript interface for safety
interface Member {
    id: string;
    name: string;
    voteStatus: boolean;
}

export default function Round() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter()

    // Fetch members on mount
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const membersReq = await fetch(`${API_URL}/members`, {
                    method: "GET",
                    credentials: "include"
                });
                
                const response = await membersReq.json();
                if (!membersReq.ok) {
                    throw new Error(response.message || "Failed to fetch members");
                }

                setMembers(response || []);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
   }, []); // <-- FIXED: Added empty dependency array to prevent infinite loop

    // Update status handler
    const updateStatus = async (memberId: string) => {
        try {
            const updateReq = await fetch(`${API_URL}/member`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json", // <-- FIXED: Added content-type header
                },
                body: JSON.stringify({
                    member_id: memberId
                })
            });

            if (updateReq.ok) {
                // Optimistically or reactively update local state so UI updates instantly
                setMembers(prevMembers => 
                    prevMembers.map(m => 
                        m.id === memberId ? { ...m, voteStatus: !m.voteStatus } : m
                    )
                );
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div className="p-4">Loading voters...</div>;

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-row space-x-10">
                <h1 className="text-2xl font-bold">Voter Management</h1>
                <button className="bg-gray-500 p-3 w-50 text-white" onClick={() => router.push("/admin")}>BACK</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse border border-gray-200">
                    <thead>
                       <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">No.</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Voting Ability</th>
                            <th className="p-2 border">Action</th>
                        </tr> 
                    </thead>

                    <tbody>
                        {}
                        {members.map((member, idx) => (
                            <tr key={member.id || idx} className="hover:bg-gray-50">
                                <td className="p-2 border">{idx + 1}</td>
                                <td className="p-2 border">{member.name}</td>
                                <td className="p-2 border">
                                    <span className={`px-2 py-1 rounded text-sm ${!member.voteStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {!member.voteStatus ? "Able to vote" : "Not able to vote"}
                                    </span>
                                </td>
                                <td className="p-2 border">
                                    <button 
                                        onClick={() => updateStatus(member.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        Toggle Status {/* FIXED: Button now has text */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}