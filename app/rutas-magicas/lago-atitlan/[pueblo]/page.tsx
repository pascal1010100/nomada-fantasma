import { notFound } from 'next/navigation';
import { pueblosAtitlan } from '../../../../app/rutas-magicas/mocks/atitlanData';
import { 
  ArrowLeft, ArrowRight, MapPin, Wifi, Coffee, Bus, Map, Clock, Landmark, 
  Mountain, Sunset, BookOpen, Wifi as WifiIcon, MapPin as MapPinIcon, 
  Footprints, Star, Users, Calendar, Compass, Sun, Moon, Sunrise, Zap, 
  Wind, Thermometer, CloudRain, Droplets, Globe, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Definición de tipos para los componentes
interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface IconListProps {
  items: string[];
  className?: string;
}

// Componente de tarjeta con estilo cyberpunk
const CyberCard: React.FC<CyberCardProps> = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 shadow-lg shadow-cyan-500/10 ${className}`}>
    {children}
  </div>
);

// Componente de sección
const Section: React.FC<SectionProps> = ({ title, icon, children, className = '' }) => (
  <section className={`mb-12 ${className}`}>
    <h2 className="text-2xl font-bold mb-6 flex items-center text-cyan-400">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

// Componente de lista con iconos
const IconList: React.FC<IconListProps> = ({ items, className = '' }) => (
  <ul className={`space-y-3 ${className}`}>
    {items.map((item, index) => (
      <li key={index} className="flex items-start">
        <span className="text-cyan-400 mr-2 mt-0.5">
          <Zap className="w-4 h-4" />
        </span>
        <span className="text-gray-300">{item}</span>
      </li>
    ))}
  </ul>
);

// Definición de tipos para TypeScript
type Highlight = {
  icon: React.ReactNode;
  text: string;
};

type TransportSchedule = {
  route: string;
  times: string[];
};

type Services = {
  atms: string[];
  essentials: string[];
};

interface Guide {
  name: string;
  contact: string;
  languages: string[];
  tours: string[];
}

interface WifiSpot {
  name: string;
  description: string;
  speed: 'slow' | 'medium' | 'fast';
  hours: string;
  hasOutlets: boolean;
}

interface NearbyTown {
  id: string;
  name: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  distance: string;
  highlights: string[];
  coverImage: string;
}

export default function PuebloDetailPage({ params }: { params: { pueblo: string } }) {
  // Buscar el pueblo por slug
  const pueblo = pueblosAtitlan.find(p => p.slug === params.pueblo);
  
  // Si no se encuentra el pueblo, mostrar 404
  if (!pueblo) {
    notFound();
  }

  // Datos del pueblo
  const puebloData = {
    ...pueblo,
    description: `San Pedro La Laguna es un pintoresco pueblo maya tz'utujil ubicado a orillas del Lago de Atitlán, conocido por su ambiente relajado, su vibrante vida nocturna y sus impresionantes vistas al volcán San Pedro. Este destino atrae a viajeros de todo el mundo que buscan una combinación de cultura auténtica, naturaleza impresionante y una comunidad de mochileros internacional.`,
    
    // Clima actual (datos de ejemplo)
    weather: {
      temp: 22,
      condition: 'Soleado',
      humidity: 65,
      wind: 12,
      feelsLike: 24,
      forecast: [
        { day: 'Hoy', icon: <Sun className="w-6 h-6" />, high: 26, low: 18, pop: 10 },
        { day: 'Mañana', icon: <CloudRain className="w-6 h-6" />, high: 24, low: 17, pop: 40 },
        { day: 'Jue', icon: <Sun className="w-6 h-6" />, high: 25, low: 18, pop: 20 },
        { day: 'Vie', icon: <Sunset className="w-6 h-6" />, high: 26, low: 19, pop: 10 },
      ]
    },

    // Puntos destacados
    highlights: [
      { icon: <Mountain className="w-5 h-5 text-cyan-400" />, text: 'Vistas al Volcán San Pedro' },
      { icon: <Coffee className="w-5 h-5 text-amber-400" />, text: 'Cafés artesanales' },
      { icon: <Moon className="w-5 h-5 text-purple-400" />, text: 'Vida nocturna animada' },
      { icon: <BookOpen className="w-5 h-5 text-green-400" />, text: 'Escuelas de español' },
      { icon: <Sunrise className="w-5 h-5 text-yellow-400" />, text: 'Amaneceres espectaculares' },
      { icon: <Compass className="w-5 h-5 text-red-400" />, text: 'Cultura maya viva' },
    ] as Highlight[],

    // Actividades
    activities: [
      'Senderismo al Volcán San Pedro (4-6 horas de subida)',
      'Kayak al amanecer en el lago',
      'Clases de español en escuelas locales',
      'Tours de café por fincas locales',
      'Visita al mercado local de artesanías',
      'Clases de cocina tradicional',
      'Yoga al amanecer con vista al lago',
      'Paseo en bote a otros pueblos del lago',
      'Tour de street art y murales locales',
      'Conexión con comunidades indígenas',
      'Observación de aves en la naturaleza',
      'Baños de temazcal tradicional'
    ],

    // Horario de transporte
    transportSchedule: [
      { route: 'Panajachel → San Pedro', times: ['5:30', '7:00', '8:30', '10:00', '12:00', '14:00', '16:00', '17:30'] },
      { route: 'San Pedro → Santiago', times: ['7:00', '9:00', '11:00', '13:00', '15:00', '17:00'] },
      { route: 'San Pedro → San Marcos', times: ['Cada 30 min', '6:00 - 19:00'] },
      { route: 'San Pedro → San Juan', times: ['Cada 45 min', '6:30 - 18:30'] },
      { route: 'San Pedro → Ciudad de Guatemala', times: ['4:30', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00'] },
    ] as TransportSchedule[],

    // Servicios
    services: {
      atms: ['Banco Industrial', 'Banrural', '5B'],
      essentials: [
        'Farmacias: Farmacia San Pedro, Farmacia La Bendición',
        'Lavanderías: Lavandería La Esquina, Lavandería Central',
        'Supermercados: Despensa Familiar, Supermercado San Pedro',
        'Centro médico: Centro de Salud San Pedro La Laguna',
        'Oficina de correos: En el centro del pueblo',
        'Tiendas de alquiler de equipo: Kayaks, tablas de paddle, bicicletas'
      ]
    } as Services,
    
    // Guías turísticos
    guides: [
      { 
        name: 'Juan Pérez', 
        contact: '+502 1234-5678', 
        languages: ['Español', 'Inglés'],
        tours: [
          'Tour al Volcán San Pedro (Q150-200 por persona)',
          'Tour de café por fincas locales (Q100-150)',
          'Tour cultural por el pueblo (Q80-120)'
        ]
      },
      { 
        name: 'María González', 
        contact: 'maria@guia.com', 
        languages: ['Español', 'Francés', 'Inglés'],
        tours: [
          'Clases de español personalizadas (Q50/hora)',
          'Tour fotográfico por el lago (Q200 por grupo)',
          'Visita a comunidades indígenas (Q150 por persona)'
        ]
      },
      { 
        name: 'Pablo Ramírez', 
        contact: '@pabloguia', 
        languages: ['Español', 'Alemán'],
        tours: [
          'Tour de senderismo a miradores secretos (Q120 por persona)',
          'Tour gastronómico por San Pedro (Q180 por persona)',
          'Tour en bicicleta por los alrededores (Q100 por persona)'
        ]
      }
    ] as Guide[],
    
    // Puntos WiFi
    wifiSpots: [
      { 
        name: 'Café La Puerta', 
        description: 'Buena conexión, ambiente relajado', 
        speed: 'fast',
        hours: '7:00 - 21:00',
        hasOutlets: true
      },
      { 
        name: 'Hostel Fe', 
        description: 'Zona de coworking con vista al lago', 
        speed: 'medium',
        hours: '24/7 para huéspedes',
        hasOutlets: true
      },
      { 
        name: 'Café Loco', 
        description: 'WiFi rápido, buen café', 
        speed: 'fast',
        hours: '8:00 - 20:00',
        hasOutlets: true
      },
      { 
        name: 'Zoola', 
        description: 'Zona de descanso con enchufes', 
        speed: 'slow',
        hours: '10:00 - 23:00',
        hasOutlets: true
      }
    ] as WifiSpot[],
    
    // Pueblos cercanos
    nearbyTowns: [
      { 
        id: 'san-marcos',
        name: 'San Marcos La Laguna',
        title: 'San Marcos La Laguna',
        summary: 'Un refugio espiritual a orillas del lago',
        coverImage: '/images/san-marcos.jpg',
        distance: '15 min en lancha', 
        description: 'Conocido por su ambiente espiritual y retiros de yoga',
        slug: 'san-marcos-la-laguna',
        highlights: ['Retiros espirituales', 'Clases de yoga', 'Meditación']
      },
      { 
        id: 'san-juan',
        name: 'San Juan La Laguna',
        title: 'San Juan La Laguna',
        summary: 'El corazón artesanal del lago',
        coverImage: '/images/san-juan.jpg',
        distance: '10 min en tuk-tuk', 
        description: 'Famosa por sus cooperativas de arte y tejidos',
        slug: 'san-juan-la-laguna',
        highlights: ['Arte textil', 'Pintura naif', 'Cultura maya']
      },
      { 
        id: 'santiago',
        name: 'Santiago Atitlán',
        title: 'Santiago Atitlán',
        summary: 'La cuna de la cultura tzutujil',
        coverImage: '/images/santiago.jpg',
        distance: '45 min en lancha', 
        description: 'Rica en cultura tzutujil y tradiciones mayas',
        slug: 'santiago-atitlan',
        highlights: ['Mercado local', 'Iglesia colonial', 'Cofradías']
      },
      { 
        id: 'panajachel',
        name: 'Panajachel',
        title: 'Panajachel',
        summary: 'La puerta de entrada al Lago de Atitlán',
        coverImage: '/images/panajachel.jpg',
        distance: '1 hora en lancha', 
        description: 'La puerta de entrada al Lago de Atitlán',
        slug: 'panajachel',
        highlights: ['Calle Santander', 'Vida nocturna', 'Vistas al lago']
      }
    ] as NearbyTown[]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <li>
              <Link href="/rutas-magicas" className="hover:text-electricBlue dark:hover:text-cyberPurple transition-colors">
                Rutas Mágicas
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/rutas-magicas/lago-atitlan" className="hover:text-electricBlue dark:hover:text-cyberPurple transition-colors">
                Lago de Atitlán
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white font-medium">{pueblo.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pueblo.coverImage}
            alt={pueblo.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{pueblo.title}</h1>
          <p className="text-xl text-gray-200 mb-6 max-w-2xl">{pueblo.summary}</p>
          <div className="flex flex-wrap gap-2">
            {puebloData.highlights.map((item, index) => (
              <span key={index} className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
                {item.icon}
                <span className="ml-1.5">{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Por qué visitar */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                Por qué visitar {pueblo.title}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  {puebloData.description}
                </p>
              </div>
            </section>

            {/* Qué hacer */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Footprints className="w-6 h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                Qué hacer en {pueblo.title}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {puebloData.activities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-electricBlue dark:text-cyberPurple mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Horarios de transporte */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Bus className="w-6 h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                Transporte desde/hacia {pueblo.title}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ruta</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Horarios</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {puebloData.transportSchedule.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.route}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {Array.isArray(item.times) ? item.times.join(', ') : item.times}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-300">
                  * Los horarios son aproximados y pueden variar. Se recomienda confirmar con los locales.
                </div>
              </div>
            </section>

            {/* Guías turísticos - Sección condicional */}
            {Array.isArray((pueblo as any).guides) && (pueblo as any).guides.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Landmark className="w-6 h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                  Guías y Tours Locales
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {pueblo.title} cuenta con una variedad de guías locales que ofrecen experiencias auténticas. Aquí tienes algunas opciones:
                  </p>
                  <div className="space-y-4">
                    {(pueblo as any).guides.map((guide: Guide, index: number) => (
                      <div key={index} className="p-5 bg-gray-800/50 rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="bg-cyan-500/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-cyan-300 mb-1">{guide.name}</h3>
                            <p className="text-sm text-cyan-100/80 mb-3">
                              <span className="font-medium">Contacto:</span> {guide.contact}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="text-xs px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded-full flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                {guide.languages.join(' • ')}
                              </span>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-cyan-200 mb-2 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                                Tours Disponibles
                              </h4>
                              <ul className="space-y-2">
                                {guide.tours.map((tour, tourIndex) => (
                                  <li key={tourIndex} className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{tour}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cajeros y servicios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-electricBlue dark:text-cyberPurple" />
                Cajeros y Servicios
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cajeros Automáticos:</h4>
                  <ul className="space-y-1">
                    {puebloData.services.atms.map((atm, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">• {atm}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Servicios Esenciales:</h4>
                  <ul className="space-y-1">
                    {puebloData.services.essentials.map((service, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">• {service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Lugares con buen WiFi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <WifiIcon className="w-5 h-5 mr-2 text-electricBlue dark:text-cyberPurple" />
                Lugares con buen WiFi
              </h3>
              <div className="space-y-3">
                {puebloData.wifiSpots.map((spot, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">{spot.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{spot.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Map className="w-5 h-5 mr-2 text-electricBlue dark:text-cyberPurple" />
                  Ubicación
                </h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15445.16229681136!2d-91.2759655!3d14.6932037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85896c3f5e7e7f1b%3A0x2f4b8e8e2f2f2f2f!2sSan%20Pedro%20La%20Laguna%2C%20Guatemala!5e0!3m2!1sen!2sgt!4v1620000000000!5m2!1sen!2sgt" 
                    width="100%" 
                    height="250" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title={`Mapa de ${pueblo.title}`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Otros pueblos cercanos */}
        {puebloData.nearbyTowns.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Otros pueblos cercanos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {puebloData.nearbyTowns.map((town) => (
                <Link 
                  key={town.id} 
                  href={`/rutas-magicas/lago-atitlan/${town.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-40 relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${town.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-white">{town.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{town.summary}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Ver más</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
