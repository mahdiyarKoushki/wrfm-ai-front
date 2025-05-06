"use client"
import React from 'react'
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Theader {
  title: String;
  rout:string
}
export const Header:React.FC<Theader>=({title,rout})=> {
   const router = useRouter()
  return (
    <div className="flex justify-between items-center my-8 container mx-auto">
    <h1 className="text-3xl font-bold">{title}</h1>
    <Button  style={{cursor:"pointer"}} onClick={()=> router.push(rout)} variant="ghost" size="sm" className="flex items-center gap-1">
      <ArrowLeft className="h-4 w-4" />
      <span >Back</span>
    </Button>
  </div>
  )
}
