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
    setLoading(true);

    const dataToSend = new FormData();

    // Adiciona todos os campos de texto do formData
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, String(value));
    });

    // Adiciona a imagem, se existir
    if (imageFile) {
      dataToSend.append("file", imageFile);
    }

    try {
      // Fazendo o POST real para a sua API
      await api.post("/denuncias", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          // O token de autorização (Bearer) já deve estar configurado na sua instância do 'api'
        },
      });

      toast.success("Denúncia registrada com sucesso!");
      router.push("/painel");
    } catch (error) {
      console.error("Erro no envio:", error);
      toast.error("Erro ao salvar a denúncia. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-slate-800">Nova Denúncia</span>
        </div>
        <Image src="/sos_cidades_logo.png" alt="Logo" width={80} height={25} />
      </header>

      {/* Conteúdo */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Categoria
            </label>
            <select
              name="categoriaId"
              className="w-full p-4 border border-slate-200 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
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
              className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 h-32 text-slate-900"
              placeholder="Descreva os detalhes do problema..."
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Foto do Problema
            </label>
            <label className="block border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer p-4 hover:bg-slate-50">
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
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="py-10 text-slate-400 flex flex-col items-center">
                  <Upload size={24} />{" "}
                  <span className="mt-2 font-medium">Anexar Imagem</span>
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
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Dados do Endereço</h3>
              {/* Botão de Preenchimento Automático / Captura de GPS */}
              <button
                type="button"
                onClick={capturarLocalizacao}
                className="text-cyan-600 flex items-center gap-1 font-bold bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition"
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
                className="w-full p-4 border rounded-2xl text-slate-900"
              />
              <div className="grid grid-cols-4 gap-2">
                <input
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleInputChange}
                  placeholder="Logradouro"
                  className="col-span-3 p-4 border rounded-2xl text-slate-900 w-full"
                />
                <input
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="Nº"
                  className="col-span-1 p-4 border rounded-2xl text-slate-900 w-full"
                />
              </div>
              <input
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                placeholder="Bairro"
                className="w-full p-4 border rounded-2xl text-slate-900"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                  className="p-4 border rounded-2xl text-slate-900"
                />
                <input
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="UF"
                  className="p-4 border rounded-2xl text-slate-900"
                />
              </div>

              <input
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                placeholder="Complemento (Opcional)"
                className="w-full p-4 border rounded-2xl text-slate-900"
              />
              <input
                name="pontoReferencia"
                value={formData.pontoReferencia}
                onChange={handleInputChange}
                placeholder="Ponto de Referência"
                className="w-full p-4 border rounded-2xl text-slate-900"
              />
            </div>
          </div>

          <div className="h-24"></div>
        </form>
      </div>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 w-full bg-white p-4 border-t border-slate-200 z-20">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold p-4 rounded-2xl disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar Denúncia"}
        </button>
      </div>
    </main>
  );
}
