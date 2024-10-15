"use client"

//INTERFACES
interface ProductImageProps {
    name: string;
    user: string;
    previewUrl: string;
    url: string;
}

//IMPORTS DO STORAGE
import { useSession } from "next-auth/react";
import { storage } from "@/services/firebaseConnection"
import { uploadBytes, getDownloadURL, ref, deleteObject } from "firebase/storage"
import { v4 as uuidv4 } from 'uuid';

//IMPORTS DO FIRESTORAGE
import { db } from "@/services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

//IMPORT DE COMPONENTS
import { Header } from "@/Components/header"
import Link from "next/link";
import { FaHome } from "react-icons/fa";

//IMPORT DE FUNCIONALIDADES
import { ChangeEvent, FormEvent } from "react"
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

//IMPORT DE ICONS
import { FcAddImage } from "react-icons/fc";
import { FaTrash } from "react-icons/fa";


//INÍCIO DA FUNCTION PRINCIPAL
export default function New(){
    const { data: session } = useSession();
    const [productImage, setProductImage] = useState<ProductImageProps[]>([]);
    const [category, setCategory] = useState("");
    console.log(category);

    //PROPIEDADE INPUT
    const [init, setInit] = useState("");
    const [final, setFinal] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [plot, setPlot] = useState("");

    //INÍCIO DA HANDLE UPLOAD
    async function handleUpload(image: File){
        if(!session?.user?.email){
            return;
        }

        const currentUid = session.user.email;
        const UidImage = uuidv4();

        const uploadRef = ref(storage, `images/${currentUid}/${UidImage}`)

        uploadBytes(uploadRef, image)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then((downloadUrl)=>{
                const imageItem = {
                    name: UidImage,
                    user: currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl,
                }
                setProductImage((images)=> [...images, imageItem])
            })
        })
    }

//INÍCIO DA HANDLE FILE:
async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
        const image = e.target.files[0]

        if(image.type === "image/jpeg" || image.type === "image/png"){
            await handleUpload(image)
            toast("Imagem adicionada!", {
                icon: "🖼️"
            })
        }else {
            toast.error("Envie uma imagem jpeg ou png!")
            return;
        }
    }
}

//INÍCIO DA DELETE IMAGE
async function handleDeleteImage(item: ProductImageProps){
    const imagePath = `images/${session?.user?.email}/${item.name}`
    const imageRef = ref(storage, imagePath);

    try{
        deleteObject(imageRef)
        setProductImage(productImage.filter((img)=> img.url !== item.url))
        toast("Imagem deletada", {
            icon: "🗑️"
        })
    }catch(err){
        throw new Error("error deleting image")
    }
}

