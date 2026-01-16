
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  Gavel, 
  Users, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Mail, 
  ArrowRight,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import Assistant from './components/Assistant';
import Hero from './components/Hero';
import Services from './components/Services';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { AssistantProvider } from './contexts/AssistantContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Servicios', href: '#services' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Equipo', href: '#team' },
    { name: 'Contacto', href: '#contact' },
  ];

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
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-200 hover:text-red-500 px-1 py-2 text-sm font-semibold transition-all relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all hover:after:w-full"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-900/40 hover:-translate-y-0.5"
              >
                Consulta Gratuita
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-red-600 text-white' : 'text-white hover:bg-white/10'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 z-[-1] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>

      {/* Mobile menu content */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl transition-all duration-500 ease-in-out transform origin-top ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
        <div className="px-4 py-8 space-y-2 flex flex-col items-center">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${index * 75}ms` }}
              className={`w-full text-center text-slate-300 hover:text-white py-4 text-xl font-serif font-medium transition-all transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
            >
              {link.name}
            </a>
          ))}
          <div className={`w-full pt-6 transform transition-all duration-500 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <a 
              href="#contact" 
              onClick={() => setIsOpen(false)}
              className="bg-red-700 text-white block w-full py-5 rounded-2xl text-center text-lg font-bold shadow-2xl shadow-red-900/20 active:scale-95 transition-transform"
            >
              Agendar Cita Ahora
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="relative">
      <div id="home">
        <Hero />
      </div>

      <section id="about" className="py-24 bg-white relative overflow-hidden">
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

      <section id="services">
        <Services />
      </section>

      <section id="team">
        <Team />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
      
      {/* AI Assistant Float */}
      <Assistant />
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
