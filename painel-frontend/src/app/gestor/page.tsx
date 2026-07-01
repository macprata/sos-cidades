"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Dados simulados para a apresentação visual da interface
const dadosEvolucao = [
  { mes: "Jan", denuncias: 45 },
  { mes: "Fev", denuncias: 52 },
  { mes: "Mar", denuncias: 38 },
  { mes: "Abr", denuncias: 65 },
  { mes: "Mai", denuncias: 48 },
  { mes: "Jun", denuncias: 70 },
];

const dadosBairros = [
  { bairro: "Atalaia", quantidade: 120 },
  { bairro: "Treze de Julho", quantidade: 98 },
  { bairro: "Augusto Franco", quantidade: 86 },
  { bairro: "Jardins", quantidade: 45 },
];

export default function GestorDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Visão Geral
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Acompanhamento de métricas e chamados da cidade.
          </p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
          <Activity size={16} className="text-cyan-600" />
          Gerar Relatório
        </button>
      </div>

      {/* BENTO GRID: Primeira Linha (Métricas Principais) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Abertas */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +12%
              </span>
            </div>
            <p className="text-slate-500 text-sm font-semibold mb-1">
              Aguardando Análise
            </p>
            <h3 className="text-4xl font-black text-slate-900">42</h3>
          </div>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Clock size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-semibold mb-1">
              Em Andamento
            </p>
            <h3 className="text-4xl font-black text-slate-900">128</h3>
          </div>
        </div>

        {/* Card 3: Resolvidas */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +5%
              </span>
            </div>
            <p className="text-slate-500 text-sm font-semibold mb-1">
              Resolvidas (Mês)
            </p>
            <h3 className="text-4xl font-black text-slate-900">315</h3>
          </div>
        </div>

        {/* Card 4: SLA Médio */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-800 p-3 rounded-2xl text-cyan-400 border border-slate-700">
                <Activity size={24} />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-1">
              Tempo Médio de Solução
            </p>
            <h3 className="text-4xl font-black text-white flex items-baseline gap-2">
              4.2{" "}
              <span className="text-lg text-slate-500 font-medium">dias</span>
            </h3>
          </div>
        </div>
      </div>

      {/* BENTO GRID: Segunda Linha (Gráficos) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gráfico de Evolução (Ocupa 2 colunas) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-600" />
            Evolução de Chamados Abertos
          </h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dadosEvolucao}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="denuncias"
                  stroke="#0891b2"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#0891b2" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking de Bairros (Ocupa 1 coluna) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-cyan-600" />
            Zonas Críticas
          </h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosBairros}
                layout="vertical"
                margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="bairro"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9", radius: 8 }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Bar
                  dataKey="quantidade"
                  fill="#0891b2"
                  radius={[0, 8, 8, 0]}
                  barSize={24}
                ></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
