import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Records - Trackmania with Friends"
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <Suspense fallback={<p>Loading...</p>}>
    {children}
  </Suspense>
  );
}
