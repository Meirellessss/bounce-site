import { Header } from "@/components/Header";
import { Showcase } from "@/components/Showcase";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950">
      <Header />
      <Showcase />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
