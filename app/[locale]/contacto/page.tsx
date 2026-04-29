// app/contacto/page.tsx
import type { Metadata } from "next";
import ContactoClient from "../../components/contact/ContactoClient";

export const metadata: Metadata = {
  title: "Contacto | Nómada Fantasma - Conecta con Nuestro Equipo",
  description:
    "¿Tienes preguntas o necesitas asistencia? Nuestro equipo está listo para ayudarte a planificar tu viaje por Guatemala.",
  openGraph: {
    title: "Contacto | Nómada Fantasma - Conecta con Nuestro Equipo",
    description: "¿Tienes preguntas o necesitas asistencia? Nuestro equipo está listo para ayudarte a planificar tu viaje por Guatemala.",
    url: "https://nomadafantasma.com/contacto",
    siteName: "Nómada Fantasma",
    locale: "es_ES",
    type: "website",
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
