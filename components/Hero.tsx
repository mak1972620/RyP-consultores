
import React from 'react';
import { ArrowRight, Shield, Scale } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
          alt="Justicia en Coahuila" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-500 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Monclova & Ciudad Acuña</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
            Defensa Penal con <span className="text-red-600">Criterio de Juez</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
            Liderados por el <strong>Lic. Abraham Rodríguez</strong> (Ex Juez Penal), ofrecemos una defensa técnica superior en todo Coahuila.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#contact" 
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-900/20"
            >
              Consultar ahora <ArrowRight className="h-5 w-5" />
            </a>
            <a 
              href="https://lexmarcorp.webnode.es" 
              target="_blank"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all"
            >
              Visitar Lexmarcorp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
