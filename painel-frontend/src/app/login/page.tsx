"use client";
import React, { useState } from "react";
import api from "../../services/api";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700 p-4">
      {/* Efeito Glassmorphism */}
      <div className="w-full max-w-md p-8 rounded-[2rem] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <div className="mb-8 text-center">
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
        </div>

        <form className="space-y-5">
          <input
            type="email"
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-cyan-400 outline-none transition"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/50 focus:ring-2 focus:ring-cyan-400 outline-none transition"
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-indigo-900 font-bold p-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5">
            Entrar no Sistema
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-blue-100/60">
          Ainda não tem uma conta?{" "}
          <Link
            href="/cadastro"
            className="text-white font-bold hover:underline"
          >
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </main>
  );
}
