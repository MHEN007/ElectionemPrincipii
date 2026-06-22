'use client'
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    const menuItems = [
        {
            title: "User Management",
            description: "Manage system permissions, voter profiles, and authentication credentials.",
            path: "/admin/round",
            // Indigo gradient
            bgClass: "from-indigo-500 to-blue-600 focus:ring-indigo-500",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            title: "Live Report",
            description: "View aggregate analytics, total vote metrics, and leaderboards.",
            path: "/admin/report",
            // Orange gradient
            bgClass: "from-amber-500 to-orange-600 focus:ring-orange-500",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
            )
        },
        {
            title: "Voting Status",
            description: "Monitor real-time status checkmarks showing who has or hasn't voted yet.",
            path: "/admin/status",
            // Emerald gradient
            bgClass: "from-emerald-500 to-teal-600 focus:ring-emerald-500",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-5xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-full">
                        Secure System Console
                    </span>
                    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Administrative Dashboard
                    </h1>
                    <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        Select a gateway module below to update node privileges, access active poll ledgers, or review current voter checklists.
                    </p>
                </div>

                {/* Grid Navigation Menu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => router.push(item.path)}
                            className="group relative flex flex-col text-left bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            {/* Decorative Background Flash on Hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.02] dark:group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none" />

                            {/* Icon Container with Gradient Match */}
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.bgClass} shadow-md shadow-gray-200 dark:shadow-none mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>

                            {/* Text Content */}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                {item.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
                                {item.description}
                            </p>

                            {/* Forward Arrow Indicator */}
                            <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                Open Module 
                                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}