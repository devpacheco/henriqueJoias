
//IMPORTS DE COMPONENTS
import { Footer } from "@/Components/footer"
import { Header } from "@/Components/header"
import { Slide } from "@/Components/slider"
import { IoSearch } from "react-icons/io5";
import Img from "../../../public/assets/WHATS.jpg"

//IMPORTS DE FUNCIONALIDADES
import { useState, useEffect, FormEvent } from "react";

//IMPORTS DE ICONS
import { FaFilter, FaTrash } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

//ICONS DE CONTATO
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import { HiMiniMapPin } from "react-icons/hi2";

//ICONS DE PAGAMENTO
import { IoCard } from "react-icons/io5";
import { FaLink, FaPix } from "react-icons/fa6";
import { FaMoneyBill } from "react-icons/fa";

//IMPORT DE IMAGES
import Image from "next/image";
import LogoImg from "../../public/assets/logo.png"

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
import Link from "next/link";
import { BiSolidNavigation } from "react-icons/bi";
import { MdOutlineCopyright } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import Head from "next/head";

export default function Home(){
    const [mensage, setMensage] = useState("");

    //ARMAZENA O INPUT DE PESQUISA
    const [search, setSearch] = useState("");

    //ARMAZENA OS PRODUTOS
    const [produto, setProduto] = useState<ProductProps[]>([]);

    //ARMAZENA SELECT FILTER
    const [filter, setFilter] = useState("");

    const [loading, setLoading] = useState(true);

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
                    description: doc.data().description,
                    created: doc.data().created,
                    user: doc.data().user,
                    images: doc.data().images,
                })
            })

            setProduto(lista);
            setLoading(false);
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
                description: doc.data().description,
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
                description: doc.data().description,
                created: doc.data().created,
                user: doc.data().user,
                images: doc.data().images,
            })
            setProduto(listProduct);
            setFilter("");
        })
    }

        //SUBMIT FORM
        async function handleSubmit(e: FormEvent) {
            e.preventDefault();
    
            const phone = "+5581989801354"
    
            const url = `https://wa.me/${phone}?text=Mensagem de Suporte: ${mensage}%0a%0a`
    
            window.open(url, "_blank")?.focus();
            setMensage("");
        }



  return(
    <>
     <Head>
        <title> Henrique Joias - Conheça nossas joias! </title>
     </Head>

      <Header/>

      <div className="w-full max-w-screen-xl mx-auto px-4 mb-5">
        <Slide/>

        {/* INÍCIO DA HERO */}
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
            <section className="w-full max-w-screen-xl my-5">
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
            {loading === true && (
            <main className="w-full h-screen max-w-screen-xl my-3 flex items-center justify-center">
                <div>
                    <VscLoading  className="animate-spin" size={54} />
                </div>
            </main>
            )}
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1 sm:px-0">
                {produto.map((item)=>(
                    <div className="w-full bg-slate-200 p-3 rounded-lg shadow-lg">
                        <Link href={`/detail/${item.id}`}>
                        <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="rounded-lg h-60 w-full object-cover"
                        />
                        <h1 className="uppercase font-extrabold text-xl mt-3 mb-4 md:limited-text md:overflow-hidden md:max-h-[3em] md:line-clamp-2"> {item.name} </h1>
                        </Link>
                        
                        <p> A Partir de </p>
                        <h1 className="font-extrabold text-2xl"> {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} </h1>
                        <p> Ou {item.plot} </p>
                    </div>
                ))}
            </section>
        </main>
      </div>
      {/* FINAL DA HERO */}

      {/* INÍCIO DO FOOTER */}
      <main className="w-full bg-slate-200 flex flex-col">
        <div className="w-full flex flex-col justify-center gap-10 p-4 bg-slate-200 lg:flex-row">
            {/* APRESENTAÇÃO */}
            <div className="flex flex-col items-start">
                <Image
                    src={LogoImg}
                    alt="Logo da Aplicação"
                    className="w-48 h-14"
                />
                <p className="pl-1" > 
                    investir em detalhes é investir em você. <br /> 
                    Conheça nossas joias!
                </p>
                <Link 
                className="flex items-center my-3 gap-1"
                href="https://www.mediafire.com/file/uinlz5uxhhuzxdp/termo_uso_henrique_joias_atualizado.pdf/file" 
                target="_blank"
                > 
                <FaLink/>
                Termo de Uso 
                </Link>
            </div>

            {/* CONTATOS */}
            <div>
                <h2 className="text-2xl font-extrabold mb-3"> Contatos </h2>
                <nav className="flex flex-col gap-2 items-start">
                    {/* PHONE */}
                    <div className="flex items-center">
                        <FaPhoneAlt size={22} />
                        <p className="font-medium"> +55 (81) 9 8980-1354 </p>
                    </div>
                    {/* EMAIL */}
                    <div className="flex items-center">
                        <MdOutlineAttachEmail size={24} />
                        <p className="font-medium"> henriquejoiascarpina@gmail.com </p>
                    </div>
                    {/* LOCAL */}
                    <div className="flex items-center">
                        <HiMiniMapPin size={24} />
                        <p className="font-medium"> Carpina - PE </p>
                    </div>
                </nav>
            </div>{/* FIM DE CONTATOS */}

            {/* FORMAS DE PAGAMENTOS */}
            <div>
                <h2 className="text-2xl font-extrabold mb-3"> Formas de Pagamento </h2>
                <div className="flex gap-2 items-center">
                    <IoCard size={32} />
                    <FaPix size={26} />
                    <FaMoneyBill size={26} />
                </div>
            </div>{/* FIM DE FORMAS DE PAGAMENTOS */}

            {/* FORMULÁRIO */}
            <div className="flex flex-col w-60">
                <form  
                onSubmit={handleSubmit}
                className="border-2 h-10 border-slate-900 bg-slate-300 flex items-center"
                >
                    <input 
                    name="message"
                    type="text"
                    className="bg-slate-300 w-full outline-none p-1" 
                    placeholder="Precisa de Ajuda?"
                    value={mensage}
                    onChange={(e)=> setMensage(e.target.value)}
                    />
                    <button type="submit" className="bg-transparent border-2 border-slate-900 h-10 px-4"> <BiSolidNavigation size={22} /> </button>
                </form>
                <p className="my-3"> Entre Contato em caso de duvidas, ou caso queira deixar sua experiencia! </p>
            </div>
        </div>
        <div className="w-11/12 h-px bg-slate-400 my-3 mx-auto"></div>
        <div>
            <div className="w-full flex flex-col items-center justify-between px-1 md:px-20 mb-3 md:flex-row">
                <div className="flex items-center gap-1">
                <MdOutlineCopyright size={22} className="text-slate-500" />
                <p className="font-medium text-slate-500"> Todos os Direitos Reservados <Link href="https://www.instagram.com/henriquejoiascarpina/"> @HenriqueJoias </Link> </p>
                </div>

                <div className="flex items-center gap-1">
                <FaLaptopCode size={22} className="text-slate-500" />
                <p className="font-medium text-slate-500"> Criador <Link href="https://www.instagram.com/gabriel.p_20/"> @DevPacheco </Link> </p>
                </div>
                
            </div>
        </div>
        </main>
      {/* FINAL DO FOOTER */}
    </>
  )
}