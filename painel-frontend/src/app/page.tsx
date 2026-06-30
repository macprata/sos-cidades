"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  MapPin,
  Activity,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Code,
  Sun,
  Moon,
} from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // === A MÁGICA DO DARK MODE ACONTECE AQUI ===
  // Este useEffect observa a variável isDarkMode e injeta a classe 'dark' direto na tag <html> do seu site.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const citySlides = [
    {
      url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
      title: "Mobilidade Urbana",
      subtitle: "Novas vias e recapeamento asfáltico em andamento.",
    },
    {
      url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2056&auto=format&fit=crop",
      title: "Iluminação Pública",
      subtitle: "100% de cobertura LED nos principais bairros.",
    },
    {
      url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1965&auto=format&fit=crop",
      title: "Praças e Parques",
      subtitle: "Revitalização de espaços de convivência.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === citySlides.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [citySlides.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === citySlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? citySlides.length - 1 : prev - 1));

  return (
    <main className="min-h-screen transition-colors duration-500 bg-white dark:bg-slate-950 relative text-slate-800 dark:text-slate-100 font-sans overflow-x-hidden">
      {/* Background Decorativo Glassmorphism Ajustado */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-100/50 dark:bg-cyan-900/20 rounded-full blur-[120px] transition-colors duration-500"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-blue-50/80 dark:bg-blue-900/20 rounded-full blur-[120px] transition-colors duration-500"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {/* O filtro invert ajuda se a logo for escura no modo noturno */}
          <Image
            src="/sos_cidades_logo.png"
            alt="SOS Cidades Logo"
            width={120}
            height={40}
            priority
            className="dark:brightness-200 dark:contrast-100 transition-all"
          />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/login"
            className="hidden md:flex font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
          >
            Login
          </Link>
          <Link
            href="/cadastro"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition flex items-center gap-2"
          >
            Cadastrar <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400 font-bold text-sm mb-8 transition-colors">
          <ShieldCheck size={18} /> Transparência e Participação Cidadã
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl transition-colors">
          A cidade que você quer, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
            feita por você.
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10 transition-colors">
          Identificou um problema no seu bairro? Comunique a prefeitura em
          segundos. Nossa plataforma inteligente direciona sua solicitação com
          geolocalização exata para as equipes responsáveis.
        </p>

        {/* Dashboard / Totalizadores */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-800 dark:text-white">
              12.450
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 text-center">
              Demandas Recebidas
            </span>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-green-600 dark:text-green-400">
              11.200
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 text-center">
              Demandas Resolvidas
            </span>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
              1.250
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 text-center">
              Em Andamento
            </span>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400">
              48h
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 text-center">
              Tempo Médio Resposta
            </span>
          </div>
        </div>

        <Link
          href="/cadastro"
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/20 hover:scale-105 transition-all flex items-center gap-3"
        >
          Abrir Nova Solicitação <ArrowRight size={22} />
        </Link>
      </section>

      {/* PASSO A PASSO INTERATIVO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 transition-colors">
            Como funciona na prática?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
            Selecione os passos abaixo e descubra a facilidade de usar o SOS
            Cidades.
          </p>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center transition-colors">
          <div className="flex-1 w-full space-y-4">
            <button
              onClick={() => setActiveStep(1)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${activeStep === 1 ? "border-cyan-500 bg-white dark:bg-slate-800 shadow-md" : "border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60"}`}
            >
              <h3
                className={`font-bold text-xl flex items-center gap-3 ${activeStep === 1 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300"}`}
              >
                <AlertCircle
                  className={
                    activeStep === 1 ? "text-cyan-500" : "text-slate-400"
                  }
                />{" "}
                1. Relate o Problema
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 ml-9">
                Tire uma foto do buraco, lâmpada queimada ou foco de lixo e
                descreva brevemente a situação.
              </p>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${activeStep === 2 ? "border-cyan-500 bg-white dark:bg-slate-800 shadow-md" : "border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60"}`}
            >
              <h3
                className={`font-bold text-xl flex items-center gap-3 ${activeStep === 2 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300"}`}
              >
                <MapPin
                  className={
                    activeStep === 2 ? "text-cyan-500" : "text-slate-400"
                  }
                />{" "}
                2. Geolocalização Automática
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 ml-9">
                Não sabe o CEP? Nosso sistema usa o GPS do seu celular para
                preencher o endereço exato instantaneamente.
              </p>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${activeStep === 3 ? "border-cyan-500 bg-white dark:bg-slate-800 shadow-md" : "border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60"}`}
            >
              <h3
                className={`font-bold text-xl flex items-center gap-3 ${activeStep === 3 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300"}`}
              >
                <Activity
                  className={
                    activeStep === 3 ? "text-cyan-500" : "text-slate-400"
                  }
                />{" "}
                3. Acompanhe a Solução
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 ml-9">
                Receba notificações no seu painel assim que a equipe da
                prefeitura iniciar e concluir o serviço.
              </p>
            </button>
          </div>

          <div className="flex-1 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl h-[400px] flex items-center justify-center relative overflow-hidden border border-slate-300 dark:border-slate-700 transition-colors">
            {activeStep === 1 && (
              <img
                src="https://images.unsplash.com/photo-1584462479590-7d722d7ba563?q=80&w=2070&auto=format&fit=crop"
                alt="Relatar problema"
                className="w-full h-full object-cover opacity-90 dark:opacity-70"
              />
            )}
            {activeStep === 2 && (
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-90 dark:opacity-70 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-2xl animate-bounce">
                  <MapPin
                    size={48}
                    className="text-cyan-600 dark:text-cyan-400"
                  />
                </div>
              </div>
            )}
            {activeStep === 3 && (
              <div className="p-8 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col gap-4 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Chamado #8829
                  </span>
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                    Concluído
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="flex items-center gap-2 mt-4 text-green-600 dark:text-green-400 font-bold text-sm">
                    <CheckCircle2 size={18} /> Serviço finalizado pela equipe.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SLIDER DE FOTOS */}
      <section className="relative z-10 w-full py-12 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black mb-2">
              Sua cidade em movimento
            </h2>
            <p className="text-slate-400">
              Trabalhando diariamente por uma infraestrutura melhor.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          {citySlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-10">
                <div>
                  <h3 className="text-4xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-xl text-slate-300">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 transition-colors">
            Acompanhe as Melhorias
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
            Últimas notícias e atualizações baseadas nas solicitações dos
            cidadãos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1541888052136-15065fa316d9?q=80&w=2069&auto=format&fit=crop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Asfalto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent p-8 flex flex-col justify-end">
              <span className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3">
                Infraestrutura
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Operação Tapa-Buracos avança na Zona de Expansão
              </h3>
              <p className="text-slate-300 line-clamp-2">
                Mais de 450 solicitações do SOS Cidades foram atendidas apenas
                esta semana com novo recapeamento asfáltico.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 relative rounded-[2rem] overflow-hidden group shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1577700599572-132d73f4e85f?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Iluminação"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-6 flex flex-col justify-end">
              <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full w-max mb-2">
                Iluminação
              </span>
              <h3 className="text-xl font-bold text-white">
                Revitalização da Orla de Atalaia: 100% LED
              </h3>
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden group shadow-lg bg-gradient-to-br from-cyan-600 to-blue-600 p-6 flex flex-col justify-between">
            <Activity className="text-white opacity-30" size={48} />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Tempo de Resposta Caiu!
              </h3>
              <p className="text-cyan-100 text-sm">
                O uso do aplicativo reduziu o tempo de espera de 15 dias para
                48h.
              </p>
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden group shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1551608693-559d185e3323?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Saneamento"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-white">
                Manutenção Preventiva de Bueiros e Galerias
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 pt-16 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <Image
                src="/sos_cidades_logo.png"
                alt="SOS Cidades Logo"
                width={140}
                height={45}
                className="mb-4 dark:brightness-200 dark:contrast-100 transition-all"
              />
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                O canal de comunicação definitivo entre o cidadão e o poder
                público. Transparência, agilidade e inteligência geográfica a
                favor da sua cidade.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">
                Acesso Rápido
              </h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li>
                  <Link
                    href="/painel/denuncia"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    Fazer Denúncia
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    Acompanhar Protocolo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cadastro"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    Criar Conta
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    Estatísticas Públicas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">
                Precisa de Ajuda?
              </h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> Central de Atendimento
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} /> Seg a Sex, 08h às 18h
                </li>
                <li className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold mt-4">
                  <MessageCircle size={16} /> WhatsApp: (79) 99999-9999
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 dark:text-slate-500 transition-colors">
            <p>
              &copy; {new Date().getFullYear()} SOS Cidades. Todos os direitos
              reservados.
            </p>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
              <Code size={16} className="text-cyan-600 dark:text-cyan-400" />
              <span>
                Desenvolvido com excelência por{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  Mac Prata
                </strong>{" "}
                &bull;{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  3Tecnos
                </strong>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/5579999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl shadow-green-900/30 hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="Suporte via WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute right-16 bg-slate-900 dark:bg-slate-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Dúvidas? Fale Conosco
        </span>
      </a>
    </main>
  );
}
