"use client"
import { Button } from '@/components/ui/button';
import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const GoogleConnection = () => {

    return (
        <div className='mb-3.5 w-full flex '>
            <Button className='rounded-2xl md:w-1/2 mx-auto hover:bg-slate-50' onClick={() => signIn("google")}>
                <FcGoogle />
                Signin with Google
            </Button>
        </div>
    )
}

export default GoogleConnection
