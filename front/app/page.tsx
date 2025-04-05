import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import LoginPage from "./components/LoginPage";
import GoogleConnection from "./components/GoogleConnection";


export default function Home() {
  return (

    <div className="flex items-center p-3.5 w-full min-h-screen justify-center">
      <aside className="hidden md:flex relative w-[40%] h-3/4">
        <Image src="/images/image-home.png" alt="logo_iphone" priority fill />
      </aside>
      <div className=" flex flex-col gap-y-3.5 items-center justify-center md:justify-between md:w-[50%]">
        <Card className="border-none md:border-1 md:border-solid flex flex-col items-center justify-center w-full">
          <div className="relative w-[100px] md:w-[200px] h-[100px] md:h-[200px]">
            <Image src="/logos/logo.png" alt="logo" fill priority />
          </div>

          <div className="flex flex-col mt-3.5 w-full items-center justify-center">
            <LoginPage />
            <Link href="#" className="flex text-center m-0 justify-center w-full mb-3.5">Mot de passe oublié ?</Link>

            <GoogleConnection />
          </div>
        </Card>
        <Card className="border-none md:border-1 md:border-solid w-full flex items-center justify-center">
          <aside className="flex gap-x-3.5 items-center justify-center p-0.5 md:p-1.5">
            <p className="flex items-center text-center h-full">Vous n'avez pas de compte ? </p>
            <Link href="#" className="text-blue-400 m-0"> Incrivez-vous</Link>
          </aside>
        </Card>
      </div>
    </div>

  );
}
