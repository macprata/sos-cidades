"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Menu from "@/components/layout/Menu";

import {
  Plus,
  Home,
  User,
  Clock,
  CheckCircle,
  ChevronRight,
  LogOut,
  MenuIcon,
  X,
  FileText,
  ListTodo,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "../../services/api"; // Utilizando nossa instância baseada no Axios

const data = [
  { name: "Infraestrutura", value: 400, color: "#0ea5e9" },
  { name: "Limpeza", value: 300, color: "#10b981" },
  { name: "Iluminação", value: 300, color: "#f59e0b" },
];

export default function ClienteDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [minhasDenuncias, setMinhasDenuncias] = useState<any[]>([]);
  const router = useRouter();

  // === BUSCANDO AS DENÚNCIAS DA API ===
  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        const token = localStorage.getItem("token");

        // Chamada utilizando o Axios para evitar problemas de porta/CORS
        const response = await api.get("/denuncias/minhas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Pega apenas as últimas 4 denúncias para o resumo do Dashboard
        setMinhasDenuncias(response.data.slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
      }
    };

    fetchDenuncias();
  }, []);

  const menuItems = [
    {
      name: "Início",
      icon: Home,
      action: () => {
        router.push("/cliente");
        setIsMenuOpen(false);
      },
    },
    {
      name: "Minhas Denúncias",
      icon: ListTodo,
      action: () => router.push("/cliente/denuncias"),
    }, // Ajustado para /cliente
    { name: "Meu Perfil", icon: User, action: () => console.log("Perfil...") },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Image
          src="/sos_cidades_logo.png"
          alt="Logo"
          width={120}
          height={40}
          style={{ width: "auto", height: "auto" }} // Correção do aviso do Next.js
        />
        <button
          className="p-2 text-slate-600 hover:text-cyan-600 transition"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon size={24} />
        </button>
      </header>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="p-6 space-y-6 max-w-lg mx-auto">
        {/* GRÁFICO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Distribuição por Categoria
          </h2>
          <div className="h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MÉTRICAS (Bento Grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <Clock className="text-amber-500 mb-2 relative z-10" />
            <p className="text-2xl font-black text-slate-800 relative z-10">
              48h
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10 mt-1">
              Tempo Médio Resposta
            </p>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-50 rounded-full blur-xl"></div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <CheckCircle className="text-emerald-500 mb-2 relative z-10" />
            <p className="text-2xl font-black text-slate-800 relative z-10">
              72h
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10 mt-1">
              Tempo Médio Solução
            </p>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full blur-xl"></div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-2 mt-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Últimas Denúncias
          </h2>
          <button
            onClick={() => router.push("/cliente/denuncias")}
            className="text-xs font-bold text-cyan-600 hover:underline"
          >
            Ver todas
          </button>
        </div>

        {/* LISTA DINÂMICA DE DENÚNCIAS */}
        <div className="space-y-3">
          {minhasDenuncias.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
              <FileText className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-sm font-medium text-slate-500">
                Você ainda não possui protocolos abertos.
              </p>
            </div>
          ) : (
            minhasDenuncias.map((denuncia) => (
              <div
                key={denuncia.id}
                onClick={() => router.push(`/cliente/denuncias/${denuncia.id}`)} // Ajustado para /cliente
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-cyan-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600 group-hover:bg-cyan-100 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {denuncia.categoria?.nome || denuncia.descricao}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                      {new Date(
                        denuncia.dataCriacao || denuncia.createdAt,
                      ).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-cyan-600 transition-colors"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 flex justify-around items-center z-10 pb-safe">
        <button
          className="flex flex-col items-center text-cyan-600"
          onClick={() => router.push("/cliente")}
        >
          <Home size={24} />{" "}
          <span className="text-[10px] font-bold mt-1">Início</span>
        </button>

        <button
          className="bg-slate-900 text-white p-4 rounded-full shadow-xl -mt-10 border-4 border-slate-50 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          onClick={() => router.push("/cliente/denuncias/nova")} // Ajustado para /cliente
        >
          <Plus size={28} />
        </button>

        <button
          className="flex flex-col items-center text-slate-400 hover:text-slate-700 transition-colors"
          onClick={() => router.push("/cliente/denuncias")} // Ajustado para enviar para o histórico completo
        >
          <ListTodo size={24} />{" "}
          <span className="text-[10px] font-bold mt-1">Histórico</span>
        </button>
      </nav>
    </main>
  );
}
