"use client"; // Precisamos disso para usar hooks e acessar o navegador (localStorage)

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ListTodo, Users, LogOut } from "lucide-react";

export default function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const verificarAcesso = () => {
      const token = localStorage.getItem("token");

      // 1. Se não tem token, manda pro login
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 2. Decodifica o payload do JWT para ler as informações do usuário
        // O JWT é dividido em 3 partes por um ponto (.). O índice [1] é o payload com os dados.
        const payloadBase64 = token.split(".")[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));

        // 3. Verifica se o perfil no token é PREFEITURA ou ADMINISTRADOR
        if (
          payloadDecodificado.perfil === "PREFEITURA" ||
          payloadDecodificado.perfil === "ADMINISTRADOR"
        ) {
          setAutorizado(true); // Libera o acesso!
        } else {
          // Se for um CIDADAO tentando acessar a área do gestor, manda pro painel dele
          router.push("/cliente");
        }
      } catch (error) {
        // Se o token for inválido ou malformado
        console.error("Erro ao validar token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    verificarAcesso();
  }, [router]);

  // Função para fazer o logout e limpar a sessão
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Enquanto estiver validando (autorizado === false), mostra uma tela de carregamento
  // Isso evita o "piscar" (flash) da tela do gestor antes do redirecionamento
  if (!autorizado) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">
          Verificando credenciais de segurança...
        </p>
      </div>
    );
  }

  // Se passou na validação, renderiza o Layout normal
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* SIDEBAR DO GESTOR */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-md border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed h-full z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl text-slate-900 tracking-tight">
              Workspace
            </h2>
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-1">
              Portal do Gestor
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <button
            onClick={() => router.push("/gestor")}
            className="flex w-full items-center gap-3 bg-cyan-50 text-cyan-700 px-4 py-3 rounded-xl font-bold transition-all border border-cyan-100 shadow-sm"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/gestor/denuncias")}
            className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 px-4 py-3 rounded-xl font-semibold transition-all"
          >
            <ListTodo size={20} />
            Fila de Atendimento
          </button>

          <button
            onClick={() => router.push("/gestor/usuarios")}
            className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 px-4 py-3 rounded-xl font-semibold transition-all"
          >
            <Users size={20} />
            Cidadãos
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-xl font-semibold transition-all w-full"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen relative">
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <span className="font-bold text-slate-800">Portal do Gestor</span>
        </div>

        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
