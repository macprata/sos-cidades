"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  Mail,
  Save,
  CreditCard,
  Lock,
  MenuIcon,
} from "lucide-react";
import api from "../../../services/api";
import { toast } from "sonner";
import Menu from "@/components/layout/Menu";

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  // Lógica de validação em tempo real adaptada do cadastro[cite: 8]
  const validacoes = {
    min6: formData.senha.length >= 6,
    letra: /[a-zA-Z]/.test(formData.senha),
    numero: /[0-9]/.test(formData.senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.senha),
    match: formData.senha === formData.confirmarSenha && formData.senha !== "",
  };

  // Verifica se o usuário está tentando alterar a senha
  const isChangingPassword =
    formData.senha.length > 0 || formData.confirmarSenha.length > 0;
  // Verifica se todas as regras de senha foram cumpridas[cite: 8]
  const isPasswordValid = Object.values(validacoes).every(Boolean);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          nome: response.data.nome || "",
          email: response.data.email || "",
          cpf: response.data.cpf || "",
          senha: "",
          confirmarSenha: "",
        });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Erro ao carregar os dados do perfil.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se o usuário está tentando mudar a senha, checa se as validações passaram
    if (isChangingPassword && !isPasswordValid) {
      toast.error("Por favor, cumpra todos os requisitos da nova senha.");
      return;
    }

    setSalvando(true);

    try {
      const token = localStorage.getItem("token");
      const payload: any = { email: formData.email };

      // Só envia a senha se ela foi preenchida e validada
      if (isChangingPassword && isPasswordValid) {
        payload.senha = formData.senha;
      }

      await api.patch("/auth/perfil", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Perfil atualizado com sucesso!");

      setFormData((prev) => ({ ...prev, senha: "", confirmarSenha: "" }));
      router.back();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Erro ao atualizar perfil. Verifique os dados.",
      );
    } finally {
      setSalvando(false);
    }
  };

  // Desabilita o botão se estiver salvando OU se estiver mudando a senha e a validação falhar
  const isSubmitDisabled = salvando || (isChangingPassword && !isPasswordValid);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <Image
            src="/sos_cidades_logo.png"
            alt="Logo"
            width={100}
            height={30}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <button
          className="p-2 text-slate-600 hover:text-cyan-600 transition"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon size={24} />
        </button>
      </header>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="max-w-md mx-auto p-6 space-y-6 mt-4">
        <h1 className="text-2xl font-black text-slate-900">Editar Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Nome Completo
            </label>
            <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl border border-slate-200 cursor-not-allowed">
              <User className="text-slate-400" size={20} />
              <input
                disabled
                className="bg-transparent w-full outline-none text-slate-500 font-medium cursor-not-allowed"
                value={formData.nome}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">CPF</label>
            <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl border border-slate-200 cursor-not-allowed">
              <CreditCard className="text-slate-400" size={20} />
              <input
                disabled
                className="bg-transparent w-full outline-none text-slate-500 font-medium cursor-not-allowed"
                value={formData.cpf}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-bold text-slate-700">E-mail</label>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-cyan-600 transition-all shadow-sm">
              <Mail className="text-cyan-600" size={20} />
              <input
                type="email"
                className="bg-transparent w-full outline-none text-slate-900 font-medium"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Nova Senha
            </label>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-cyan-600 transition-all shadow-sm">
              <Lock className="text-cyan-600" size={20} />
              <input
                type="password"
                placeholder="Deixe em branco para manter a atual"
                className="bg-transparent w-full outline-none text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Confirmar Nova Senha
            </label>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-cyan-600 transition-all shadow-sm">
              <Lock className="text-cyan-600" size={20} />
              <input
                type="password"
                placeholder="Repita a nova senha"
                className="bg-transparent w-full outline-none text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                value={formData.confirmarSenha}
                onChange={(e) =>
                  setFormData({ ...formData, confirmarSenha: e.target.value })
                }
              />
            </div>
          </div>

          {/* Checklist de Validação, visível apenas se tentar mudar a senha */}
          {isChangingPassword && (
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-[10px] space-y-0.5 animate-in slide-in-from-top-2 duration-300">
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
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-slate-900 text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-40 transition-all shadow-md hover:shadow-lg"
            >
              <Save size={20} />
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
