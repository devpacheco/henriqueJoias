
//IMPORTS DE COMPONENTS
import { Container } from "@/Components/Container"
import { Footer } from "@/Components/footer"
import { Header } from "@/Components/header"
import { Slide } from "@/Components/slider"
import { IoSearch } from "react-icons/io5";
import Img from "../../../public/assets/WHATS.jpg"

//IMPORTS DE FUNCIONALIDADES
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

//IMPORTS DE ICONS
import { FaFilter, FaTrash } from "react-icons/fa";

//IMPORTS DE TIPAGENS
import { ProductProps } from "@/utils/product.type"

//IMPORTS DE BANCO DE DADOS
import { db } from "@/services/firebaseConnection"
import { 
    collection, 
    query, 
    orderBy,
    where,
    getDocs,
    onSnapshot,  
} from "firebase/firestore"
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home(){

    //ARMAZENA O INPUT DE PESQUISA
    const [search, setSearch] = useState("");

    //ARMAZENA OS PRODUTOS
    const [produto, setProduto] = useState<ProductProps[]>([]);

    //ARMAZENA SELECT FILTER
    const [filter, setFilter] = useState("");

    //RENDER PRODUCT
    useEffect(()=>{

        loadTarefas();

    },[])

    async function loadTarefas(){
        const tarefasRef = collection(db, "product")
        const q = query(
            tarefasRef,
            orderBy("created", "desc")
        );

        await onSnapshot(q, (snapshot)=>{
            let lista = [] as ProductProps[];

            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    category: doc.data().category,
                    price: doc.data().price,
                    plot: doc.data().plot,
                    init: doc.data().init,
                    final: doc.data().final,
                    created: doc.data().created,
                    user: doc.data().user,
                    images: doc.data().images,
                })
            })

            setProduto(lista);

        })

    }

    //FILTER PRODUCT
    async function handleFilter(){
        if(filter === ""){
            loadTarefas();
            return;
        }
        setProduto([]);
        const q = query(collection(db, "product"),
        where("category", ">=", filter),
        where("category", "<=", filter + "\uf8ff")
        )
        const querySnapshot = await getDocs(q)
        let listProduct = [] as ProductProps[];

        querySnapshot.forEach((doc)=>{
            listProduct.push({
                id: doc.id,
                name: doc.data().name,
                category: doc.data().category,
                price: doc.data().price,
                plot: doc.data().plot,
                init: doc.data().init,
                final: doc.data().final,
                created: doc.data().created,
                user: doc.data().user,
                images: doc.data().images,
            })
            setProduto(listProduct);
            setFilter("");
        })
    }

    //HANDLE SEARCH
    async function handleSearch(e: FormEvent){
        e.preventDefault()

        if(search === ""){
            loadTarefas();
            return;
        }
        setProduto([]);
        const q = query(collection(db, "product"),
        where("name", ">=", search.toLocaleUpperCase()),
        where("name", "<=", search.toLocaleUpperCase() + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)
        let listProduct = [] as ProductProps[];

        querySnapshot.forEach((doc)=>{
            listProduct.push({
                id: doc.id,
                name: doc.data().name,
                category: doc.data().category,
                price: doc.data().price,
                plot: doc.data().plot,
                init: doc.data().init,
                final: doc.data().final,
                created: doc.data().created,
                user: doc.data().user,
                images: doc.data().images,
            })
            setProduto(listProduct);
            setFilter("");
        })
    }



  return(
    <>
      <Header/>

      <div className="w-full max-w-screen-xl mx-auto px-4 mb-5">
        <Slide/>
        <main className="w-full">
            <form onSubmit={handleSearch} className="w-full bg-slate-200 p-2 rounded-lg flex items-center gap-1">
                <input 
                className="w-full bg-slate-200 outline-none"
                type="text" 
                placeholder="Buscando algo?"
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                />
                <button type="submit" className="bg-transparent"> <IoSearch size={24} /> </button>
            </form>
            <section className="w-96 max-w-screen-xl my-5">
                    <h2 className="font-medium mb-1 flex items-center gap-2" > <FaFilter/>  Filtrar por Categoria: </h2>
                    <div className="flex gap-2">
                        <select 
                        name="filtro" 
                        id="filter" 
                        className="rounded-lg px-3 py-2 bg-slate-200 outline-none font-medium border-2 border-slate-700"
                        value={filter}
                        onChange={(e)=> setFilter(e.target.value)}
                        >
                            <option selected>- Selecione -</option>
                            <option value="aliança">Aliança</option>
                            <option value="correnteM">Corrente Masculina</option>
                            <option value="corenteF">Corrente Feminina</option>
                            <option value="limpeza">Produto de Limpeza</option>
                        </select>
                        <button 
                        onClick={handleFilter}
                        className="h-11 boder-none bg-blue-500 text-white font-medium rounded-lg px-6 py-2 cursor-pointer"
                        > 
                        Filtrar 
                        </button>
                    </div>
            </section>
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1 sm:px-0">
                {produto.map((item)=>(
                    <div className="w-full bg-slate-200 p-3 rounded-lg shadow-lg">
                        <Link href={`/detail/${item.id}`}>
                        <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="rounded-lg h-60 w-full object-cover"
                        />
                        <h1 className="uppercase font-extrabold text-xl mt-3 mb-4"> {item.name} </h1>
                        </Link>
                        
                        <p> A Partir de </p>
                        <h1 className="font-extrabold text-2xl"> {item.price} R$ </h1>
                        <p> Ou {item.plot} </p>
                    </div>
                ))}
            </section>
        </main>
      </div>

      <Footer/>
    </>
  )
}