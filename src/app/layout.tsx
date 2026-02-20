import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trackmania with Friends",
  description: "Plan your collaborative Trackmania session with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

          <nav className="flex min-w-full justify-center p-4 border-b-slate-400 border-b">
            <ul className="flex justify-start min-w-full lg:min-w-[1460px] lg:flex-row flex-col items-center">

              <li className="text-center min-w-full lg:min-w-fit lg:mr-12 lg:border-none border-b border-b-slate-400">
                <Link href="/" className={`lg:min-w-fit min-w-full ${navigationMenuTriggerStyle()}`}>
                    <Image className="relative mr-4 w-auto h-auto" src="/racing-car.png"
                            alt="Race car" width={30} height={10} priority/> 
                    Home
                </Link>
              </li>
              <li className="text-center min-w-full lg:min-w-fit lg:border-r-2 lg:border-r-slate-800 lg:border-b-0 border-b border-b-slate-400">
                <Link href="/group/management" className={`lg:min-w-fit min-w-full ${navigationMenuTriggerStyle()}`}>
                    Group management
                </Link>
              </li>
              <li className="text-center min-w-full lg:min-w-fit lg:border-none border-b border-b-slate-400">
                <Link href="/played-before" className={`lg:min-w-fit min-w-full ${navigationMenuTriggerStyle()}`}>
                    Have we played this?
                </Link>
              </li>
              <li className="text-center min-w-full lg:min-w-fit lg:border-none border-b border-b-slate-400">
                <Link href="/map" className={`lg:min-w-fit min-w-full ${navigationMenuTriggerStyle()}`}>
                    Map lookup
                </Link>
              </li>
              <li className="text-center min-w-full lg:min-w-fit lg:border-none border-b border-b-slate-400">
                <Link href="/map-finder" className={`lg:min-w-fit min-w-full ${navigationMenuTriggerStyle()}`}>
                    Map finder
                </Link>
              </li>
            </ul>
          </nav>

          <main className="flex justify-center p-4">
            <div className="flex flex-col min-w-fit lg:min-w-[1460px]">
              <Providers>
                {children}
              </Providers>
            </div>
          </main>
        
          <footer className="flex justify-center p-4 border-t bg-t-slate-400">
            <div className="flex flex-row items min-w-full lg:min-w-[1460px] items-center justify-center">
              <Link target="_blank" href="https://dk.linkedin.com/in/dani%C3%A9l-garrido" className="px-12">
                <Image src="/LinkedIn.png" alt="LinkedIn" width={100} height={24} priority/> 
              </Link>

              <Link target="_blank" href="https://github.com/GarridoY" className="px-12">
                <Image src="/GitHub.png" alt="GitHub" width={100} height={40} priority/> 
              </Link>
            </div>
          </footer>
      </body>
    </html>
  );
}
