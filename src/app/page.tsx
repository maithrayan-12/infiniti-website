import Contact from "@/components/Contact";
import Difference from "@/components/Difference";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Interactions from "@/components/Interactions";
import Manifesto from "@/components/Manifesto";
import Marquee from "@/components/Marquee";
import Preloader from "@/components/Preloader";
import Process from "@/components/Process";
import Savings from "@/components/Savings";
import { SectionDots } from "@/components/ScrollUI";
import Services from "@/components/Services";
import { Faq, Industries } from "@/components/Sections";
import SmoothScroll from "@/components/SmoothScroll";
import { Sprite } from "@/components/Sprite";

export default function Home() {
  return (
    <>
      <Sprite />
      <Preloader />
      <SmoothScroll />
      <Interactions />
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>

      <Header />
      <SectionDots />

      <main id="main">
        <Hero />
        <Marquee />
        <Manifesto />
        <Services />
        <Process />
        <Difference />
        <Savings />
        <Industries />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
