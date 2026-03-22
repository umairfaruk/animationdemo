'use client'

import { useState } from 'react'
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Showcase from "./components/Showcase";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import ContactModal from "./components/ContactModal";
import Footer from "./components/Footer";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Showcase />
      <About />
      <Testimonials />
      <Contact onOpen={() => setModalOpen(true)} />
      <Footer />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
