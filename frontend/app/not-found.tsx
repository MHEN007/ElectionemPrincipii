import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center m-5">
            <h1 className="text-xl">Halaman yang dicari tidak ditemukan</h1>

            <Link href="/">
                <button className="bg-green-600 text-white w-30 h-10">
                    Go to Home
                </button>
            </Link>
        </div>
    )
}