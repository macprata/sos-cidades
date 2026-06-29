"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Cadastro() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700 p-4">
      <div className="w-full max-w-md p-8 rounded-[2rem] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/sos_cidades.png"
            alt="Logo SOS Cidades"
            width={200}
            height={100}
            className="object-contain"
            priority // Carrega a imagem com prioridade para performance
          />
        </div>

        <form className="space-y-4">
          {["Nome Completo", "E-mail", "Senha"].map((field) => (
            <input
              key={field}
              type={field === "Senha" ? "password" : "text"}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-100/50 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              placeholder={field}
            />
          ))}
          <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-indigo-900 font-bold p-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5">
            Finalizar Cadastro
          </button>
          <div className="mt-6 text-center text-sm text-emerald-100/60">
            Já possui uma conta?{" "}
            <Link
              href="/login"
              className="text-white font-bold hover:underline"
            >
              Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
