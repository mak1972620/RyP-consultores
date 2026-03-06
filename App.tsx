

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Scale, 
  MessageCircle,
  Phone
} from 'lucide-react';
import Assistant from './components/Assistant';
import Hero from './components/Hero';
import Services from './components/Services';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { AssistantProvider } from './contexts/AssistantContext';
import ContactOptionsModal from './components/ContactOptionsModal'; // Import the new modal component

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWhatsApp = () => {
    window.open('https://wa.me/528771658515', '_blank');
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-serif text-2xl font-bold tracking-tight">R&P <span className="text-slate-400 font-light">Abogados</span></span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="tel:+528771658515" 
              className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors"
            >
              <Phone className="h-4 w-4 text-red-500" />
              +52 877 165 8515
            </a>
            <button 
              onClick={openWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-green-900/20 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // New state for contact modal

  return (
    <div className="relative">
      <Hero onConsultNowClick={() => setIsContactModalOpen(true)} /> {/* Pass handler to open modal */}

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800" 
                  alt="Law office meeting room" 
                  className="rounded-2xl shadow-2xl relative z-10 border-8 border-white"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-red-100 rounded-2xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-slate-100 rounded-full -z-10"></div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-4">Trayectoria y Confianza</h4>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">
                Justicia con Criterio Judicial y Sentido Humano
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                R&P Abogados nació de la visión compartida de ofrecer una defensa penal que no solo entiende el proceso, sino que anticipa los criterios judiciales. 
                Liderados por un ex Juez Penal, entendemos los mecanismos internos del sistema de justicia desde la raíz.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Nuestra misión es proteger su libertad y patrimonio mediante estrategias legales sofisticadas, basadas en la experiencia real en audiencias y juicios orales, así como en un profundo dominio del derecho civil y familiar.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                <div>
                  <h5 className="text-3xl font-serif text-slate-900 font-bold">15+</h5>
                  <p className="text-slate-500 font-medium">Años de Experiencia</p>
                </div>
                <div>
                  <h5 className="text-3xl font-serif text-slate-900 font-bold">500+</h5>
                  <p className="text-slate-500 font-medium">Casos Resueltos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Services />
      <Team />
      <Contact />
      <Footer />
      <Assistant />
      <ContactOptionsModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AssistantProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </AssistantProvider>
    </Router>
  );
};

export default App;
