import api from "./api";

export const denunciaService = {
  // POST /denuncias (Não requer token, perfeito para o cidadão)
  criarDenuncia: async (dados: any) => {
    return await api.post("/denuncias", dados);
  },

  // GET /denuncias (Requer Token, para o gestor)
  listarDenuncias: async () => {
    return await api.get("/denuncias");
  },
};
