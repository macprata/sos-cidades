"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  useEffect(() => {
    // Verifica se devemos mostrar o toast
    if (localStorage.getItem("showToast") === "true") {
      toast.success("Cadastro realizado com sucesso!");
      localStorage.removeItem("showToast"); // Limpa a flag
    }
  }, []);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamada para sua rota de autenticação no backend
      const response = await api.post("/auth/login", { email, senha });

      // Armazena o token recebido do backend (assumindo que seja 'access_token')
      localStorage.setItem("token", response.data.access_token);

      toast.success("Login realizado com sucesso!");

      // Redireciona para o Dashboard protegido
      router.push("/painel");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Erro ao entrar: " +
          (err.response?.data?.message || "Credenciais inválidas"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Lado Esquerdo: Imagem da Cidade (50% da tela) */}
      {/* Lado Esquerdo: Imagem da Cidade */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/cidade.png"
          alt="Cenário Urbano"
          fill
          className="object-cover"
          priority
        />

        {/* Gradiente de contraste para garantir legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Informações Institucionais */}
        <div className="absolute bottom-8 left-8 text-white z-10">
          <p className="text-xl font-bold tracking-wide">SOS Cidades</p>
          <p className="text-sm font-medium text-white/80  tracking-widest mt-1">
            Construindo uma Cidade Melhor para Todos
          </p>
        </div>
      </div>

      {/* Lado Direito: Formulário (50% da tela) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/sos_cidades_logo.png"
              alt="Logo"
              width={250}
              height={75}
            />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Bem-vindo(a)
          </h2>
          <p className="text-slate-500 mb-8">
            Entre para acessar o SOS Cidades
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800"
              placeholder="E-mail"
              value={email} // Conecta ao estado
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
              required
            />
            <input
              type="password"
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800"
              placeholder="Senha"
              value={senha} // Conecta ao estado
              onChange={(e) => setSenha(e.target.value)} // Atualiza o estado
              required
            />
            <button
              type="submit" // Garante que o botão dispare o onSubmit do formulário
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold p-4 rounded-xl hover:bg-slate-800 transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem acesso?{" "}
            <Link
              href="/cadastro"
              className="text-cyan-600 font-bold hover:underline"
            >
              Cadastre-se aqui
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
