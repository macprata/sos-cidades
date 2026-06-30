"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const data = [
  { name: "Infraestrutura", value: 400, color: "#0ea5e9" },
  { name: "Limpeza", value: 300, color: "#10b981" },
  { name: "Iluminação", value: 300, color: "#f59e0b" },
];

export default function Denuncias() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [minhasDenuncias, setMinhasDenuncias] = useState<any[]>([]);
  const router = useRouter();

  // === BUSCANDO AS DENÚNCIAS DA API ===
  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Substitua pela URL base correta do seu backend NestJS, caso use o Axios (api.get)
        const response = await fetch("http://localhost:3000/denuncias/minhas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const dados = await response.json();
          // Pega apenas as últimas 4 denúncias
          setMinhasDenuncias(dados.slice(0, 4));
        }
      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
      }
    };

    fetchDenuncias();
  }, [router]);

  const menuItems = [
    { name: "Home", icon: Home, action: () => setIsMenuOpen(false) },
    {
      name: "Denúncias",
      icon: Plus,
      action: () => router.push("/painel/denuncias"),
    },
    { name: "Meu Perfil", icon: User, action: () => console.log("Perfil...") },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Image src="/sos_cidades_logo.png" alt="Logo" width={120} height={40} />
        <button
          className="p-2 text-slate-600"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon size={24} />
        </button>
      </header>

      {/* MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="w-64 bg-white h-full shadow-2xl p-6 relative flex flex-col">
            <button className="mb-8" onClick={() => setIsMenuOpen(false)}>
              <X />
            </button>

            <div className="flex-1 space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="flex items-center gap-4 w-full p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <item.icon size={20} /> {item.name}
                </button>
              ))}
              <hr className="my-4" />
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="flex items-center gap-4 w-full p-3 font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={20} /> Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* GRÁFICO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase">
            Distribuição por Categoria
          </h2>
          <div className="h-48">
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MÉTRICAS (Bento Grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200">
            <Clock className="text-amber-500 mb-2" />
            <p className="text-2xl font-bold">48h</p>
            <p className="text-[10px] text-slate-400">Tempo Médio Resposta</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200">
            <CheckCircle className="text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">72h</p>
            <p className="text-[10px] text-slate-400">Tempo Médio Solução</p>
          </div>
        </div>

        <h2 className="text-sm font-bold text-slate-500 mb-2 uppercase">
          Minhas Denúncias
        </h2>

        {/* LISTA DINÂMICA DE DENÚNCIAS */}
        <div className="space-y-4">
          {minhasDenuncias.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              Nenhuma denúncia encontrada.
            </p>
          ) : (
            minhasDenuncias.map((denuncia) => (
              <div
                key={denuncia.id}
                onClick={() => router.push(`/painel/denuncias/${denuncia.id}`)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-cyan-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    {/* Renderiza o título dinamicamente */}
                    <p className="font-bold text-sm text-slate-800">
                      {denuncia.descricao}
                    </p>
                    {/* Renderiza a data formatada */}
                    <p className="text-[10px] text-slate-400">
                      Enviado em{" "}
                      {new Date(denuncia.dataCriacao).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 flex justify-around items-center z-10">
        <button className="flex flex-col items-center text-slate-400">
          <Home size={24} /> <span className="text-[10px]">Home</span>
        </button>

        <button
          className="bg-slate-900 text-white p-4 rounded-full shadow-xl -mt-10 border-4 border-slate-50 transition-transform hover:scale-105"
          onClick={() => router.push("/painel/denuncias/nova")}
        >
          <Plus size={32} />
        </button>

        <button className="flex flex-col items-center text-slate-400">
          <User size={24} /> <span className="text-[10px]">Perfil</span>
        </button>
      </nav>
    </main>
  );
}
