"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Home,
  User,
  LogOut,
  Plus,
  ListTodo,
  ShieldAlert,
  Users,
  Tags,
} from "lucide-react";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Busca o papel do usuário no momento em que o menu é aberto/montado
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Supondo que você salve o papel no localStorage no momento do login
      // Ex: localStorage.setItem("role", "GESTOR");
      const savedRole = localStorage.getItem("role") || "CLIENTE";
      setUserRole(savedRole.toUpperCase());
    }
  }, []);

  // Definição de TODAS as rotas do sistema e quem pode acessá-las
  const allMenuItems = [
    // --- ROTAS DO CLIENTE (CIDADÃO) ---
    {
      name: "Início",
      icon: Home,
      path: "/cliente",
      roles: ["CLIENTE"],
    },
    {
      name: "Meu Histórico",
      icon: ListTodo,
      path: "/cliente/denuncias",
      roles: ["CLIENTE"],
    },
    {
      name: "Nova Denúncia",
      icon: Plus,
      path: "/cliente/denuncias/nova",
      roles: ["CLIENTE"],
    },

    // --- ROTAS DO GESTOR ---
    {
      name: "Painel de Demandas",
      icon: ListTodo,
      path: "/gestor",
      roles: ["GESTOR", "ADMINISTRADOR"],
    },

    // --- ROTAS DO ADMINISTRADOR ---
    {
      name: "Painel Admin",
      icon: ShieldAlert,
      path: "/admin",
      roles: ["ADMINISTRADOR"],
    },
    {
      name: "Gerenciar Usuários",
      icon: Users,
      path: "/admin/usuarios",
      roles: ["ADMINISTRADOR"],
    },
    {
      name: "Categorias",
      icon: Tags,
      path: "/admin/categorias",
      roles: ["ADMINISTRADOR"],
    },

    // --- ROTAS GLOBAIS (TODOS ACESSAM) ---
    {
      name: "Meu Perfil",
      icon: User,
      path: "/perfil",
      roles: ["CLIENTE", "GESTOR", "ADMINISTRADOR"],
    },
  ];

  // Filtra o menu para exibir apenas os links permitidos para o cargo atual
  const menuPermitido = allMenuItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : false,
  );

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Limpa o cargo ao sair
    router.push("/login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay com blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-72 bg-white h-full shadow-2xl p-6 relative flex flex-col animate-in slide-in-from-left duration-300">
        <button
          className="mb-8 text-slate-400 hover:text-slate-800 transition-colors self-start p-2 -ml-2 rounded-xl hover:bg-slate-50"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {/* Label indicando o cargo para contexto do usuário */}
          <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-4 pl-2">
            Menu Principal • {userRole}
          </p>

          {menuPermitido.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="flex items-center gap-4 w-full p-3.5 font-bold text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-2xl transition-all"
            >
              <item.icon size={20} /> {item.name}
            </button>
          ))}
        </div>

        {/* Botão de Sair fixo no rodapé do menu */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3.5 font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </div>
    </div>
  );
}
