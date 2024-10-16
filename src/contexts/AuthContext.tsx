import { ReactNode, createContext, useState, useEffect } from "react";
import { auth } from "@/services/firebaseConnection";
import { onAuthStateChanged, User } from "firebase/auth";


interface AuthProviderProps {
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    user: User | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(()=>{
        const unsub =  onAuthStateChanged(auth, (user)=>{
            if(user){
                setUser(user)

                setLoadingAuth(false)

            } else {
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return()=>{
            unsub();
        }
        
    },[])



    return(
        <AuthContext.Provider value={{
            signed: !!user,
            loadingAuth,
            user
            }}
            >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;