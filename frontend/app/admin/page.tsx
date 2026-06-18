export default function AdminDashboard() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex bg-red-300 text-white">
                    User Management
                </div>

                <div className="flex bg-red-300 text-white">
                    Report
                </div>

                <div className="flex bg-red-300 text-white">
                    Voting Status
                </div>
            </div>
        </div>
    )
}