//IMPORTS DE FUNCINALIDADES
import { GetServerSideProps } from "next"
import { ProductProps } from "@/utils/product.type";
import { useState, useEffect, useContext } from "react";

//IMPORT DE BANCO DE DADOS
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where, addDoc} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

//IMPORT DE COMPONENTS
import { Container } from "@/Components/Container";
import { Header } from "@/Components/header";
import Link from "next/link";
import Head from "next/head";


//IMPORT DE ICONS
import { FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";
import { Footer } from "@/Components/footer";
import { FaSearch, FaStar } from "react-icons/fa"

//IMPORT USER
import { useSession } from "next-auth/react";
import { PiUserCircleDuotone } from "react-icons/pi";
import { AuthContext } from "@/contexts/AuthContext";

//INTERFACE DETAILPROPS
interface DetailProps {
    item: ProductProps;
    id: string;
}

//INTERFACE COMMENT PROPS
interface CommentProps {
    id: string;
    Idproduct: string;
    comment: string;
    stars: number;
    user: string;
    nameUser: string;
    created: string;
}

//INÍCIO DA PAGE
export default function Detail({item, id}: DetailProps){
    const [tamanho, setTamanho] = useState("");
    const { user } = useContext(AuthContext);

    //INICIO DA HANDLE BUYS
    function handleBuy(){

        const number = "+5581989801354"

        const url = `https://wa.me/${number}?text=Nome: ${item.name}%0aPreço: ${item.price}%0a${item.category !== "limpeza" ? (tamanho):(``)}Categoria: ${item.category}`
        window.open(url, "_blank")?.focus();
    }

    const [rating, setRating] = useState<number | null>(null);
    const [rateColor, setColor] = useState();
    const [comment, setComment] = useState('');

    const [comentarios, setComentarios] = useState<CommentProps[]>([]);

    
    
    //FUNCTION COMMENT
    async function handleComment(){
        if(comment === "" || rating === null){
            toast("Adicione sua avaliação primeiro!", {
                icon: "⚠️"
            })
            return;
        }

        if(!user?.email){
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
                user: user?.email,
                nameUser: user?.displayName,
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
        <main>
            <Head>
                <title> {item.name} </title>
            </Head>
            <Header/>
            <Container>
                <>
                {/* IMAGE */}
                <div className="w-full raltive h-96 bg-slate-300 rounded-lg">
                    <div>
                        <Link 
                        className="absolute z-10 bg-slate-200 rounded-full w-12 h-12 my-2 mx-2 flex items-center justify-center"
                        href="https://www.instagram.com/henriquejoiascarpina/" 
                        target="_blank"
                        > 
                        <FaInstagram size={22} /> 
                        </Link>
                    </div>
                    <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="relative object-cover h-96 w-full rounded-lg"
                    />
                </div>

                {/* INFO */}

                <div className="w-full bg-slate-300 rounded-lg p-2 mt-5">
                    <h1 className="font-extrabold text-4xl" > {item.name} </h1>
                    {/* INÍCIO DO PRICE */}
                    <div className="mt-3 mb-2">
                     <p className="font-medium"> Por Apenas </p>
                     <h1 className="uppercase font-extrabold text-3xl"> {item.price} R$ </h1>
                     <p className="font-medium"> Ou { item.plot } </p>
                    </div>{/* FIM DE PRICE */}
                    
                    {/* PLOT */}
                        {item.category !== "limpeza" && (
                            <>
                            <h2 className="font-bold mb-2"> Tamanhos disponíveis: </h2>
                            <div className="flex gap-2 items-center">
                                <div className="border-2 border-slate-900 w-10 h-10 flex items-center justify-center rounded-md">
                                    <span> {item.init} </span>
                                </div>{/* FIM DO INIT */}
                                <span> Até </span>
                                <div className="border-2 border-slate-900 w-10 h-10 flex items-center justify-center rounded-md">
                                    <span> {item.final} </span>
                                </div>{/* FIM DO FINAL */}
                            </div>
                            </>
                        )}
                    {/* FIM DO PLOT */}

                    {/* TAMANHO */}
                        {item.category !== "limpeza" && (
                            <div>
                                {item.category === "aliança" ? (
                                    <div className="my-3">
                                        <select 
                                        name="tamanho" 
                                        id="size" 
                                        className="rounded-lg px-3 py-2 bg-slate-200 outline-none font-medium border-2 border-slate-700"
                                        value={tamanho}
                                        onChange={(e)=> setTamanho(e.target.value)}
                                        >
                                            <option selected>- Selecione -</option>
                                            <option value="tamanho-11"> Tamanho 11 </option>
                                            <option value="tamanho-12"> Tamanho 12 </option>
                                            <option value="tamanho-13"> Tamanho 13 </option>
                                            <option value="tamanho-14"> Tamanho 14 </option>
                                            <option value="tamanho-15"> Tamanho 15 </option>
                                            <option value="tamanho-16"> Tamanho 16 </option>
                                            <option value="tamanho-17"> Tamanho 17 </option>
                                            <option value="tamanho-18"> Tamanho 18 </option>
                                            <option value="tamanho-19"> Tamanho 19 </option>
                                            <option value="tamanho-20"> Tamanho 20 </option>
                                            <option value="tamanho-21"> Tamanho 21 </option>
                                            <option value="tamanho-22"> Tamanho 22 </option>
                                            <option value="tamanho-23"> Tamanho 23 </option>
                                            <option value="tamanho-24"> Tamanho 24 </option>
                                            <option value="tamanho-25"> Tamanho 25 </option>
                                            <option value="tamanho-26"> Tamanho 26 </option>
                                            <option value="tamanho-27"> Tamanho 27 </option>
                                            <option value="tamanho-28"> Tamanho 28 </option>
                                            <option value="tamanho-29"> Tamanho 29 </option>
                                            <option value="tamanho-30"> Tamanho 30 </option>
                                            <option value="tamanho-31"> Tamanho 31 </option>
                                            <option value="tamanho-32"> Tamanho 32 </option>
                                            <option value="tamanho-33"> Tamanho 33 </option>
                                            <option value="tamanho-34"> Tamanho 34 </option>
                                            <option value="tamanho-35"> Tamanho 35 </option>
                                            <option value="tamanho-36"> Tamanho 36 </option>
                                            <option value="tamanho-37"> Tamanho 37 </option>
                                            <option value="tamanho-38"> Tamanho 38 </option>
                                            <option value="tamanho-39"> Tamanho 39 </option>
                                            <option value="tamanho-40"> Tamanho 40 </option>
                                        </select>
                                    </div>
                                ) : item.category === "correnteM" ? (
                                    <div className="my-3">
                                        <select 
                                        name="tamanho" 
                                        id="size" 
                                        className="rounded-lg px-3 py-2 bg-slate-200 outline-none font-medium border-2 border-slate-700"
                                        value={tamanho}
                                        onChange={(e)=> setTamanho(e.target.value)}
                                        >
                                            <option selected>- Selecione -</option>
                                            <option value="tamanho-60cm"> Tamanho 60cm </option>
                                            <option value="tamanho-70cm"> Tamanho 70cm </option>
                                            <option value="tamanho-80cm"> Tamanho 80cm </option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="my-3">
                                        <select 
                                        name="tamanho" 
                                        id="size" 
                                        className="rounded-lg px-3 py-2 bg-slate-200 outline-none font-medium border-2 border-slate-700"
                                        value={tamanho}
                                        onChange={(e)=> setTamanho(e.target.value)}
                                        >
                                            <option selected>- Selecione -</option>
                                            <option value="tamanho-40cm"> Tamanho 40cm </option>
                                            <option value="tamanho-45cm"> Tamanho 45cm </option>
                                            <option value="tamanho-50cm"> Tamanho 50cm </option>
                                        </select>
                                    </div>
                                ) }
                            </div>
                        )}
                    {/* FINAL DE TAMANHO */}

                    <button 
                    onClick={handleBuy}
                    className="w-full h-11 rounded-md bg-slate-600 text-white font-medium hover:bg-slate-700 duration-500"
                    >
                        Fazer Pedido
                    </button>
                </div>{/* FINAL DO INFO */}

                {/* INÍCIO DO COMMENT */}
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
                {/* FIM DO COMMENT */}

                </>
            </Container>
            <Footer/>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async({params})=>{
    const id = params?.id as string;

    const docRef = doc(db, "product", id)
    const snapShot = await getDoc(docRef)

    const miliseconds = snapShot.data()?.created?.seconds * 1000;

    const product = {
        category: snapShot.data()?.category,
        created: new Date(miliseconds).toLocaleDateString(),
        init: snapShot.data()?.init,
        final: snapShot.data()?.final,
        name: snapShot.data()?.name,
        plot: snapShot.data()?.plot,
        price: snapShot.data()?.price,
        description: snapShot.data()?.description,
        user: snapShot.data()?.user,
        images: snapShot.data()?.images
    }

    return{
        props: {
            item: product,
            id: id,
        }
    }
}