'use client'
import { useParams } from "next/navigation"
import { useState } from "react";

export default function Page(){
    const { group } = useParams() as { group: string };

    const [nominee, setNominee] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);

    const handleVote = async () => {
        if (!checked || nominee === "") {
            alert("Please check the box to vote");
            return;
        }

        console.log(nominee);
    }

    return(
        <div className="flex flex-col items-center m-0 p-10">
            <div>
                Logo
            </div>
            <h1 className="font-bold text-lg">Eligo in {(group === "prefect" || group === "vicarius") ? "Perseverantem" : "Serviet"} {(group === "prefect") ? "Præefect" : (group === "vicarius") ? "Vicarius" : "Vicaria"}</h1>
            <select className="p-2 m-5 w-100 bg-white rounded-sm" onChange={(e) => setNominee(e.target.value)} value={nominee}>
                <option value="" disabled selected>~Elige Nomen~</option>
                <option value="1">Calon 1</option>
                <option value="2">Calon 2</option>
                <option value="3">Calon 3</option>
            </select>
            <div className="flex flex-row w-100 text-center justify-center overflow-auto">
                <label htmlFor="check">
                    <input type="checkbox" id="check" onChange={() => setChecked(!checked)}></input>
                    Testor Dominum Deum Omnipotentem, me eum eligere, quem iudico eligi debere
                </label>

            </div>
            <button className="bg-gray-500 p-2 w-50 text-white rounded-sm" onClick={() => handleVote()}>
                {(group === "prefect" || group === "vicarius") ? "Ad Maiorem Dei Gloriam" : "Soli Deo Gloria"}
            </button>
        </div>
    )
}