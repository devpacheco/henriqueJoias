//IMPORTS DE COMPONENTS
import { Header } from "@/Components/header";
import Link from "next/link";
import toast from "react-hot-toast";
import { CupomProps } from "@/utils/cupom.type";

//IMPORTS DE FUNCIONALIDADES
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

//IMPORTS DE ICONS
import { CiBarcode } from "react-icons/ci";
import { BiBarcode } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

//IMPORTS DO BANCO DE DADOS
import { db } from "@/services/firebaseConnection";
import { 
    addDoc, 
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    deleteDoc, 
} from "firebase/firestore";

export default function Cupom(){
    const { signed, user } = useContext(AuthContext);
    const router = useRouter();
    const [input, setInput] = useState("");
    const [cupom, setCupom] = useState<CupomProps[]>([])

        //INÍCIO DA UseEffect  
        useEffect(()=>{
            function checked(){
                const admin = {
                    user: {
                        email: "henriquejoiascarpina@gmail.com"
                    }
                }
    
                if (!signed) {
                    router.back()             
                }
    
                if(user?.email !== admin.user.email){
                    router.push('/');
                }
    
            }
    
            checked();

            getCode();
        
        },[router, signed, user])

        //INÍCIO GETCODE
        async function getCode(){
            const cupomRef = collection(db, "cupom")
            const q = query(cupomRef, orderBy("created", "desc"))

            const querySnapshot = await getDocs(q)
            let lista = [] as CupomProps[];

            querySnapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    cupom: doc.data().cupom,
                    user: doc.data().user,
                    UserName: doc.data().UserName,
                    created: doc.data().created,
                })
                setCupom(lista);
            })

        }

        //INÍCIO DA HANDLE CODE
        function handleCode(e: FormEvent){
            e.preventDefault();

            if(!signed){
                return;
            }

            if(input === ""){
                toast("Escreva o Cupom Primeiro", {
                    icon: "⚠️"
                })
                return;
            }

            addDoc(collection(db, "cupom"), {
                cupom: input,
                user: user?.email,
                UserName: user?.displayName,
                created: new Date()
            })
            .then(()=>{
                setInput("");
                console.log("CUPOM CADASTRADO COM SUCESSO")
                toast("Atualize para ver o cupom", {
                    icon: "🎟"
                })
            })
        }

        //DELETE CODE
        async function handleDeleteCode(item: CupomProps){
            const docRef = doc(db, "cupom", item.id)
            await deleteDoc(docRef);
            setCupom(cupom.filter((code)=> code.id !== item.id))
        }

    return(
        <main>
            <Header/>

            {/* INÍCIO DA RESIZE */}
            <div className="w-full max-w-screen-xl mx-auto px-4 mb-5">

            {/* INÍCIO DA SUBMENU */}
            <main className="my-5 bg-slate-200 px-3 py-2 rounded-lg flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-500">
                <nav className="flex items-center gap-4 font-medium">
                    <Link href="/dashboard"> Dashboard </Link>
                    <Link href="/dashboard/new"> Cadastrar Produto </Link>
                </nav>
                <div className="cursor-pointer flex gap-3 items-center">
                    <Link href="/dashboard/cupom">
                        <CiBarcode size={24} />
                    </Link>
                    <Link href="/">
                        <FaHome size={22} />
                    </Link>
                </div>
            </main>{/* FIM DA SUBMENU */}
            {/* INÍCIO DA CADASTRO */}
            <div className="w-full rounded-md bg-slate-300 p-2">
                <p className="font-medium">Informe o Cupom:</p>
                <form 
                onSubmit={handleCode}
                className="w-full flex items-center gap-1"
                >
                    <input 
                    className="bg-slate-300 w-full rounded-md border-2 border-slate-900 p-2 h-11"
                    type="text" 
                    placeholder="Ex: Henrique10..."
                    value={input}
                    onChange={(e)=> setInput(e.target.value)}
                    />
                    <button
                    className="h-11 rounded-md bg-slate-500 text-white px-2 py-1 font-bold"
                    type="submit"
                    > 
                    Cadastrar 
                    </button>
                </form>
            </div>{/* FIM DA CADASTRO */}
            {/* INÍCIO DA CODE */}
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1 sm:px-0">
                {cupom.map((item)=>(
                <div className="w-full bg-slate-200 p-3 rounded-lg shadow-lg my-3 flex justify-between">
                    {/* CUPOM */}
                    <div className="flex items-center gap-2">
                        <BiBarcode size={32} />
                        <p className="font-bold text-md"> {item.cupom} </p>
                    </div>
                    {/* CUPOM */}
                    <button 
                    onClick={()=> handleDeleteCode(item)}
                    className="bg-transparent"
                    >
                        <FaTrashAlt size={22} />
                    </button>
                </div>
                ))}
            </section>{/* FIM DA CODE */}
            </div>{/* FIM DA RESIZE */}
        </main>
    )
}