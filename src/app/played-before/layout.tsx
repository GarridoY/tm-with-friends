import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Records - Trackmania with Friends"
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <>
    {children}
  </>
  );
}
