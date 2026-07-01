import React from "react";
// Importamos o componente encapsulado da feature
import NovaDenuncia from "../../../../features/denuncias/components/NovaDenuncia";

export const metadata = {
  title: "Nova Denúncia | SOS Cidades",
  description: "Registre uma nova denúncia e ajude a melhorar onde você mora.",
};

export default function NovaDenunciaPage() {
  return <NovaDenuncia />;
}
