import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { Submenu } from "./components/submenu"
import { Header } from "@/Components/header"
import { Container } from "@/Components/Container"
import { DashCard } from "./components/dashCard"

export default function Dashboard(){
    return(
        <main>
            <Header/>

            <Container>
                <Submenu/>
                <DashCard/>
            </Container>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async({req})=>{
    const session = await getSession({req});

    const admin = {
        user:{
            email: "henriquejoiascarpina@gmail.com"
        }
    }

    if(session?.user?.email !== admin.user.email){
        return{
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }


    return{
        props: {},
    }
}

