'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import Image from "next/image";
import NotFound from "@/app/not-found";
import { API_URL } from "@/app/const";
import { redirect } from "next/navigation";

export default function Page(){
    const { group } = useParams() as { group: string };

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
                    voted_id: nominee
                })
            })

            if (!voteResponse.ok) {
                const errorMessage = (await voteResponse.json()).message
                throw new Error(errorMessage)
            }

            return redirect("/vote")
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

    return(
        <div className="flex flex-col items-center m-0 p-10">
            <div>
                <Image src="/perseviam.png" width={100} height={200} alt="Logo Perseviam"/>
            </div>
            <h1 className="font-bold text-lg">Eligo in {(group === "vicarius") ? "Perseverantem" : "Serviet"} {(group === "vicarius") ? "Vicarius" : "Vicaria"}</h1>

            {error !== "" && (
            <div className="flex flex-col bg-red-300 p-2">
                {error}
            </div>
            )}

            <select className="p-2 m-5 w-100 bg-white rounded-sm" onChange={(e) => setNominee(e.target.value)} value={nominee}>
                <option value="" disabled defaultValue={""}>~Elige Nomen~</option>
                { candidates.map((candidate) => {
                    return (<option value={candidate.id}>{candidate.name}</option>)
                }) }
            </select>
            <div className="flex flex-row w-100 text-center justify-center overflow-auto">
                <label htmlFor="check">
                    <input type="checkbox" id="check" onChange={() => setChecked(!checked)}></input>
                    Testor Dominum Deum Omnipotentem, me eum eligere, quem iudico eligi debere
                </label>

            </div>
            <button className="bg-green-800 p-2 w-50 text-white rounded-sm" onClick={() => handleVote()}>
                {group === "vicarius" ? "Ad Maiorem Dei Gloriam" : "Soli Deo Gloria"}
            </button>
            <button className="bg-gray-500 p-2 w-50 mt-5 text-white rounded-sm" onClick={() => {redirect("/vote")}}>
                Back
            </button>
        </div>
    )
}