import React, { useState } from "react";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, senha });
      localStorage.setItem("token", response.data.access_token);
      alert("Login realizado com sucesso!");
    } catch (err) {
      alert("Falha na autenticação. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          SOS Cidades - Acesso
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="E-mail institucional"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
