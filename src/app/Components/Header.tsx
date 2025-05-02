"use client"
import React from 'react'
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Theader {
  title: String;
}
export const Header:React.FC<Theader>=({title})=> {
   const router = useRouter()
  return (
    <div className="flex justify-between items-center my-8">
    <h1 className="text-xl font-semibold">{title}</h1>
    <Button  style={{cursor:"pointer"}} onClick={()=> router.push('/')} variant="ghost" size="sm" className="flex items-center gap-1">
      <ArrowLeft className="h-4 w-4" />
      <span >Back</span>
    </Button>
  </div>
  )
}
