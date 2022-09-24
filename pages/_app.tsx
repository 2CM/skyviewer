import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext} from 'react'

export var dataContext = createContext({mining: 0});

export default function MyApp({ Component, pageProps }: AppProps) {
	return <dataContext.Provider value={{mining: 150000000}}><Component {...pageProps} /></dataContext.Provider>
}
