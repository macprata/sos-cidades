"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  AlignLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../../../../services/api"; // Ajuste o caminho do import da sua API conforme necessário
import { toast } from "sonner";

export default function DetalhesDenuncia() {
  const router = useRouter();
  const params = useParams(); // Pega o ID da URL
  const { id } = params;

  const [denuncia, setDenuncia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Busca os dados da denúncia específica pelo ID
        const response = await api.get(`/denuncias/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDenuncia(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        toast.error("Não foi possível carregar os detalhes da denúncia.");
        router.push("/painel"); // Volta pro painel se der erro
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetalhes();
    }
  }, [id, router]);

  // Função para renderizar um badge de status bonitinho
  const renderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case "RESOLVIDO":
        return (
          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 size={14} /> Resolvido
          </div>
        );
      case "EM_ANDAMENTO":
        return (
          <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            <Clock size={14} /> Em Andamento
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle size={14} /> Em Análise
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!denuncia) return null;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header Fixo */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-slate-800">
            Protocolo #{denuncia.id}
          </span>
        </div>
        <Image src="/sos_cidades_logo.png" alt="Logo" width={80} height={25} />
      </header>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Cabeçalho da Denúncia */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {denuncia.categoria?.nome || "Categoria não informada"}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar size={16} />{" "}
                {new Date(denuncia.dataCriacao).toLocaleDateString("pt-BR")}
              </span>
              {denuncia.anonima && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Tag size={16} /> Relato Anônimo
                </span>
              )}
            </div>
          </div>
          {renderStatus(denuncia.status)}
        </div>

        {/* Imagem da Denúncia (Se houver) */}
        {denuncia.imagemUrl && (
          <div className="w-full h-64 md:h-80 relative rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src={denuncia.imagemUrl}
              alt="Foto do local"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bento Grid para as Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card de Descrição */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
              <AlignLeft className="text-cyan-600" size={20} /> Relato do
              Cidadão
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {denuncia.descricao}
            </p>
          </div>

          {/* Card de Localização */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <MapPin className="text-cyan-600" size={20} /> Localização
              </h3>
              {denuncia.latitude && denuncia.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${denuncia.latitude},${denuncia.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition"
                >
                  Abrir no Maps
                </a>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <strong className="text-slate-800">Endereço:</strong>{" "}
                {denuncia.logradouro}
                {denuncia.numero ? `, ${denuncia.numero}` : ""}
              </p>
              {denuncia.complemento && (
                <p>
                  <strong className="text-slate-800">Complemento:</strong>{" "}
                  {denuncia.complemento}
                </p>
              )}
              <p>
                <strong className="text-slate-800">Bairro:</strong>{" "}
                {denuncia.bairro} - {denuncia.cep}
              </p>
              <p>
                <strong className="text-slate-800">Cidade/UF:</strong>{" "}
                {denuncia.cidade} / {denuncia.estado}
              </p>
              {denuncia.pontoReferencia && (
                <p className="mt-2 text-amber-700 bg-amber-50 p-2 rounded-lg inline-block border border-amber-100">
                  <strong className="block text-xs uppercase mb-1">
                    Ponto de Referência:
                  </strong>
                  {denuncia.pontoReferencia}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
