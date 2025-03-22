import Link from "next/link";

export default function Page(){

    return (
        <div className="p-15">
            <div className="flex flex-row items-center m-5">
                <div>
                    Logo
                </div>
                <h1 className="font-bold text-xl">
                    Communitas Persevera-Serviam <br /> 
                    Officium Camerarii <br /> 
                    Commisio Electionis
                </h1>

                <div className="flex flex-grow justify-end">
                    Exitus (Logout)
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row justify-start m-5 text-center">
                    <Link href="/vote/prefect">
                        <div className="bg-blue-800 p-5 text-white p-2 m-5 rounded-sm">
                            Suffragium Præfectum<br />
                            (Suara untuk Præfect)
                        </div>
                    </Link>

                    <Link href="/vote/vicarius">
                        <div className="bg-orange-600 p-5 text-white p-2 m-5 rounded-sm">
                            Suffragium Vicarium<br />
                            (Suara untuk Vicarius)
                        </div>
                    </Link>

                    <Link href="/vote/vicaria">
                        <div className="bg-green-700 p-5 text-white p-2 m-5 rounded-sm">
                            Suffragium Vicariam<br />
                            (Suara untuk Vicaria)
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}