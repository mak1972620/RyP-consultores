
import React from 'react';
import { Phone, Award, ShieldCheck, User, Scale } from 'lucide-react';

const Team: React.FC = () => {
  const members = [
    {
      name: 'Lic. Abraham Rodríguez',
      role: 'Ex Juez Penal - Socio Director',
      description: 'Especialista de alto nivel en el sistema penal acusatorio. Su trayectoria como Juez Penal le otorga una perspectiva única para anticipar criterios judiciales y diseñar defensas técnicas inexpugnables.',
      specialties: ['Derecho Penal', 'Estrategia Judicial', 'Amparo'],
      phone: '+52 844 213 3129'
    },
    {
      name: 'Lic. Marco Antonio Perales Perchez',
      role: 'Socio Especialista',
      description: 'Experto en consultoría legal integral, derecho civil y familiar. Su enfoque en Lexmarcorp se centra en la protección patrimonial y la resolución efectiva de conflictos complejos con un alto estándar ético.',
      specialties: ['Derecho Civil', 'Familiar', 'Corporativo'],
      phone: '+52 877 165 8515'
    }
  ];

  return (
    <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-red-900/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-slate-800/20 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-red-500" />
              <h4 className="text-red-500 font-bold tracking-widest uppercase text-xs">Liderazgo y Experiencia</h4>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Nuestros Socios Fundadores</h2>
            <p className="text-slate-400 text-lg border-l-4 border-red-600 pl-6 italic">
              "La excelencia en la defensa nace del conocimiento profundo del tribunal."
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {members.map((member, index) => (
            <div 
              key={index} 
              className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl p-8 md:p-12 border border-slate-700/50 hover:border-red-600/40 transition-all duration-500 backdrop-blur-sm flex flex-col items-start"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl text-red-600 group-hover:scale-110 transition-transform duration-500">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white group-hover:text-red-400 transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="h-4 w-4 text-red-500" />
                    <p className="text-red-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-slate-400 leading-relaxed text-sm md:text-base font-light mb-8">
                  {member.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((s, i) => (
                    <span key={i} className="text-[9px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300 uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto w-full pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <a 
                  href={`tel:${member.phone.replace(/\s/g, '')}`} 
                  className="flex items-center gap-3 text-sm font-bold text-slate-300 hover:text-white transition-all bg-slate-950/50 px-6 py-3 rounded-xl border border-slate-700/30 hover:bg-red-900/20"
                >
                  <Phone className="h-4 w-4 text-red-600" />
                  {member.phone}
                </a>
                
                <div className="hidden lg:flex items-center gap-2 text-slate-600">
                  <Scale className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Lexmarcorp Coahuila</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
