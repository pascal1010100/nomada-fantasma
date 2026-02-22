// app/reservar/ReservarClient.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, Globe, User, Briefcase, Compass, CheckCircle, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const travelTypes = [
    {
        id: 'guide',
        name: 'Guía Local',
        icon: User,
        description: 'Conecta con un guía local experto que te mostrará los secretos mejor guardados del destino',
        color: 'from-cyan-500 to-blue-500',
        glowColor: 'cyan',
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
        glowColor: 'purple',
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
        glowColor: 'amber',
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

const steps = [
    { id: 'type', label: 'Tipo', icon: Sparkles },
    { id: 'details', label: 'Detalles', icon: Calendar },
    { id: 'confirm', label: 'Confirmar', icon: CheckCircle }
];

export default function ReservarClient() {
    const [currentStep, setCurrentStep] = useState<'type' | 'details' | 'confirm'>('type');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    type FormDataValue = string | number | string[] | undefined;
    type FormDataState = {
        name: string;
        email: string;
        phone: string;
        nationality: string;
        message: string;
        destination: string;
        duration: string;
        budget: string;
        travelers: string;
        startDate?: string;
        startTime?: string;
    } & Record<string, FormDataValue>;

    // Form states
    const [formData, setFormData] = useState<FormDataState>({
        name: '',
        email: '',
        phone: '',
        nationality: '',
        message: '',
        destination: '',
        duration: '',
        budget: '',
        travelers: ''
    });

    const handleInputChange = (
        keyOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        value?: FormDataValue
    ) => {
        if (typeof keyOrEvent === 'string') {
            setFormData(prev => ({ ...prev, [keyOrEvent]: value }));
        } else {
            const { name, value } = keyOrEvent.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const guestsValue = typeof formData.travelers === 'string'
                ? parseInt(formData.travelers, 10)
                : typeof formData.travelers === 'number'
                    ? formData.travelers
                    : 1;
            const guests = Number.isFinite(guestsValue) && guestsValue > 0 ? guestsValue : 1;
            const reservationDate = formData.startDate || new Date().toISOString().split('T')[0];
            const tourName = selectedTypeData?.name
                ? `${selectedTypeData.name} - ${formData.destination || 'Solicitud general'}`
                : formData.destination || 'Solicitud general';
            const notes = [
                formData.message && `Mensaje: ${formData.message}`,
                formData.specialRequirements && `Requisitos: ${formData.specialRequirements}`,
                formData.duration && `Duración: ${formData.duration}`,
                formData.budget && `Presupuesto: ${formData.budget}`,
                formData.startTime && `Hora: ${formData.startTime}`,
                formData.nationality && `Nacionalidad: ${formData.nationality}`,
            ]
                .filter(Boolean)
                .join(' | ');

            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'tour',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    country: formData.nationality,
                    tourName,
                    date: reservationDate,
                    guests,
                    notes: notes || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const apiError = typeof data?.error === 'string'
                    ? data.error
                    : 'Error al enviar la solicitud';
                setError(apiError);
                return;
            }

            setCurrentStep('confirm');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedTypeData = travelTypes.find(type => type.id === selectedType);
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const renderFormFields = () => {
        if (!selectedTypeData) return null;

        return Object.entries(selectedTypeData.formFields).map(([key, field]) => {
            const inputId = `${selectedType}-${key}`;

            switch (field.type) {
                case 'select':
                    return (
                        <div key={key} className="input-liquid rounded-xl">
                            <label htmlFor={inputId} className="block text-sm font-medium mb-2">
                                {field.label} {field.required && <span className="text-primary">*</span>}
                            </label>
                            <select
                                id={inputId}
                                value={formData[key] || ''}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                required={field.required}
                            >
                                <option value="">Selecciona una opción</option>
                                {field.options.map((option: string) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    );

                case 'multiselect': {
                    const selectedValues = (formData[key] as string[] | undefined) || [];
                    return (
                        <div key={key} className="col-span-2">
                            <label className="block text-sm font-medium mb-3">
                                {field.label} {field.required && <span className="text-primary">*</span>}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {field.options.map((option: string) => (
                                    <label key={option} className="relative">
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(option)}
                                            onChange={(e) => {
                                                const newValues = e.target.checked
                                                    ? [...selectedValues, option]
                                                    : selectedValues.filter((v: string) => v !== option);
                                                handleInputChange(key, newValues);
                                            }}
                                            className="peer sr-only"
                                        />
                                        <div className="cursor-pointer px-3 py-2 rounded-lg border border-border bg-card/30 text-center text-sm transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:border-primary/50">
                                            {option}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                }

                case 'number':
                    return (
                        <div key={key} className="input-liquid rounded-xl">
                            <label htmlFor={inputId} className="block text-sm font-medium mb-2">
                                {field.label} {field.required && <span className="text-primary">*</span>}
                            </label>
                            <input
                                type="number"
                                id={inputId}
                                min={field.min}
                                max={field.max}
                                value={formData[key] || ''}
                                onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                required={field.required}
                            />
                        </div>
                    );

                case 'textarea':
                    return (
                        <div key={key} className="col-span-2 input-liquid rounded-xl">
                            <label htmlFor={inputId} className="block text-sm font-medium mb-2">
                                {field.label} {field.required && <span className="text-primary">*</span>}
                            </label>
                            <textarea
                                id={inputId}
                                rows={3}
                                value={formData[key] || ''}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                placeholder={field.placeholder || ''}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
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
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="nf-grid pointer-events-none fixed inset-0 z-0 opacity-30" />
            <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-background via-background to-background/95" />

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header with back button */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Volver al inicio
                        </Link>
                    </motion.div>

                    {/* Stepper */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12"
                    >
                        <div className="flex items-center justify-between max-w-2xl mx-auto">
                            {steps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isActive = currentStepIndex === index;
                                const isCompleted = currentStepIndex > index;

                                return (
                                    <div key={step.id} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-1">
                                            <div className={`stepper-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                                <StepIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className={`mt-2 text-xs sm:text-sm font-medium transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`stepper-line flex-1 mx-2 ${isCompleted ? 'active' : ''}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Main content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-enhanced rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50" />
                            <div className="scan-line absolute inset-0" />
                            <div className="relative p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg"
                                >
                                    <Globe className="w-8 h-8 text-white" />
                                </motion.div>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Tu Aventura Nómada
                                </h1>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Conectamos viajeros con experiencias auténticas
                                </p>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 sm:p-8">
                            <AnimatePresence mode="wait">
                                {currentStep === 'type' && (
                                    <motion.div
                                        key="type"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold mb-2">Elige tu tipo de experiencia</h2>
                                            <p className="text-muted-foreground">Selecciona cómo quieres vivir tu aventura nómada</p>
                                        </div>

                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {travelTypes.map((type, index) => (
                                                <motion.button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setSelectedType(type.id)}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    whileHover={{ y: -8, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`card-lift relative p-6 rounded-2xl border-2 transition-all text-left h-full flex flex-col group ${selectedType === type.id
                                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                                                        : 'border-border bg-card/50 hover:border-primary/50'
                                                        }`}
                                                >
                                                    {selectedType === type.id && (
                                                        <motion.div
                                                            layoutId="selected-indicator"
                                                            className="absolute top-4 right-4"
                                                        >
                                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                                <CheckCircle className="w-4 h-4 text-white" />
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    <div className="flex items-center mb-4">
                                                        <div className={`p-3 rounded-xl transition-all ${selectedType === type.id
                                                            ? `bg-gradient-to-br ${type.color} text-white shadow-lg`
                                                            : 'bg-muted/50 text-primary group-hover:bg-primary/10'
                                                            }`}>
                                                            <type.icon className="w-6 h-6" />
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                                                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{type.description}</p>

                                                    <div className="space-y-2">
                                                        {type.features.map((feature, idx) => (
                                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                                                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedType === type.id ? 'text-primary' : 'text-muted-foreground'
                                                                    }`} />
                                                                <span className="text-muted-foreground">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>

                                        <div className="flex justify-center pt-6">
                                            <button
                                                type="button"
                                                disabled={!selectedType}
                                                onClick={() => setCurrentStep('details')}
                                                className={`shimmer ripple-container relative px-8 py-4 rounded-xl font-semibold transition-all ${selectedType
                                                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
                                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                                    }`}
                                            >
                                                Continuar
                                                <ArrowLeft className="inline-block w-5 h-5 ml-2 rotate-180" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 'details' && (
                                    <motion.form
                                        key="details"
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        {/* Type Header */}
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep('type')}
                                                className="p-2 rounded-lg hover:bg-background/50 transition-colors"
                                                aria-label="Volver a selección de tipo"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </button>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold">{selectedTypeData?.name}</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Completa los detalles de tu {selectedTypeData?.name.toLowerCase()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Trip Details */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                Detalles del viaje
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Date */}
                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Fecha de inicio
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.startDate || ''}
                                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    />
                                                </div>

                                                {/* Time */}
                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Hora de inicio
                                                    </label>
                                                    <select
                                                        value={formData.startTime || ''}
                                                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    >
                                                        <option value="">Selecciona una hora</option>
                                                        {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
                                                            <option key={time} value={time}>{time} hrs</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Travelers */}
                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Número de viajeros
                                                    </label>
                                                    <select
                                                        value={formData.travelers || ''}
                                                        onChange={(e) => handleInputChange('travelers', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    >
                                                        <option value="">Selecciona</option>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                            <option key={num} value={num}>{num} {num === 1 ? 'viajero' : 'viajeros'}</option>
                                                        ))}
                                                        <option value="9">Grupo (9-15 viajeros)</option>
                                                        <option value="16">Grupo grande (16+ viajeros)</option>
                                                    </select>
                                                </div>

                                                {/* Destination */}
                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Destino o ubicación
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.destination || ''}
                                                        onChange={(e) => handleInputChange('destination', e.target.value)}
                                                        placeholder="¿A dónde te diriges?"
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    />
                                                </div>

                                                {/* Dynamic Fields */}
                                                {renderFormFields()}
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <User className="w-5 h-5 text-primary" />
                                                Información de contacto
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Nombre completo <span className="text-primary">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    />
                                                </div>

                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Correo electrónico <span className="text-primary">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    />
                                                </div>

                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        WhatsApp <span className="text-primary">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="+52 1 55 1234 5678"
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        required
                                                    />
                                                </div>

                                                <div className="input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Nacionalidad
                                                    </label>
                                                    <select
                                                        name="nationality"
                                                        value={formData.nationality}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                    >
                                                        <option value="">Selecciona tu país</option>
                                                        <option value="MX">México</option>
                                                        <option value="US">Estados Unidos</option>
                                                        <option value="ES">España</option>
                                                        <option value="AR">Argentina</option>
                                                        <option value="CO">Colombia</option>
                                                        <option value="GT">Guatemala</option>
                                                        <option value="OTRO">Otro</option>
                                                    </select>
                                                </div>

                                                <div className="col-span-2 input-liquid rounded-xl">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Cuéntanos sobre tu viaje (opcional)
                                                    </label>
                                                    <textarea
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                                        placeholder="¿Qué tipo de experiencia estás buscando? ¿Alguna preferencia o requisito especial?"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trust Badges */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-xl bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">Pago seguro</div>
                                                    <div className="text-xs text-muted-foreground">Protección total</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Zap className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">Respuesta rápida</div>
                                                    <div className="text-xs text-muted-foreground">En menos de 24h</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <CheckCircle className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">Cancelación gratis</div>
                                                    <div className="text-xs text-muted-foreground">Hasta 24h antes</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        {/* Submit Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep('type')}
                                                className="px-6 py-3 rounded-xl border border-border bg-card/50 hover:bg-card transition-all"
                                            >
                                                Atrás
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="shimmer ripple-container flex-1 relative px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="spinner-glow inline-block w-5 h-5 mr-2" />
                                                        Procesando...
                                                    </>
                                                ) : (
                                                    'Enviar solicitud de viaje'
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                {currentStep === 'confirm' && (
                                    <motion.div
                                        key="confirm"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12 space-y-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                                            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30"
                                        >
                                            <CheckCircle className="w-12 h-12 text-white" />
                                        </motion.div>

                                        <div>
                                            <h2 className="text-3xl font-bold mb-2">¡Solicitud enviada con éxito!</h2>
                                            <p className="text-muted-foreground">Hemos recibido tu solicitud de viaje.</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                ID de solicitud: TRVL-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                                            </p>
                                        </div>

                                        <div className="max-w-md mx-auto glass-enhanced rounded-2xl p-6 text-left space-y-4">
                                            <h3 className="text-lg font-semibold">¿Qué sigue?</h3>
                                            <ul className="space-y-3">
                                                {[
                                                    'Revisa tu correo electrónico para confirmar los detalles',
                                                    'Un experto local se pondrá en contacto contigo en menos de 24 horas',
                                                    'Personaliza tu experiencia según tus preferencias'
                                                ].map((item, index) => (
                                                    <motion.li
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + index * 0.1 }}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Link
                                            href="/"
                                            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                                        >
                                            Volver al inicio
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 text-center text-sm text-muted-foreground"
                    >
                        <p>¿Necesitas ayuda? <a href="mailto:hola@nomadafantasma.com" className="text-primary hover:underline">Contáctanos</a></p>
                        <p className="mt-1">© {new Date().getFullYear()} Nómada Fantasma. Todos los derechos reservados.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
