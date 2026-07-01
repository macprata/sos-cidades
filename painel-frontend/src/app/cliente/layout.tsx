"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const verificarAcesso = () => {
      const token = localStorage.getItem("token");

      // 1. Sem token = Volta pro Login
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const payloadBase64 = token.split(".")[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));

        // 2. Roteamento Inteligente: Se um Gestor logar e tentar entrar na área
        // do cliente por engano, o sistema corrige a rota automaticamente.
        if (
          payloadDecodificado.perfil === "PREFEITURA" ||
          payloadDecodificado.perfil === "ADMINISTRADOR"
        ) {
          router.push("/gestor");
        } else {
          // É um cidadão válido, libera a tela!
          setAutorizado(true);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    verificarAcesso();
  }, [router]);

  // Loading state para evitar "flashes" de tela
  if (!autorizado) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600 mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          Carregando seu painel...
        </p>
      </div>
    );
  }

  return (
    // O fundo padrão e a fonte base para toda a área do cidadão
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Não incluímos sidebar nem header fixo aqui porque as páginas do cidadão 
        já controlam seus próprios cabeçalhos (ex: Seta de voltar na tela de detalhes).
        Este layout injeta segurança de forma invisível.
      */}
      {children}
    </div>
  );
}
