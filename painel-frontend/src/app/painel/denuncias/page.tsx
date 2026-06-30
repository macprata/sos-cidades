"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Menu,
  Plus,
  X,
  Home,
  User,
  LogOut,
} from "lucide-react";
import api from "../../../services/api";
import { toast } from "sonner";

export default function ListaDenuncias() {
  const router = useRouter();
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados para os filtros
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    const fetchTodasDenuncias = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get("/denuncias/minhas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDenuncias(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        toast.error("Erro ao carregar suas denúncias.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodasDenuncias();
  }, [router]);

  const renderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case "RESOLVIDO":
        return (
          <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider w-max">
            <CheckCircle2 size={12} /> Resolvido
          </span>
        );
      case "EM_ANDAMENTO":
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider w-max">
            <Clock size={12} /> Andamento
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider w-max">
            <AlertCircle size={12} /> Em Análise
          </span>
        );
    }
  };

  const denunciasFiltradas = denuncias.filter((denuncia) => {
    const termoBusca = busca.toLowerCase();
    const tituloCategoria = denuncia.categoria?.nome?.toLowerCase() || "";
    const descricao = denuncia.descricao?.toLowerCase() || "";

    const passaBusca =
      tituloCategoria.includes(termoBusca) || descricao.includes(termoBusca);
    const passaFiltro =
      filtroStatus === "TODOS" ||
      denuncia.status?.toUpperCase() === filtroStatus;

    return passaBusca && passaFiltro;
  });

  const menuItems = [
    { name: "Início", icon: Home, action: () => router.push("/painel") },
    {
      name: "Nova Denúncia",
      icon: Plus,
      action: () => router.push("/painel/denuncias/nova"),
    },
    { name: "Meu Perfil", icon: User, action: () => console.log("Perfil...") },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER ATUALIZADO */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <Image src="/sos_cidades_logo.png" alt="Logo" width={100} height={30} />
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-900 transition bg-slate-50 rounded-xl border border-slate-100"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* MENU DRAWER (Overlay) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="w-64 bg-white h-full shadow-2xl p-6 relative flex flex-col animate-in slide-in-from-left">
            <button
              className="mb-8 text-slate-400 hover:text-slate-800"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={28} />
            </button>

            <div className="flex-1 space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="flex items-center gap-4 w-full p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  <item.icon size={20} className="text-cyan-600" /> {item.name}
                </button>
              ))}
              <hr className="my-4 border-slate-100" />
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="flex items-center gap-4 w-full p-3 font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut size={20} /> Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* TÍTULO, CONTAGEM E BOTÃO NOVA DENÚNCIA */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Minhas Denúncias
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Acompanhe todos os seus protocolos
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => router.push("/painel/denuncias/nova")}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md text-sm"
            >
              <Plus size={18} /> Nova
            </button>
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
              {denunciasFiltradas.length} Registros
            </span>
          </div>
        </div>

        {/* BARRA DE PESQUISA E FILTRO */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por categoria ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-600 text-slate-700 shadow-sm"
            />
          </div>
          <div className="relative md:w-48">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-600 text-slate-700 shadow-sm appearance-none font-medium"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="EM_ANALISE">Em Análise</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="RESOLVIDO">Resolvidos</option>
            </select>
          </div>
        </div>

        {/* LISTAGEM DE CARDS */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {denunciasFiltradas.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
                <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700">
                  Nenhum registro encontrado
                </h3>
                <p className="text-slate-500">
                  Tente ajustar os filtros ou faça uma nova denúncia.
                </p>
              </div>
            ) : (
              denunciasFiltradas.map((denuncia) => (
                <div
                  key={denuncia.id}
                  onClick={() =>
                    router.push(`/painel/denuncias/${denuncia.id}`)
                  }
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {denuncia.imagemUrl ? (
                      <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-slate-100">
                        <img
                          src={denuncia.imagemUrl}
                          alt="Foto"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                        <FileText size={24} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 truncate">
                          {denuncia.categoria?.nome ||
                            "Categoria não informada"}
                        </h3>
                        {renderStatus(denuncia.status)}
                      </div>

                      <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                        {denuncia.descricao}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />{" "}
                          {new Date(denuncia.dataCriacao).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[150px] md:max-w-xs">
                          <MapPin size={14} /> {denuncia.bairro},{" "}
                          {denuncia.cidade}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex bg-slate-50 p-3 rounded-full text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
