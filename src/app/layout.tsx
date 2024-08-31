import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";

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
        
          <NavigationMenu className="flex min-w-full justify-center p-4 border-b-slate-400 border-b mb-12">
            <NavigationMenuList className="flex justify-start min-w-[1460px]">
              <NavigationMenuItem className="mr-12">
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    <Image className="relative mr-4" src="/racing-car.png"
                        alt="Race car" width={30} height={10} priority
                    /> 
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/played-before" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Have we played this?
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/player" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Player lookup
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/map" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Map lookup
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>


          <main className="flex justify-center">
            <div className="flex flex-col min-w-[1460px]">
              {children}
            </div>
          </main>
        
      </body>
    </html>
  );
}
