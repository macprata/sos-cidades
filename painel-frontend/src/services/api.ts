import axios from "axios";

// Cria a instância base
const api = axios.create({
  baseURL: "http://localhost:3000", // Ou a URL da sua API
});

// Configura o interceptador
api.interceptors.request.use(
  (config) => {
    // 1. Busca o token onde você salvou no login (ex: localStorage ou cookies)
    const token = localStorage.getItem("token"); // Ajuste a chave se usar outro nome

    // 2. Se o token existir, injeta no cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
