import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SubProvider } from '../contexts';
import { RoomProvider } from '../contexts/room';
export default function App({ Component, pageProps }: AppProps) {

  return (
    <SubProvider>
      <RoomProvider>
        <Component {...pageProps} />
      </RoomProvider>
    </SubProvider>
  )
}
