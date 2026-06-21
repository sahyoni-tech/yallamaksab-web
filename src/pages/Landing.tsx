import { Hero } from "../components/landing/Hero";
import { ForShoppers } from "../components/landing/ForShoppers";
import { ForShops } from "../components/landing/ForShops";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Download } from "../components/landing/Download";
import { Contact } from "../components/landing/Contact";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <>
      <Hero />
      <ForShoppers />
      <ForShops />
      <HowItWorks />
      <Download />
      <Contact />
      <Footer />
    </>
  );
}
