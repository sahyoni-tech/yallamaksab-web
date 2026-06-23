import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { ValueStrip } from "../components/landing/ValueStrip";
import { ForShoppers } from "../components/landing/ForShoppers";
import { ForShops } from "../components/landing/ForShops";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Download } from "../components/landing/Download";
import { Contact } from "../components/landing/Contact";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <ValueStrip />
      <ForShoppers />
      <ForShops />
      <HowItWorks />
      <Download />
      <Contact />
      <Footer />
    </>
  );
}
