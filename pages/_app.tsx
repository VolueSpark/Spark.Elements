import { krub, nunitoSans } from '@/src/fonts'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            {' '}
            <style jsx global>{`
                html,
                select,
                input {
                    font-family: ${nunitoSans.style.fontFamily};
                }

                h1,
                h2,
                h3 {
                    font-family: ${krub.style.fontFamily};
                    font-weight: 400;
                }
                h4 {
                    font-weight: 600;
                }
            `}</style>
            <Component {...pageProps} />
        </>
    )
}
