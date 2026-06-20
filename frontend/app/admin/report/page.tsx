'use client'

import { API_URL } from "@/app/const";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Report(){

    type VoteReport = {
        name: string,
        votes: number
    }
    const [vicariusReport, setVicariusReport] = useState<VoteReport[]>([]);
    const [vicariaReport, setVicariaReport] = useState<VoteReport[]>([]);
    const [totalVote, setTotalVote] = useState([]);

    const fetchReport = async () => {

        const reportReq = await fetch(API_URL + "/voteReport", {
            method: "GET",
            credentials: "include"
        })

        if (!reportReq.ok) {
            const error = await reportReq.json()

            throw new Error(error.message)
        }

        const result = await reportReq.json();

        setVicariusReport(result.vicariusVotes || [])
        setVicariaReport(result.vicariaVotes || [])
        setTotalVote(result.total || [])
    }

    useEffect(() => {
        fetchReport()

        const intervalId = setInterval(() => {
            fetchReport();
        }, 60000);

        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className="flex flex-col m-10 space-y-10">
            <h1 className="flex justify-center text-2xl">Voting Report</h1>

            <button className="flex justify-center w-100 bg-gray-400" onClick={() => {redirect("/admin")}}>
                BACK
            </button>

            <div className="flex justify-center w-full bg-white">
                <table className="table-auto border-collapse border w-full max-w-2xl border-gray-400 ">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 p-2">No</th>
                            <th className="border border-gray-400 p-2">Name</th>
                            <th className="border border-gray-400 p-2">Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th colSpan={3}>Vicarius Votes</th>
                        </tr>
                        { vicariusReport.map((rep, idx) => {
                            return (
                                <tr key={idx}>
                                    <td className="text-center border border-gray-400 p-2">{idx+1}</td>
                                    <td className="border border-gray-400 p-2">{rep.name}</td>
                                    <td className="border border-gray-400 p-2">{rep.votes}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <th colSpan={3}>Vicaria Votes</th>
                        </tr>
                        { vicariaReport.map((rep, idx) => {
                            return (
                                <tr key={idx + vicariusReport.length-1}>
                                    <td className="text-center border border-gray-400 p-2">{idx+1+vicariusReport.length-1}</td>
                                    <td className="border border-gray-400 p-2">{rep.name}</td>
                                    <td className="border border-gray-400 p-2">{rep.votes}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td className="text-right border border-gray-400 p-2" colSpan={2}>TOTAL</td>
                            <td className="border border-gray-400 p-2">{totalVote}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}