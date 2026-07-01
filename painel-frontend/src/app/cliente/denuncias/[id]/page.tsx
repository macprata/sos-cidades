import React from "react";
import DetalheDenuncia from "../../../../features/denuncias/components/DetalheDenuncia";

export default async function Page({ params }: { params: { id: string } }) {
  // O Next.js (App Router) nos entrega o ID pelo params
  const { id } = await params;
  return <DetalheDenuncia id={id} />;
}
