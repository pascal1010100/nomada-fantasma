// app/contacto/page.tsx
import type { Metadata } from "next";
import ContactoClient from "../components/contact/ContactoClient";

export const metadata: Metadata = {
  title: "Contacto | Nómada Fantasma",
  description:
    "Hablemos: suscripción a novedades, enlaces rápidos, navegación y redes — todo en un solo lugar.",
};

export default function ContactoPage() {
  return <ContactoClient />;
}