//INÍCIO DA CADASTRO
async function onSubmit(e: FormEvent){
    e.preventDefault();

    if(productImage.length === 0){
        toast("Adicione uma Imagem Primeiro!", {
            icon: "📷"
        })
        return;
    }

    if(category === "limpeza"){
        setInit("Valor indisponivel pra essa category");
        setFinal("Valor indisponivel pra essa category");
    }

    if(category === ""){
        toast("Adicione a categoria!", {
            icon: "⚠️"
        })
        return;
    }

    const imgProduct = productImage.map((img)=>{
        return {
            name: img.name,
            user: img.user,
            url: img.url,
        }
    })

    addDoc(collection(db, "product"), {
        name: name.toUpperCase(),
        category: category,
        price: price,
        plot: plot,
        init: init,
        final: final,
        created: new Date(),
        user: session?.user?.email,
        images: imgProduct,
    })
    .then(()=>{
        setProductImage([]);
        setCategory("");
        setInit("");
        setFinal("");
        console.log("ITEM CADASTRADO!")
        toast("Produto Cadastrada com sucesso", {
            icon: "📦"
        })
    })
}

    return(
        <main>
            <Header/>

            <div className="w-full max-w-screen-xl mx-auto px-4 mb-5">
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

                <section className="w-full"  >
                    <div className="w-full bg-slate-300 rounded-lg p-2 flex gap-1">
                        <button className="bg-transparent border-2 border-slate-900 w-48 h-48 rounded-lg flex items-center justify-center">
                            <div className="absolute">
                                <FcAddImage size={34} />
                            </div>

                            <div className="cursor-pointer">
                            <input 
                            className="opacity-0 cursor-pointer"
                            type="file"
                            accept="image/*"
                            onChange={handleFile} 
                            /> 
                            </div>{/* FIM DA INPUT FILE */}
                        </button>{/* FIM DO BUTTON */}
                        
                        {productImage.map((item)=>(
                            <div className="w-full flex justify-center items-center">
                                <button className="absolute cursor-pointer" onClick={()=> handleDeleteImage(item)}>                     
                                        <FaTrash size={24} color="#FFF" />
                                </button>
                                <img
                                    src={item.previewUrl}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        ))}

                    </div>{/* FIM DA ADD IMAGE */}
                    <form 
                    onSubmit={onSubmit}
                    className="w-full p-2 rounded-lg bg-slate-300 mt-5 mb-3"
                    >
                        {/* NAME E CATEGORY */}
                        <div className="w-full flex flex-col items-center gap-2 md:flex-row">
                            <div className="w-full mb-3">
                                <p className="font-medium">Nome do Produto:</p>
                                <input
                                    type="text"
                                    placeholder="Digite o nome do produto..."
                                    name="name"
                                    value={name}
                                    onChange={(e)=> setName(e.target.value)}
                                />
                            </div>
                            <div className="w-full mb-3">
                                <p className="font-medium">Categoria do Produto:</p>
                                <select 
                                name="categoria" 
                                id="category"
                                className="w-full h-11 bg-slate-300 outline-none rounded-lg border-2 border-slate-900"
                                value={category}
                                onChange={(e)=> setCategory(e.target.value)}
                                required
                                >
                                    <option selected >- Selecione -</option>
                                    <option value="correnteM"> Corrente Masculina </option>
                                    <option value="corenteF"> Corrente Feminina </option>
                                    <option value="aliança"> Aliança </option>
                                    <option value="limpeza">Produto de Limpeza</option>
                                </select>
                            </div>
                        </div>{/* FIM DA NAME E CATEGORY */}
                        {/* PRICE E PARCELAS */}
                        <div className="w-full flex items-center gap-2">
                            <div className="w-full mb-3">
                                <p className="font-medium">Preço do Produto:</p>
                                <input
                                    type="text"
                                    placeholder="Ex: 199,90R$"
                                    name="price"
                                    value={price}
                                    onChange={(e)=> setPrice(e.target.value)}
                                />
                            </div>
                            <div className="w-full mb-3">
                                <p className="font-medium">Parcela do Produto:</p>
                                <input
                                    type="text"
                                    placeholder="Ex: 3x sem juros..."
                                    name="plot"
                                    value={plot}
                                    onChange={(e)=> setPlot(e.target.value)}
                                />
                            </div>
                        </div>{/* FIM DO PRICE E PARCELA */}
                        {/* INIT E FINAL */}
                            {category !== "limpeza" && (
                                <div className="w-full md:w-3/6 flex items-center gap-2">
                                    <div className="w-full mb-3">
                                        <p className="font-medium">Tamanho Inicial</p>
                                        <input
                                            className="w-full rounded-lg border-2 border-slate-900 h-11 my-1 px-2 py-2 bg-slate-300 outline-none placeholder:text-slate-600"
                                            type="text"
                                            placeholder="Ex: tamanho 13"
                                            name="init"
                                            value={init}
                                            onChange={(e)=> setInit(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full mb-3">
                                        <p className="font-medium">Tamanho Final:</p>
                                        <input
                                            className="w-full rounded-lg border-2 border-slate-900 h-11 my-1 px-2 py-2 bg-slate-300 outline-none placeholder:text-slate-600"
                                            type="text"
                                            placeholder="Ex: tamanho 23"
                                            name="final"
                                            value={final}
                                            onChange={(e)=> setFinal(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        {/* FIM DO INIT E FINAL*/}
                        <button type="submit" className="w-full h-11 border-none rounded-lg bg-slate-600 text-white font-medium">
                            Cadastrar
                        </button>
                    </form>
                </section>
            </div>
        </main>
    )
}