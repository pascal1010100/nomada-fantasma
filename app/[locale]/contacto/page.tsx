// app/contacto/page.tsx
import type { Metadata } from "next";
import ContactoClient from "../../components/contact/ContactoClient";

export const metadata: Metadata = {
  title: "Contacto | Nómada Fantasma - Conecta con Nuestro Equipo",
  description:
    "¿Tienes preguntas o necesitas asistencia? Nuestro equipo está listo para ayudarte. Envíanos un mensaje o únete a nuestra comunidad de nómadas digitales.",
  openGraph: {
    title: "Contacto | Nómada Fantasma - Conecta con Nuestro Equipo",
    description: "¿Tienes preguntas o necesitas asistencia? Nuestro equipo está listo para ayudarte. Envíanos un mensaje o únete a nuestra comunidad de nómadas digitales.",
    url: "https://nomadafantasma.com/contacto",
    siteName: "Nómada Fantasma",
    locale: "es_ES",
    type: "website",
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
