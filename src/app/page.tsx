import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="lg:bg-auto bg-cover bg-[url('/tm-banner.jpg')] min-w-full min-h-[40rem] flex justify-center items-start flex-col text-white p-6 lg:p-24">
        <div className="text-left rounded-xl space-y-4 bg-gradient-to-r from-[#00995e] to-[#005f46] p-6">
          <p className="text-4xl lg:text-5xl font-semibold">Trackmania with Friends</p>
        
          <Button asChild>
            <Link href="/played-before">
                Get started
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
