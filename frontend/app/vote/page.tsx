'use client'
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "../const";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function Page(){
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch (API_URL + "/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (!response) {
            console.error("LOGOUT FAILED")
        }

        // Redirect to other page
        router.push("/")
    }

    const [group, setGroup] = useState("");

    useEffect(() => {
        const fetchInfo = async () => {
            // Validate user authorization
            const authorizationLevel = await fetch(API_URL + "/clearance", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Cookie": cookieStore.toString() 
                },
                credentials: "include"
            })

            const resp = await authorizationLevel.json()

            setGroup(resp.group)
        }

        fetchInfo()
    })

    return (
        <div className="p-15">
            <div className="flex flex-row items-center m-5">
                <div className="flex flex-col items-center">
                    <Image src="/perseviam.png" width={100} height={200} alt="Logo Perseviam" />
                </div>

                <h1 className="font-bold text-xl">
                    Communitas Persevera-Serviam <br /> 
                    Officium Camerarii <br /> 
                    Commisio Electionis
                </h1>

                <div className="flex flex-grow justify-end">

                    <button className="bg-gray-400 text-white p-3" onClick={handleLogout}>
                        Exitus (Logout)
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row justify-start m-5 text-center">
                    {/* <Link href="/vote/prefect">
                        <div className="bg-blue-800 p-5 text-white p-2 m-5 rounded-sm">
                            Suffragium Præfectum<br />
                            (Suara untuk Præfect)
                        </div>
                    </Link> */}

                    { (group == "PVRA" || group == "PSVM" ) && ( 

                    <Link href="/vote/vicarius">
                        <div className="bg-orange-600 p-5 text-white p-2 m-5 rounded-sm">
                            Suffragium Vicarium<br />
                            (Suara untuk Vicarius)
                        </div>
                    </Link>

                     ) }

                     { (group == "SRVM" || group == "PSVM" ) && ( 

                    <Link href="/vote/vicaria">
                        <div className="bg-green-700 p-5 text-white p-2 m-5 rounded-sm">
                            Suffragium Vicariam<br />
                            (Suara untuk Vicaria)
                        </div>
                    </Link>

                    ) }
                </div>
            </div>
        </div>
    )
}