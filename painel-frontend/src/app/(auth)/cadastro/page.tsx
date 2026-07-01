"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import api from "../../../services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  // Adicionado o CPF no estado inicial
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
  });
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Algoritmo de validação de CPF
  const validarCPF = (cpf: string) => {
    const strCPF = cpf.replace(/\D/g, ""); // Remove não numéricos
    if (strCPF.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(strCPF)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++)
      soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(strCPF.substring(10, 11));
  };

  // Função para aplicar a máscara no input (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    // Aplica a formatação
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFormData({ ...formData, cpf: value });
  };

  // Lógica de validação em tempo real
  const validacoes = {
    min6: formData.senha.length >= 6,
    letra: /[a-zA-Z]/.test(formData.senha),
    numero: /[0-9]/.test(formData.senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.senha),
    match: formData.senha === confirmarSenha && formData.senha !== "",
    cpfValido: validarCPF(formData.cpf), // Nova validação
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove a máscara antes de enviar para a API (envia apenas números)
      const payload = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ""),
        perfil: "CIDADAO",
      };

      await api.post("/usuarios", payload);

      localStorage.setItem("showToast", "true");
      router.push("/login");
    } catch (err: any) {
      // Tratamento de erro específico para duplicidade de CPF e E-mail
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || "";

      // O NestJS costuma retornar um array de mensagens no class-validator ou uma string
      const errorMessageString = Array.isArray(errorMsg)
        ? errorMsg.join(" ")
        : String(errorMsg);
      const msgLower = errorMessageString.toLowerCase();

      if (msgLower.includes("email") || msgLower.includes("e-mail")) {
        toast.error("Este e-mail já está cadastrado.");
      } else if (msgLower.includes("cpf")) {
        toast.error("Este CPF já está cadastrado.");
      } else {
        toast.error(errorMessageString || "Erro ao cadastrar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-row bg-white overflow-hidden">
      {/* Lado Esquerdo: Imagem da Cidade */}
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

      {/* Lado Direito: Formulário */}
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

            {/* NOVO CAMPO DE CPF */}
            <input
              type="text"
              className={`w-full p-3 border rounded-xl focus:ring-2 outline-none text-slate-800 transition-colors ${
                !validacoes.cpfValido && formData.cpf.length === 14
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-200 focus:ring-emerald-500"
              }`}
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleCpfChange}
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

            {/* Checklist de Validação Atualizado */}
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
              <p
                className={
                  validacoes.cpfValido ? "text-emerald-600" : "text-slate-400"
                }
              >
                ✓ CPF Válido
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
