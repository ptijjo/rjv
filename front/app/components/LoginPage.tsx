"use client"
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


type Inputs = {
  identifiant: string
  password: string
}
const LoginPage = () => {

  const navigate = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const connectUser = await axios.post("Url.connection", data);
      toast.success(`Bienvenue ${connectUser.data.data.pseudo}`);
      localStorage.setItem("token", connectUser.data.token);
      setTimeout(() => {
        navigate.push("/dashboard")
      }, 2000);

    } catch (error: any) {
      toast.error(`${error.response.data.message}`)
    }

  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-1.5 w-4/5 items-center justify-center">
      <Input type="text" placeholder="e-mail or pseudo" id="identifiant" autoComplete="false" className="rounded placeholder-red-400 pl-4" {...register("identifiant")} />
      {errors.identifiant && errors.identifiant.type === "required" && <span>Identifiant Obligatoire</span>}

      <Input type="password" placeholder="password" id="password" autoComplete="false" className="rounded" {...register("password", { required: true })} />
      {errors.password && errors.password.type === "required" && <span>Mot de passe obligatoire</span>}

      <Button type="submit" className="mt-2.5 bg-blue-400 hover:bg-blue-300 w-[85%] md:w-3/4 mx-auto rounded-2xl">Se connecter</Button>

      <ToastContainer autoClose={2000} />
    </form>
  )
}

export default LoginPage