"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Search, Shield, Building2, User } from "lucide-react";
import api from "../../../services/api"; // Ajuste o caminho se necessário
import { toast } from "sonner";
import Menu from "@/components/layout/Menu"; // Se você tiver um menu para o admin

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (error) {
        toast.error("Erro ao carregar a lista de usuários.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()),
  );

  const getIconePerfil = (perfil: string) => {
    switch (perfil) {
      case "ADMINISTRADOR":
        return <Shield className="text-purple-500" size={18} />;
      case "PREFEITURA":
        return <Building2 className="text-cyan-500" size={18} />;
      default:
        return <User className="text-emerald-500" size={18} />;
    }
  };

  const getNomePerfilVisual = (perfil: string) => {
    switch (perfil) {
      case "ADMINISTRADOR":
        return "Administrador";
      case "PREFEITURA":
        return "Gestor";
      default:
        return "Cliente";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2 rounded-xl">
            <Users size={20} />
          </div>
          <h1 className="font-bold text-slate-800">Gestão de Usuários</h1>
        </div>
        <button
          className="bg-cyan-600 text-white p-2 rounded-xl shadow-md hover:bg-cyan-700 transition"
          onClick={() => router.push("/admin/usuarios/novo")}
        >
          <Plus size={20} />
        </button>
      </header>

      {/* COMPONENTE DE MENU (Opcional, adicione se tiver) */}
      {/* <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} /> */}

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* BARRA DE PESQUISA */}
        <div className="bg-white flex items-center gap-3 p-4 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-cyan-600 transition-all">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="bg-transparent w-full outline-none text-slate-800"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* LISTA DE USUÁRIOS */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <div className="grid gap-4">
            {usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-cyan-200 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 truncate">
                    {usuario.nome}
                  </span>
                  <span className="text-xs text-slate-500 truncate mt-0.5">
                    {usuario.email}
                  </span>
                  {usuario.cpf && (
                    <span className="text-xs text-slate-400 mt-0.5">
                      CPF:{" "}
                      {usuario.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4",
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  {getIconePerfil(usuario.perfil)}
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {getNomePerfilVisual(usuario.perfil)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
