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

//IMPORTS DO FIREBASE
import { auth } from "@/services/firebaseConnection";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useState } from "react";

//IMPORTS DE CONTEXT
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function Header(){
    const { user, signed } = useContext(AuthContext);

    async function handleLoginGoogle(){
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
        .then((result)=> {
            console.log("USÁRIO LOGADO COM SUCESSO")
        })
        .catch((error)=>{
            console.log(error);
        })
    }

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
                {!signed ? (
                    <button onClick={handleLoginGoogle} > <PiSignInDuotone size={34} /> </button>
                ) : (
                    <div className="flex items-center gap-2">
                    <Link href="/dashboard" >
                     {user?.photoURL && ( <img src={user.photoURL} alt="Foto do usuário" className="w-11 h-11 rounded-full" /> )}
                    </Link>
                    <button onClick={()=> signOut()}> <FaSignOutAlt size={30}/> </button>
                    </div>
                ) }

                </div>
            </div>{/* FIM DO REDIMENSIONAR */}
        </header>
    )
}