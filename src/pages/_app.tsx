import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return(
    <SessionProvider basePath="/custom-route/api/auth">
    <Toaster
        position="top-center"
        reverseOrder={false}
    />
    <Component {...pageProps} />
    </SessionProvider>
  )
}
