import React from "react";
// Importamos o componente diretamente da pasta features
import ListarDenuncias from "../../../features/denuncias/components/ListarDenuncias";

export const metadata = {
  title: "Minhas Denúncias | SOS Cidades",
  description: "Acompanhe todos os seus protocolos de denúncias",
};

export default function DenunciasPage() {
  return <ListarDenuncias />;
}
