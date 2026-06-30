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
  MessageCircle, // <-- Novo ícone
  Send, // <-- Novo ícone
} from "lucide-react";
import api from "../../../../services/api"; // Ajuste o caminho conforme necessário
import { toast } from "sonner";

export default function DetalhesDenuncia() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [denuncia, setDenuncia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // === NOVOS ESTADOS PARA A MENSAGEM ===
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Extraímos o fetch para poder chamá-lo novamente após enviar uma mensagem
  const fetchDetalhes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get(`/denuncias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDenuncia(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      toast.error("Não foi possível carregar os detalhes da denúncia.");
      router.push("/painel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetalhes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  // === FUNÇÃO PARA ENVIAR A NOVA MOVIMENTAÇÃO ===
  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    setEnviando(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/denuncias/${id}/movimentacoes`,
        {
          mensagem: novaMensagem,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Mensagem enviada com sucesso!");
      setNovaMensagem(""); // Limpa o campo
      fetchDetalhes(); // Recarrega os dados para mostrar a nova mensagem na tela
    } catch (error) {
      console.error("Erro ao enviar movimentação:", error);
      toast.error("Erro ao enviar mensagem.");
    } finally {
      setEnviando(false);
    }
  };

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
    // Aumentamos o pb-32 para a barra de mensagem não cobrir o conteúdo do final
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Header Fixo */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
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
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
              <AlignLeft className="text-cyan-600" size={20} /> Relato do
              Cidadão
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {denuncia.descricao}
            </p>
          </div>

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
            </div>
          </div>
        </div>

        {/* === NOVA SEÇÃO: TIMELINE DE MOVIMENTAÇÕES === */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
            <MessageCircle className="text-cyan-600" size={20} /> Histórico de
            Atualizações
          </h3>

          <div className="space-y-6">
            {!denuncia.movimentacoes || denuncia.movimentacoes.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">
                Nenhuma movimentação registrada ainda.
              </p>
            ) : (
              denuncia.movimentacoes.map((mov: any) => (
                <div
                  key={mov.id}
                  className="relative pl-6 border-l-2 border-slate-100"
                >
                  <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                  <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-slate-800">
                        {mov.usuario?.nome}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(mov.dataCriacao).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap">
                      {mov.mensagem}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* === NOVA SEÇÃO: FORMULÁRIO FIXO NO RODAPÉ === */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <form
          onSubmit={handleEnviarMensagem}
          className="max-w-3xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Adicionar nova informação ou resposta..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-cyan-600 text-slate-700"
            disabled={enviando}
          />
          <button
            type="submit"
            disabled={!novaMensagem.trim() || enviando}
            className="bg-slate-900 text-white p-3 md:px-6 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-md"
          >
            <span className="hidden md:block">
              {enviando ? "Enviando..." : "Enviar"}
            </span>
            <Send size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}
