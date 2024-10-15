//IMPORTS DE COMPONENTS
import { useSession, signIn, signOut } from "next-auth/react";


//IMPORTS DE FUNCIONALIDADES
import Link from "next/link"

//IMPORT DE IMAGES
import Image from "next/image"
import LogoImg from "../../../public/assets/logo.png"

//IMPORTS DE ICONS
import { PiSignInDuotone } from "react-icons/pi";
import { FaSignOutAlt } from "react-icons/fa";


export function Header(){
    const { data: session, status } = useSession();

    return(
        <header className="w-full bg-slate-100 h-16 flex items-center shadow-md">
            <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between px-1">
                <div>
                    <Link href="/">
                        <Image
                            src={LogoImg}
                            alt="Logo da Aplicação"
                            className="w-48"
                        />
                    </Link>
                </div>{/* FIM DA LOGO */}
                <div>
                {!session ? (
                    <button onClick={()=> signIn()} > <PiSignInDuotone size={34} /> </button>
                ) : (
                    <div className="flex items-center gap-2">
                    <Link href="/dashboard" >
                     {session.user?.image && <img className="w-10 h-10 rounded-full" src={session.user.image} />}
                    </Link>
                    <button onClick={()=> signOut()}> <FaSignOutAlt size={30}/> </button>
                    </div>
                ) }

                </div>
            </div>{/* FIM DO REDIMENSIONAR */}
        </header>
    )
}

