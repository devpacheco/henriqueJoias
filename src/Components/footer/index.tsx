import { FaWhatsapp } from "react-icons/fa"

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
import LogoImg from "../../../public/assets/logo.png"

import { BiSolidNavigation } from "react-icons/bi";
import { MdOutlineCopyright } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function Footer(){
    const [mensage, setMensage] = useState("");

    //SUBMIT FORM
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const phone = "+5581989801354"

        const url = `https://wa.me/${phone}?text=Mensagem de Suporte: ${mensage}%0a%0a`

        window.open(url, "_blank")?.focus();
        setMensage("");
    }

    return(
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
                <form onSubmit={handleSubmit} className="border-2 h-10 border-slate-900 bg-slate-300 flex items-center">
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
    )   
}