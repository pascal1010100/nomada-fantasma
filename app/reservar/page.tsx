// app/reservar/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, ArrowLeft, Globe, User, Briefcase, Compass, Map, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const travelTypes = [
  {
    id: 'guide',
    name: 'Guía Local',
    icon: User,
    description: 'Conecta con un guía local experto que te mostrará los secretos mejor guardados del destino',
    color: 'from-indigo-500 to-cyan-400',
    features: [
      'Guías certificados locales',
      'Rutas fuera de lo común',
      'Experiencias auténticas',
      'Flexibilidad horaria'
    ],
    formFields: {
      experience: {
        label: 'Tipo de experiencia',
        type: 'select',
        options: ['Tour cultural', 'Gastronomía local', 'Aventura', 'Historia y cultura', 'Personalizado'],
        required: true
      },
      duration: {
        label: 'Duración',
        type: 'select',
        options: ['2 horas', '4 horas', '6 horas', 'Día completo', 'Personalizado'],
        required: true
      }
    }
  },
  {
    id: 'agency',
    name: 'Agencia de Viajes',
    icon: Briefcase,
    description: 'Reserva con una agencia local que organizará toda tu experiencia de viaje',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Paquetes todo incluido',
      'Transporte incluido',
      'Alojamiento seleccionado',
      'Asistencia 24/7'
    ],
    formFields: {
      packageType: {
        label: 'Tipo de paquete',
        type: 'select',
        options: ['Aventura', 'Cultural', 'Playa', 'Gourmet', 'Lujo', 'Personalizado'],
        required: true
      },
      travelers: {
        label: 'Número de viajeros',
        type: 'number',
        min: 1,
        max: 20,
        required: true
      },
      budget: {
        label: 'Presupuesto por persona',
        type: 'select',
        options: ['Económico', 'Estándar', 'Premium', 'Lujo'],
        required: true
      }
    }
  },
  {
    id: 'adventure',
    name: 'Aventura Personalizada',
    icon: Compass,
    description: 'Diseña tu propia aventura con la ayuda de expertos locales',
    color: 'from-amber-500 to-orange-500',
    features: [
      'Diseño a tu medida',
      'Experiencias únicas',
      'Flexibilidad total',
      'Asesoría personalizada'
    ],
    formFields: {
      interests: {
        label: 'Tus intereses',
        type: 'multiselect',
        options: ['Aventura', 'Cultura', 'Gastronomía', 'Naturaleza', 'Fotografía', 'Historia', 'Arte', 'Música'],
        required: true
      },
      travelStyle: {
        label: 'Estilo de viaje',
        type: 'select',
        options: ['Mochilero', 'Confort', 'Lujo', 'Familiar', 'Romántico', 'Solo viajero'],
        required: true
      },
      specialRequirements: {
        label: 'Requisitos especiales',
        type: 'textarea',
        placeholder: 'Alergias alimenticias, movilidad reducida, preferencias dietéticas...',
        required: false
      }
    }
  },
];

