//IMPORT DE ICONS
import { FaSearch, FaStar } from "react-icons/fa"

interface CommentProps {
    id: string;
    Idproduct: string;
    comment: string;
    stars: number;
    user: string;
    nameUser: string;
    created: string;
}

//IMPORT DE FUNCIONALIDADE
import { useState, useEffect } from "react"
import toast from "react-hot-toast";

//IMPORTS DO BANCO DE DADOS
import { db } from "@/services/firebaseConnection";
import { collection, addDoc, query, orderBy, getDocs, where } from "firebase/firestore";

//IMPORT USER
import { useSession } from "next-auth/react";
import { PiUserCircleDuotone } from "react-icons/pi";

interface CommentId {
    id: string;
}

export function Comment({ id }: CommentId){

    const [rating, setRating] = useState<number | null>(null);
    const [rateColor, setColor] = useState();
    const [comment, setComment] = useState('');

    const [comentarios, setComentarios] = useState<CommentProps[]>([]);

    const { data: session } = useSession();
    
    //FUNCTION COMMENT
    async function handleComment(){
        if(comment === "" || rating === null){
            toast("Adicione sua avaliação primeiro!", {
                icon: "⚠️"
            })
            return;
        }

        if(!session?.user?.email){
            toast("Faça login para poder comentar",{
                icon: "⚠️"
            })
            return;
        }

        try{
            const docRef = await addDoc(collection(db, "comment"), {
                Idproduct: id,
                comment: comment,
                stars: rating,
                user: session?.user?.email,
                nameUser: session?.user?.name,
                created: new Date(),
            })
            setComment("");
            setRating(null);
            toast("Atualize para ver seu comentário!", {
                icon: "🔄"
            })
        }catch(err){
            console.log("Error ao Adicionar Item")
            toast.error("Error ao Adicionar comment!")
        }

    }

    //USE EFFECT
    useEffect(()=>{
        async function loadComment(){
            const commentRef = query(collection(db, "comment"),
            where("Idproduct", "==", id),
            )

            console.log(id);

            await getDocs(commentRef)
            .then((snapshot)=>{
                let list = [] as CommentProps[];
                snapshot.forEach((doc)=>{
                    list.push({
                        id: doc.data().id,
                        Idproduct: doc.data().Idproduct,
                        comment: doc.data().comment,
                        stars: doc.data().stars,
                        user: doc.data().user,
                        nameUser: doc.data().nameUser,
                        created: doc.data().created,
                    })
                    setComentarios(list);
                })
            })
        }
        
        loadComment();

    },[])

    return(
        <div className="w-full rounded-lg bg-slate-300 my-5 p-2">
            <h1 className="font-bold text-xl pl-2 mb-3" > Avaliação do Produto </h1>
            {/* INÍCIO DA AREA COMMENT */}
            <div className="flex flex-col bg-slate-400 rounded-lg px-2">
                {/* SEÇÃO STARS */}
                <div className="flex items-center">
                    {[...Array(5)].map((star, index) =>{
                        const currentRate = index + 1;
                        return(
                            <>
                            <label>
                                <input 
                                className="opacity-0"
                                type="radio" 
                                name="rate"
                                value={currentRate}
                                onClick={()=> setRating(currentRate)}
                                />
                                <FaStar  
                                size={22}
                                className="cursor-pointer"
                                color={currentRate <= (rateColor || rating as number) ? "yellow" : "grey"}
                                />
                            </label>
                            </>
                        )
                    })}
                </div>
                {/* SEÇÃO STARS */}
                
                {/* INÍCIO DA COMMENT */}
                <div className="py-2 w-full flex flex-col">
                    <textarea 
                    className="w-full my-3 rounded-lg p-2 outline-none"
                    placeholder="Deixe seu comentário"
                    name="comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    ></textarea>
                    <button 
                    onClick={handleComment}
                    className="h-11 bg-slate-600 text-white rounded-lg w-full font-medium"
                    >
                        Enviar
                    </button>
                </div>
                {/* FIM DA COMMENT */}
            </div>
            {/* FIM DA AREA COMMENT */}  

            {/* COMMENT */}
            {comentarios.map((item)=>(
                <div className="my-5 flex flex-col">
                    {/* USER */}
                    <div className="flex items-center gap-2">
                        <PiUserCircleDuotone size={34} />
                        <div>
                            <p className="font-medium"> {item.nameUser} </p>
                        </div>
                    </div>
                    {/* FIM DO USER */}

                    {/* TEXT */}
                    <div className="bg-slate-400 p-2 rounded-lg my-2">
                        <div className="my-1 flex items-center">
                            {[...Array(item.stars)].map((star, index) =>{
                            const currentRate = index + 1;
                            return(
                                <FaStar/>
                            )
                            })}
                        </div>
                        <span> {item.comment} </span>
                    </div>
                    {/* FIM DA TEXT */}
                </div>
            ))}
            {/* FIM COMMENT */}

        </div>
    )
}