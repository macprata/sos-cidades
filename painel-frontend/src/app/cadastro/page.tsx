"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "" });
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inicialize o hook

  // Lógica de validação em tempo real
  const validacoes = {
    min6: formData.senha.length >= 6,
    letra: /[a-zA-Z]/.test(formData.senha),
    numero: /[0-9]/.test(formData.senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.senha),
    match: formData.senha === confirmarSenha && formData.senha !== "",
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/usuarios", formData);

      // Em vez de window.location.href
      localStorage.setItem("showToast", "true");
      router.push("/login"); // Navegação fluida
    } catch (err: any) {
      toast.error("Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-row bg-white overflow-hidden">
      {/* Lado Esquerdo: Imagem da Cidade - Oculto em mobile, visível em telas grandes */}
      <div className="hidden lg:flex lg:w-1/2 relative h-screen">
        <Image
          src="/cidade.png"
          alt="Cenário Urbano"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 text-white z-10">
          <p className="text-xl font-bold tracking-wide">SOS Cidades</p>
          <p className="text-sm font-medium text-white/80  tracking-widest mt-1">
            Construindo uma Cidade Melhor para Todos
          </p>
        </div>
      </div>

      {/* Lado Direito: Formulário - Ocupa 100% no mobile, 50% no desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Image
              src="/sos_cidades_logo.png"
              alt="Logo"
              width={200}
              height={60}
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Crie sua conta
          </h2>
          <p className="text-slate-500 mb-6 text-sm">Junte-se ao SOS Cidades</p>

          <form onSubmit={handleCadastro} className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              placeholder="Nome Completo"
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
            />
            <input
              type="email"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              placeholder="E-mail"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              placeholder="Senha"
              onChange={(e) =>
                setFormData({ ...formData, senha: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              placeholder="Confirmar Senha"
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />

            {/* Checklist de Validação */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-[10px] space-y-0.5">
              <p
                className={
                  validacoes.min6 ? "text-emerald-600" : "text-slate-400"
                }
              >
                ✓ Mínimo 6 dígitos
              </p>
              <p
                className={
                  validacoes.letra ? "text-emerald-600" : "text-slate-400"
                }
              >
                ✓ Contém uma letra
              </p>
              <p
                className={
                  validacoes.numero ? "text-emerald-600" : "text-slate-400"
                }
              >
                ✓ Contém um número
              </p>
              <p
                className={
                  validacoes.especial ? "text-emerald-600" : "text-slate-400"
                }
              >
                ✓ Contém caractere especial
              </p>
              <p
                className={
                  validacoes.match ? "text-emerald-600" : "text-slate-400"
                }
              >
                ✓ Senhas coincidem
              </p>
            </div>

            <button
              disabled={loading || !Object.values(validacoes).every(Boolean)}
              className="w-full bg-slate-900 text-white font-bold p-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-40"
            >
              {loading ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Já possui uma conta?{" "}
            <Link
              href="/login"
              className="text-slate-900 font-bold hover:underline"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
