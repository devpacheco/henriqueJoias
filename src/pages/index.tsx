
//IMPORTS DE COMPONENTS
import { Container } from "@/Components/Container"
import { Footer } from "@/Components/footer"
import { Header } from "@/Components/header"
import { Hero } from "@/Components/hero"
import { Slide } from "@/Components/slider"

export default function Home(){
  return(
    <>
      <Header/>

      <Container>
        <Slide/>
        <Hero/>
      </Container>

      <Footer/>
    </>
  )
}