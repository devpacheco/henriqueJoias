//IMPORT DE COMPONENTS
import { Header } from "@/Components/header"
import { ProductProps } from "@/utils/product.type"
import Head from "next/head"

//IMPORTS DE FUNCIONALIDADES
import { useState, useEffect, useContext, use } from "react"
import Link from "next/link"
import { AuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/router"

//IMPORTS DO BANCO DE DADOS
import { auth, db, storage } from "@/services/firebaseConnection"
import { deleteObject, ref } from "firebase/storage";
import { 
    collection, 
    query,
    orderBy,
    where,
    onSnapshot,
    getDocs,
    doc,
    deleteDoc,
} from "firebase/firestore"

//IMPORTS DE ICONS
import { FaFilter, FaTrash } from "react-icons/fa";
import { FaHome } from "react-icons/fa"
import { CiBarcode } from "react-icons/ci";

export default function Dashboard(){
    const [produto, setProduto] = useState<ProductProps[]>([]);
    const [filter, setFilter] = useState("");
    const { signed, user, loadingAuth } = useContext(AuthContext);
    const router = useRouter();

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
      
        loadProduct();

    },[router, signed, user])


    //INÍCIO DA LOAD PRODUCT
    async function loadProduct(){
        const productRef = collection(db, "product")
        const q = query(
            productRef, 
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
                setProduto(lista);
            })
        })
    }

    //FILTER PRODUCT
    async function handleFilter(){
        if(filter === ""){
            loadProduct();
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

    //DELETE PRODUCT
    async function handleDelete(product: ProductProps){
        const docRef = doc(db, "product", product.id)
        await deleteDoc(docRef);

        const imagePath = `images/${product.user}/${product.images[0].name}`
        const imageRef = ref(storage, imagePath)

        try{
            await deleteObject(imageRef);
        }catch(err){
            console.log("Falha ao tentar deletar imagem do produto")
        }
        setProduto(produto.filter(item=> item.id !== product.id))
    }

    return(
        <main>
            
            <Head>
                <title> Página de Admin - Henrique joias </title>
            </Head>

            <Header/>

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
                </main>
                {/* INÍCIO DA SUBMENU */}

                {/* INÍCIO DA DASHCARD */}
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
                    <div className="w-full bg-slate-200 p-3 rounded-lg shadow-lg relative">
                        <div className="absolute top-5 right-5">
                            <button 
                            onClick={()=> handleDelete(item)}
                            className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center" 
                            > 
                                <FaTrash size={22} /> 
                            </button>
                        </div>
                        <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="rounded-lg h-60 w-full object-cover"
                        />
                        <h1 className="uppercase font-extrabold text-xl mt-3 mb-4"> {item.name} </h1>
                        
                        <p> A Partir de </p>
                        <h1 className="font-extrabold text-2xl"> {item.price} R$ </h1>
                        <p> Ou {item.plot} </p>
                    </div>
                ))}
            </section>
            {/* FINAL DA DASHCARD */}
                
            </div>
        </main>
    )
}