
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Bot, Sparkles, Globe, AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react';
// Corrected import path for ChatInterface
import ChatInterface from './ChatInterface'; 

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    phone: '',
    email: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (phone: string) => {
    if (!phone) return 'El teléfono es requerido';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) return 'Ingrese 10 dígitos numéricos';
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo es requerido';
    if (!emailRegex.test(email)) return 'Formato de correo inválido';
    return '';
  };

  const validateWebsite = (url: string) => {
    if (!url) return ''; // Campo opcional, pero si existe debe ser válido
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!urlRegex.test(url)) return 'Formato de URL inválido (ej. https://ejemplo.com)';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      setErrors(prev => ({ ...prev, phone: validatePhone(onlyNums) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'email') {
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      }
      if (name === 'website') {
        setErrors(prev => ({ ...prev, website: validateWebsite(value) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    const websiteError = validateWebsite(formData.website);

    if (phoneError || emailError || websiteError) {
      setErrors({ phone: phoneError, email: emailError, website: websiteError });
      return;
    }

    setIsSubmitting(true);
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Mensaje enviado con éxito. Un especialista de R&P Abogados le contactará pronto.');
    setFormData({ name: '', email: '', phone: '', website: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex gap-16">
          <div className="lg:w-1/3 mb-12 lg:mb-0">
            <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-4">Contacto</h4>
            <h2 className="text-4xl font-serif text-slate-900 mb-8 leading-tight">Agende su Consulta Legal</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-red-700">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Ubicaciones</h5>
                  <p className="text-slate-600">Monclova y Ciudad Acuña, Coahuila</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-red-700">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Teléfonos de Urgencia</h5>
                  <p className="text-slate-600 font-medium">Cd. Acuña: <a href="tel:+528771658515" className="hover:text-red-700">+52 877 165 8515</a></p>
                  <p className="text-slate-600 font-medium">Lic. Abraham R.: <a href="tel:8442133129" className="hover:text-red-700">+52 844 213 3129</a></p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-red-700">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Sitio Oficial</h5>
                  {/* FIX: Moved the <a> tag content and attributes from h5 to be a child of div */}
                  <a href="https://lexmarcorp.webnode.es" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline">
                    lexmarcorp.webnode.es
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-red-700">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Disponibilidad</h5>
                  <p className="text-slate-600">Atención 24/7 en Urgencias Penales</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 space-y-12">
            <div className="bg-slate-50 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                    <input 
                      name="name"
                      type="text" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono (10 dígitos)</label>
                    <div className="relative">
                      <input 
                        name="phone"
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all`}
                        placeholder="Ej. 8771658515"
                      />
                      {formData.phone.length === 10 && !errors.phone && <CheckCircle2 className="absolute right-3 top-3.5 h-5 w-5 text-green-600" />}
                      {errors.phone && <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-red-500" />}
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all`}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Sitio Web (Opcional)</label>
                    <div className="relative">
                      <input 
                        name="website"
                        type="text" 
                        value={formData.website}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.website ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all`}
                        placeholder="https://su-empresa.com"
                      />
                      {formData.website && !errors.website && <LinkIcon className="absolute right-3 top-3.5 h-5 w-5 text-green-600" />}
                      {errors.website && <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-red-500" />}
                    </div>
                    {errors.website && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.website}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resumen de su situación</label>
                  <textarea 
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all"
                    placeholder="¿En qué podemos ayudarle?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !!errors.phone || !!errors.email || !!errors.website}
                  className={`w-full ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'} text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg`}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'} <Send className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Consulta a nuestra IA</span>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl flex flex-col md:flex-row min-h-[500px]">
                <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-center">
                  <div className="p-3 bg-red-700 w-fit rounded-2xl mb-6">
                    <Bot className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4">Orientación Jurídica 24/7</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Inicie una conversación para recibir orientación preliminar sobre su caso de Derecho Mercantil Mexicano.
                  </p>
                </div>
                <div className="md:w-2/3 border-l border-slate-50">
                  <ChatInterface className="h-[500px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;