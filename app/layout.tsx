import "./globals.css"
import "react-photo-view/dist/react-photo-view.css"
import { Rosario } from "next/font/google"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Provider } from "./provider"
import { Progress } from "./progress"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"

const rosario = Rosario({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Artworks Demo",
    description: "A Demo of Artworks which is a collection of art pieces from the Art Institute of Chicago."
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={rosario.className}>
                <Provider>
                    <ErrorBoundary fallback={<p>Application is down</p>}>
                        <Suspense>
                            <Progress />
                        </Suspense>
                        {children}
                    </ErrorBoundary>
                </Provider>
            </body>
        </html>
    )
}
