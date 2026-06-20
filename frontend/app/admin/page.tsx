'use client'
import { redirect } from "next/navigation";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col m-30">

            <h1 className="flex text-2xl justify-center m-5">Admin Menu's</h1>
            <div className="flex flex-row space-x-20 justify-center">
                <div className="flex bg-blue-800 w-40 h-10 text-white" onClick={() =>{ redirect("/")}}>
                    User Management
                </div>

                <div className="flex bg-orange-600 w-40 h-10 text-white" onClick={() =>{ redirect("/admin/report")}}>
                    Report
                </div>

                <div className="flex bg-green-800 w-40 h-10 text-white" onClick={() =>{ redirect("/admin/report")}}>
                    Voting Status
                </div>
            </div>
        </div>
    )
}