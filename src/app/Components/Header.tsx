"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Theader {
  title: string;
  rout: string;
}

export const Header: React.FC<Theader> = ({ title, rout }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center py-8  bg-gray-950  mx-auto ">
      <h1 className="text-3xl font-bold text-gray-100">
        {title}
      </h1>
      <Button
        style={{ cursor: "pointer" }}
        onClick={() => router.push(rout)}
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-gray-100  dark:text-gray-300"
      >
        <ArrowLeft className="h-4 w-4" />
        <span >Back</span>
      </Button>
    </div>
  );
};