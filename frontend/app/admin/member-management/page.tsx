'use client'

import { API_URL } from "@/app/const";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

// 1. Defined a TypeScript interface for safety
interface Member {
    id: string;
    name: string;
    voteStatus: boolean;
}

export default function Round() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter()

    const [error, setError] = useState("");

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

    // Fetch members on mount
    useEffect(() => {
        fetchMembers();
    }, []); // <-- FIXED: Added empty dependency array to prevent infinite loop
    
    const handleCsvUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage("");

        // Create FormData to send the file file over HTTP
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_URL}/members/upload`, {
                method: "POST",
                credentials: "include", // Keep this if you use sessions/cookies
                body: formData, // Sending FormData automatically sets 'Content-Type' to 'multipart/form-data'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload CSV");
            }

            setMessage("CSV uploaded and members processed successfully!");
            // Optional: Trigger a state refresh here to reload your members list
        } catch (error: any) {
            setMessage(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
            // Clear the input so the same file can be uploaded again if needed
            e.target.value = "";

            fetchMembers();
        }
    };

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

    const handleDelete = async (id: string) => {
        const resp = await fetch(API_URL + "/member/" + id, {
            method: "DELETE",
            credentials: "include"
        })

        if (resp.ok) {
            setMembers(members.filter((member) => member.id !== id))
        } else {
            const err = await resp.json()
            
            setError(err.message)
        }
    }

    if (loading) return <div className="p-4">Loading voters...</div>;

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-row space-x-10">
                <h1 className="text-2xl font-bold">Voter Management</h1>
                <button className="bg-gray-500 p-3 w-50 text-white" onClick={() => router.push("/admin")}>BACK</button>
            </div>

            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                Upload Members via CSV
            </label>

            <div className="flex items-center gap-2">
                <input 
                    type="file" 
                    accept=".csv" // Restricts file picker to CSVs
                    onChange={handleCsvUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50"
                    />
            </div>
            {uploading && <p className="text-sm text-blue-500">Processing file...</p>}
            {message && <p className="text-sm font-medium text-gray-800">{message}</p>}
            </div>
            
            { error !== "" && (
                <div className="flex flex-col bg-red-200 text-red-600">
                    {error}
                </div>
            )}

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
                                <td className="p-2 border space-x-2">
                                    <button 
                                        onClick={() => updateStatus(member.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        Toggle Status {/* FIXED: Button now has text */}
                                    </button>

                                    <button 
                                        onClick={() => handleDelete(member.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        Delete Member {/* FIXED: Button now has text */}
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