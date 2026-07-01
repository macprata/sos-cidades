"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  MessageCircle,
  Send,
} from "lucide-react";
import api from "../../../services/api";
import { toast } from "sonner";

export default function DetalheDenuncia({ id }: { id: string }) {
  const router = useRouter();
  const [denuncia, setDenuncia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fetchDetalhes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/denuncias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDenuncia(response.data);
    } catch (error) {
      toast.error("Não foi possível carregar os detalhes.");
      router.push("/cliente/denuncias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetalhes();
  }, [id]);

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    setEnviando(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/denuncias/${id}/movimentacoes`,
        { mensagem: novaMensagem },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Mensagem enviada!");
      setNovaMensagem("");
      fetchDetalhes();
    } catch {
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      </div>
    );
  if (!denuncia) return null;

  return (
    <main className="min-h-screen bg-slate-50 pb-32 animate-in fade-in duration-500">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-slate-800">
            Denúncia #{denuncia.id}
          </span>
        </div>
        <Image
          src="/sos_cidades_logo.png"
          alt="Logo"
          width={80}
          height={25}
          style={{ width: "auto", height: "auto" }}
        />
      </header>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {denuncia.categoria?.nome}
            </h1>
            <div className="flex gap-3 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar size={16} />{" "}
                {new Date(denuncia.dataCriacao).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
          {renderStatus(denuncia.status)}
        </div>

        {denuncia.midiaUrl && (
          <div className="w-full h-64 md:h-80 relative rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src={denuncia.midiaUrl}
              alt="Foto"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bento Grid de Dados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
              <AlignLeft className="text-cyan-600" size={20} /> Relato
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {denuncia.descricao}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <MapPin className="text-cyan-600" size={20} /> Localização
              </h3>
              {denuncia.latitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${denuncia.latitude},${denuncia.longitude}`}
                  target="_blank"
                  className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition"
                >
                  Abrir no Maps
                </a>
              )}
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <strong>Endereço:</strong> {denuncia.logradouro},{" "}
                {denuncia.numero}
              </p>
              <p>
                <strong>Bairro:</strong> {denuncia.bairro} - {denuncia.cep}
              </p>
              <p>
                <strong>Cidade:</strong> {denuncia.cidade} / {denuncia.estado}
              </p>
              {denuncia.pontoReferencia && (
                <p>
                  <strong>Ref:</strong> {denuncia.pontoReferencia}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <MessageCircle size={20} className="text-cyan-600" /> Histórico de
            Atualizações
          </h3>
          {denuncia.movimentacoes?.map((mov: any) => (
            <div
              key={mov.id}
              className="mb-6 pl-6 border-l-2 border-slate-100 relative"
            >
              <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[7px] top-1"></div>
              <p className="text-xs font-bold text-slate-400">
                {mov.usuario?.nome} •{" "}
                {new Date(mov.dataCriacao).toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-slate-700 mt-1">{mov.mensagem}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <form
          onSubmit={handleEnviarMensagem}
          className="max-w-3xl mx-auto flex gap-3 items-center"
        >
          <input
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-cyan-600 text-slate-900 placeholder:text-slate-400 font-medium"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Responder..."
          />
          <button
            type="submit"
            disabled={enviando || !novaMensagem.trim()}
            className="bg-slate-900 text-white w-12 h-12 flex items-center justify-center rounded-full disabled:opacity-50 transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
      </div>
    </main>
  );
}
