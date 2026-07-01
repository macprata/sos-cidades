"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Upload, X } from "lucide-react";
import Image from "next/image";
import api from "../../../services/api";
import { toast } from "sonner";

export default function NovaDenuncia() {
  const router = useRouter();

  // Estado consolidado (incluindo lat/long invisíveis para o usuário, mas prontas para a API)
  const [formData, setFormData] = useState({
    categoriaId: "",
    descricao: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pontoReferencia: "",
    latitude: 0,
    longitude: 0,
  });

  const [categorias, setCategorias] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar categorias na inicialização
  useEffect(() => {
    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch(() => toast.error("Erro ao carregar categorias"));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Captura GPS e preenche endereço, cidade, estado e salva lat/long no state
  const capturarLocalizacao = () => {
    if (!navigator.geolocation)
      return toast.error("Geolocalização indisponível.");

    toast.info("Buscando localização...");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        );
        const data = await res.json();
        const addr = data.address;

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          logradouro: addr.road || "",
          bairro: addr.suburb || addr.neighbourhood || "",
          cidade: addr.city || addr.town || addr.village || "",
          estado: addr.state || "",
          cep: addr.postcode || "",
        }));
        toast.success("Endereço preenchido!");
      } catch {
        toast.error("Erro ao converter coordenadas em endereço.");
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoriaId) {
      toast.error("Por favor, selecione uma categoria.");
      return; // Interrompe a execução aqui
    }

    setLoading(true);

    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, String(value));
    });

    if (imageFile) {
      dataToSend.append("file", imageFile);
    }

    try {
      await api.post("/denuncias", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Denúncia registrada com sucesso!");
      // Ajuste de rota: Volta para o histórico do cliente
      router.push("/cliente/denuncias");
    } catch (error) {
      console.error("Erro no envio:", error);
      toast.error("Erro ao salvar a denúncia. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-slate-800">Nova Denúncia</span>
        </div>
        <Image
          src="/sos_cidades_logo.png"
          alt="Logo"
          width={80}
          height={25}
          style={{ width: "auto", height: "auto" }} // Correção do Next.js Image
        />
      </header>

      {/* Conteúdo */}
      <div className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Categoria
            </label>
            <select
              name="categoriaId"
              className="w-full p-4 border border-slate-200 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-cyan-600 text-slate-900 shadow-sm"
              onChange={handleInputChange}
              value={formData.categoriaId}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Descrição detalhada
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-600 h-32 text-slate-900 shadow-sm"
              placeholder="Descreva os detalhes do problema..."
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Foto do Problema
            </label>
            <label className="block border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer p-4 hover:bg-slate-50 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    className="h-40 w-full object-cover rounded-xl"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 transition-colors text-white rounded-full p-1 shadow-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="py-10 text-slate-400 flex flex-col items-center group">
                  <div className="bg-slate-100 p-3 rounded-full group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                    <Upload size={24} />
                  </div>
                  <span className="mt-3 font-medium group-hover:text-cyan-600 transition-colors">
                    Anexar Imagem
                  </span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Seção de Endereço */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Dados do Endereço</h3>
              {/* Botão de Preenchimento Automático / Captura de GPS */}
              <button
                type="button"
                onClick={capturarLocalizacao}
                className="text-cyan-600 flex items-center gap-1 font-bold bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition shadow-sm"
              >
                <MapPin size={18} /> Usar GPS
              </button>
            </div>

            <div className="space-y-4">
              <input
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                placeholder="CEP"
                className="w-full p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 bg-white"
              />
              <div className="grid grid-cols-4 gap-2">
                <input
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleInputChange}
                  placeholder="Logradouro"
                  className="col-span-3 p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 w-full bg-white"
                />
                <input
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="Nº"
                  className="col-span-1 p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 w-full bg-white"
                />
              </div>
              <input
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                placeholder="Bairro"
                className="w-full p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 bg-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                  className="p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 bg-white"
                />
                <input
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="UF"
                  className="p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 bg-white"
                />
              </div>

              <input
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                placeholder="Complemento (Opcional)"
                className="w-full p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 bg-white"
              />
              <input
                name="pontoReferencia"
                value={formData.pontoReferencia}
                onChange={handleInputChange}
                placeholder="Ponto de Referência"
                className="w-full p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-600 rounded-2xl text-slate-900 bg-white"
              />
            </div>
          </div>

          <div className="h-24"></div>
        </form>
      </div>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 w-full bg-white p-4 border-t border-slate-200 z-20 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full max-w-2xl mx-auto block bg-slate-900 text-white font-bold p-4 rounded-2xl disabled:opacity-50 hover:bg-slate-800 transition-colors shadow-md"
        >
          {loading ? "Enviando Chamado..." : "Enviar Denúncia"}
        </button>
      </div>
    </main>
  );
}