export default function ReservaPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'type' | 'details' | 'confirm'>('type');
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const selectedTypeData = travelTypes.find(type => type.id === selectedType);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const renderFormFields = () => {
    if (!selectedTypeData) return null;
    
    return Object.entries(selectedTypeData.formFields).map(([key, field]) => {
      const inputId = `${selectedType}-${key}`;
      
      switch (field.type) {
        case 'select':
          return (
            <div key={key} className="mb-4">
              <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                id={inputId}
                value={formData[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                required={field.required}
              >
                <option value="">Selecciona una opción</option>
                {field.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
          
        case 'multiselect':
          const selectedValues = formData[key] || [];
          
          return (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {field.options.map((option: string) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option]
                          : selectedValues.filter((v: string) => v !== option);
                        handleInputChange(key, newValues);
                      }}
                      className="h-4 w-4 text-cyberPurple focus:ring-cyberPurple border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          );
          
        case 'number':
          return (
            <div key={key} className="mb-4">
              <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                id={inputId}
                min={field.min}
                max={field.max}
                value={formData[key] || ''}
                onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                required={field.required}
              />
            </div>
          );
          
        case 'textarea':
          return (
            <div key={key} className="mb-4">
              <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id={inputId}
                rows={3}
                value={formData[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={field.placeholder || ''}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                required={field.required}
              />
            </div>
          );
          
        default:
          return null;
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyberPurple dark:hover:text-electricBlue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyberPurple to-indigo-600 p-6 text-white">
            <div className="flex items-center">
              <Globe className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Tu Aventura Nómada</h1>
                <p className="mt-1 opacity-90 text-sm">Conectamos viajeros con experiencias auténticas</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {currentStep === 'type' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Elige tu tipo de experiencia</h2>
                  <p className="text-gray-600 dark:text-gray-300">Selecciona cómo quieres vivir tu aventura nómada</p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {travelTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left h-full flex flex-col ${
                        selectedType === type.id
                          ? `border-cyberPurple bg-gradient-to-br ${type.color}/5 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900`
                          : 'border-gray-200 dark:border-gray-700 hover:border-cyberPurple/50 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-xl ${
                          selectedType === type.id 
                            ? `bg-gradient-to-br ${type.color} text-white` 
                            : 'bg-gray-100 dark:bg-gray-700 text-cyberPurple'
                        }`}>
                          <type.icon className="w-6 h-6" />
                        </div>
                        <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">{type.name}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{type.description}</p>
                      <div className="mt-3 space-y-2">
                        {type.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <svg 
                              className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${
                                selectedType === type.id 
                                  ? `text-${type.color.split(' ')[0].replace('from-', '')}`
                                  : 'text-cyberPurple'
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center`}>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyberPurple/10 text-cyberPurple dark:bg-cyberPurple/20">
                          {type.id === 'guide' ? 'Experiencia local' : type.id === 'agency' ? 'Todo incluido' : 'A tu medida'}
                        </span>
                        {selectedType === type.id && (
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={!selectedType}
                    onClick={() => setCurrentStep('details')}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                      selectedType
                        ? 'bg-cyberPurple hover:bg-cyberPurple/90'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 'details' && (
              <form className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center mb-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('type')}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-3 transition-colors"
                      aria-label="Volver a selección de tipo"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedTypeData?.name}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Completa los detalles de tu {selectedTypeData?.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyberPurple/5 to-indigo-500/5 dark:from-cyberPurple/10 dark:to-indigo-500/10 p-6 rounded-xl mb-8 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {selectedTypeData?.id === 'guide' && 'Detalles de tu experiencia con guía local'}
                      {selectedTypeData?.id === 'agency' && 'Tu viaje soñado'}
                      {selectedTypeData?.id === 'adventure' && 'Diseña tu aventura'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedTypeData?.id === 'guide' && 'Completa los detalles para conectarte con el guía local perfecto para ti.'}
                      {selectedTypeData?.id === 'agency' && 'Cuéntanos sobre el viaje que tienes en mente y te ayudaremos a hacerlo realidad.'}
                      {selectedTypeData?.id === 'adventure' && 'Personaliza cada detalle de tu próxima aventura con nuestra ayuda experta.'}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fecha de inicio
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            value={formData.startDate || ''}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hora de inicio
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            value={formData.startTime || ''}
                            onChange={(e) => handleInputChange('startTime', e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            required
                          >
                            <option value="">Selecciona una hora</option>
                            {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
                              <option key={time} value={time}>
                                {time} hrs
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número de viajeros
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            value={formData.travelers || ''}
                            onChange={(e) => handleInputChange('travelers', e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            required
                          >
                            <option value="1">1 viajero</option>
                            <option value="2">2 viajeros</option>
                            <option value="3">3 viajeros</option>
                            <option value="4">4 viajeros</option>
                            <option value="5">5 viajeros</option>
                            <option value="6">6 viajeros</option>
                            <option value="7">7 viajeros</option>
                            <option value="8">8 viajeros</option>
                            <option value="9">Grupo (9-15 viajeros)</option>
                            <option value="16">Grupo grande (16+ viajeros)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Destino o ubicación
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={formData.destination || ''}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                            placeholder="¿A dónde te diriges?"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Dynamic form fields based on selected type */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        {selectedTypeData?.id === 'guide' && 'Sobre tu experiencia con guía'}
                        {selectedTypeData?.id === 'agency' && 'Detalles de tu viaje'}
                        {selectedTypeData?.id === 'adventure' && 'Personaliza tu aventura'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderFormFields()}
                      </div>
                      
                      {selectedTypeData?.id === 'agency' && (
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Tipo de alojamiento
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {['Hostal', 'Hotel', 'Boutique', 'Ecolodge', 'Lujo', 'Otro'].map((type) => (
                              <label key={type} className="flex items-center">
                                <input
                                  type="radio"
                                  name="accommodation"
                                  value={type}
                                  checked={formData.accommodation === type}
                                  onChange={() => handleInputChange('accommodation', type)}
                                  className="h-4 w-4 text-cyberPurple focus:ring-cyberPurple border-gray-300 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
                
                {/* Contact Information */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Información de contacto
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {selectedTypeData?.id === 'guide' 
                        ? 'Completa tus datos para que el guía se ponga en contacto contigo y coordinen los detalles.'
                        : 'Déjanos tus datos para enviarte una propuesta personalizada.'}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número de WhatsApp (con código de país)
                        </label>
                        <input
                          type="tel"
                          placeholder="+52 1 55 1234 5678"
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nacionalidad
                        </label>
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Selecciona tu país</option>
                          <option value="MX">México</option>
                          <option value="US">Estados Unidos</option>
                          <option value="ES">España</option>
                          <option value="AR">Argentina</option>
                          <option value="CO">Colombia</option>
                          <option value="OTRO">Otro</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cuéntanos sobre tu viaje (opcional)
                      </label>
                      <textarea
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyberPurple focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="¿Qué tipo de experiencia estás buscando? ¿Alguna preferencia o requisito especial?"
                      />
                    </div>
                    
                    <div className={`mt-8 p-6 rounded-xl ${
                      selectedTypeData?.id === 'guide' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500' :
                      selectedTypeData?.id === 'agency' ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500' :
                      'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                    }`}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg 
                            className={`h-6 w-6 ${
                              selectedTypeData?.id === 'guide' ? 'text-indigo-500' :
                              selectedTypeData?.id === 'agency' ? 'text-purple-500' : 'text-amber-500'
                            }`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {selectedTypeData?.id === 'guide' && '¿Qué esperar después de enviar?'}
                            {selectedTypeData?.id === 'agency' && 'Proceso de reserva'}
                            {selectedTypeData?.id === 'adventure' && 'Sobre tu aventura personalizada'}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedTypeData?.id === 'guide' && 'Recibirás un correo de confirmación con los datos de contacto de tu guía local en menos de 24 horas. Podrás coordinar directamente con él/ella los detalles finales de tu experiencia.'}
                            {selectedTypeData?.id === 'agency' && 'Uno de nuestros expertos en viajes revisará tu solicitud y te enviará una propuesta personalizada en menos de 24 horas. Sin compromisos.'}
                            {selectedTypeData?.id === 'adventure' && 'Nuestro equipo de expertos en aventuras analizará tus preferencias y te enviará un itinerario personalizado en menos de 24 horas. Sin compromisos.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit button */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('type')}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple transition-colors"
                      >
                        Atrás
                      </button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-cyberPurple to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple transition-all shadow-lg hover:shadow-xl hover:shadow-cyberPurple/20"
                      >
                        Enviar solicitud de viaje
                      </motion.button>
                    </div>
                    
                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center">
                        <svg className="h-4 w-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Cancelación gratuita hasta 24 horas antes
                      </span>
                    </p>
                  </div>
              </form>
            )}
            
            {currentStep === 'confirm' && (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">¡Solicitud enviada con éxito!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Hemos recibido tu solicitud de viaje.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID de solicitud: TRVL-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                
                <div className="mt-8 max-w-md mx-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">¿Qué sigue?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-cyberPurple">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Revisa tu correo electrónico para confirmar los detalles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-cyberPurple">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Un experto local se pondrá en contacto contigo en menos de 24 horas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-cyberPurple">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Personaliza tu experiencia según tus preferencias</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <Link
                      href="/"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyberPurple hover:bg-cyberPurple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple"
                    >
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>¿Necesitas ayuda? <a href="mailto:hola@nomadafantasma.com" className="text-cyberPurple hover:underline">Contáctanos</a></p>
          <p className="mt-1">© {new Date().getFullYear()} Nómada Fantasma. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
