
import React from 'react';
import { Linkedin, Mail, Phone } from 'lucide-react';

const Team: React.FC = () => {
  const members = [
    {
      name: 'Lic. Abraham Rodríguez',
      role: 'Ex Juez Penal - Socio Director',
      description: 'Especialista de alto nivel en el sistema penal acusatorio. Su trayectoria como Juez Penal le otorga una perspectiva única para anticipar criterios judiciales y diseñar defensas técnicas inexpugnables.',
      image: 'https://files.oaiusercontent.com/file-6D1V8Hnd2zK5hXnE7m9S8S?se=2025-02-12T19%3A33%3A32Z&sp=r&sv=24.8.0&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Db6387063-7188-467f-8e43-16279fcc4cc8.webp&sig=G06Xz/V9tNf/8M0W1i8I9E/0eE%2BjV5/U/V6mGvP9TfM%3D', 
      specialties: ['Derecho Penal', 'Estrategia Judicial', 'Amparo'],
      phone: '+52 844 213 3129'
    },
    {
      name: 'Lic. Marco Antonio Perales Perchez',
      role: 'Socio Especialista',
      description: 'Experto en consultoría legal integral, derecho civil y familiar. Su enfoque en Lexmarcorp se centra en la protección patrimonial y la resolución efectiva de conflictos complejos con un alto estándar ético.',
      image: 'https://files.oaiusercontent.com/file-NAnwRkR7zS1X6fXjHn8m9S?se=2025-02-12T19%3A33%3A46Z&sp=r&sv=24.8.0&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dd9e2906e-2b5d-4f7f-a64d-9376f9d4e5f8.webp&sig=Z1%2B%2Bk4HnS0n5O9h8l8m9S/5pE%3D',
      specialties: ['Derecho Civil', 'Familiar', 'Corporativo'],
      phone: '877 165 85 15'
    }
  ];

  return (
    <div className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h4 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">Liderazgo Jurídico</h4>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Nuestros Socios</h2>
            <p className="text-slate-400 text-lg">Experiencia judicial y litigio estratégico al servicio de su tranquilidad legal en Coahuila.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-1 bg-red-600"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col lg:flex-row bg-slate-800/30 rounded-3xl overflow-hidden border border-slate-700 hover:border-red-600/50 transition-all group backdrop-blur-sm">
              <div className="lg:w-2/5 aspect-[3/4] lg:aspect-auto overflow-hidden bg-slate-800">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                />
              </div>
              <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-red-500 transition-colors">{member.name}</h3>
                  <p className="text-red-500 font-semibold text-sm mb-6 uppercase tracking-wider">{member.role}</p>
                  <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                    {member.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {member.specialties.map((s, i) => (
                      <span key={i} className="text-[10px] font-bold px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-slate-300 uppercase tracking-tighter">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6 border-t border-slate-700/50">
                  <a 
                    href={`tel:${member.phone.replace(/\s/g, '')}`} 
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-red-600" />
                    {member.phone}
                  </a>
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
