
import React, { useState } from 'react';
import { Gavel, ShieldAlert, Users, FileText, CheckCircle2, Share2, Check } from 'lucide-react';

const services = [
  {
    id: 'defensa-penal',
    title: 'Defensa Penal',
    description: 'Representación estratégica en investigaciones iniciales, audiencias de vinculación, juicios orales y recursos de apelación o amparo.',
    icon: <Gavel className="h-10 w-10" />,
    features: ['Estrategia de litigio', 'Audiencias ante el Juez', 'Prevención de prisión preventiva']
  },
  {
    id: 'consultoria-penal',
    title: 'Consultoría Penal',
    description: 'Análisis de riesgos para empresas y particulares. Evaluación de carpetas de investigación para anticipar resultados judiciales.',
    icon: <ShieldAlert className="h-10 w-10" />,
    features: ['Compliance legal', 'Análisis técnico', 'Prevención de delitos']
  },
  {
    id: 'derecho-familiar',
    title: 'Derecho Familiar',
    description: 'Acompañamiento humano en procesos de divorcio, pensiones alimenticias, custodias y régimen de convivencias.',
    icon: <Users className="h-10 w-10" />,
    features: ['Convenios de divorcio', 'Pensiones justas', 'Protección al menor']
  },
  {
    id: 'asesoria-victimas',
    title: 'Asesoría a Víctimas',
    description: 'Representación legal integral para garantizar la reparación del daño y la justicia efectiva para las víctimas del delito.',
    icon: <FileText className="h-10 w-10" />,
    features: ['Reparación del daño', 'Coadyuvancia con MP', 'Medidas de protección']
  }
];

const Services: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = async (service: typeof services[0]) => {
    const shareData = {
      title: `R&P Abogados - ${service.title}`,
      text: `Conoce más sobre el servicio de ${service.title} de R&P Abogados.`,
      url: `${window.location.origin}${window.location.pathname}#services`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopiedId(service.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-4">Nuestra Especialidad</h4>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Áreas de Práctica</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-2 relative"
            >
              <div className="text-red-700 mb-6 transition-transform group-hover:scale-110 duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                {service.description}
              </p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-red-600" />
                    {feat}
                  </li>
                ))}
              </ul>
              
              <div className="pt-4 border-t border-slate-50 flex justify-end">
                <button 
                  onClick={() => handleShare(service)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    copiedId === service.id 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700 border-slate-200'
                  } border`}
                  title="Compartir este servicio"
                >
                  {copiedId === service.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Compartir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
