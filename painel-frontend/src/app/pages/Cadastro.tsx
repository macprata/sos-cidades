import React, { useState } from "react";
import api from "../services/api";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/usuarios", formData);
      alert("Usuário cadastrado com sucesso! Agora você pode fazer login.");
      // Opcional: redirecionar para a tela de login
    } catch (err) {
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          SOS Cidades - Cadastro
        </h2>
        <form onSubmit={handleCadastro} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Nome Completo"
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="E-mail"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Senha"
            onChange={(e) =>
              setFormData({ ...formData, senha: e.target.value })
            }
          />
          <button className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
