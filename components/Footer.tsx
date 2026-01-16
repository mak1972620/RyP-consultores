
import React from 'react';
import { Scale, Facebook, Globe, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Scale className="h-8 w-8 text-red-600" />
              <span className="text-white font-serif text-2xl font-bold">R&P <span className="text-slate-500 font-light">Abogados</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Lexmarcorp: Justicia con visión judicial. Especialistas en derecho penal estratégico en el estado de Coahuila.
            </p>
            <div className="flex gap-4">
              <a href="https://lexmarcorp.webnode.es" target="_blank" className="p-2 bg-slate-900 hover:bg-red-700 rounded-full transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="https://wa.me/528771658515" className="p-2 bg-slate-900 hover:bg-green-700 rounded-full transition-colors"><MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Oficinas</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col">
                <span className="text-white font-bold">Ciudad Acuña</span>
                <span>877 165 85 15</span>
              </li>
              <li className="flex flex-col">
                <span className="text-white font-bold">Monclova</span>
                <span>Atención previa cita</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="https://lexmarcorp.webnode.es" className="hover:text-red-500">Sitio Oficial</a></li>
              <li><a href="#home" className="hover:text-red-500">Aviso de Privacidad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contacto Directo</h4>
            <p className="text-xs mb-2">Lic. Abraham Rodríguez:</p>
            <p className="text-red-500 text-lg font-bold mb-4">+52 844 213 3129</p>
            <p className="text-xs mb-2">WhatsApp Acuña:</p>
            <p className="text-red-500 text-lg font-bold">877 165 85 15</p>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-900 text-center text-[10px] text-slate-500">
          <p>© 2026 R&P Abogados / Lexmarcorp. Coahuila, México.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
