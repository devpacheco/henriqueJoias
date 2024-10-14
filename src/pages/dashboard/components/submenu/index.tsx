import Link from "next/link"
import { FaHome } from "react-icons/fa"

export function Submenu(){
    return(
        <main className="my-5 bg-slate-200 px-3 py-2 rounded-lg flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-500">
            <nav className="flex items-center gap-4 font-medium">
                <Link href="/dashboard"> Dashboard </Link>
                <Link href="/dashboard/new"> Cadastrar Produto </Link>
            </nav>
            <div className="cursor-pointer">
                <Link href="/">
                    <FaHome size={22} />
                </Link>
            </div>
        </main>
    )
}