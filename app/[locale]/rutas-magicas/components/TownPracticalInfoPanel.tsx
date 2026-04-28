import Link from 'next/link';
import { ArrowRight, Bus, Clock, Coffee, Droplets, Landmark, Map, Sun, Thermometer, Wind, CloudRain, CloudSun, Moon, Sunset } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  feelsLike: number;
}

interface TransportScheduleItem {
  route: string;
  times: string[] | string;
}

interface ServicesData {
  atms: string[];
  essentials: string[];
}

interface TownPracticalInfoPanelProps {
  weather: WeatherData;
  weatherTitle: string;
  humidityLabel: string;
  windLabel: string;
  feelsLikeLabel: string;
  howToGetTitle: string;
  servicesTitle: string;
  atmsTitle: string;
  noAtmsLabel: string;
  essentialsTitle: string;
  quickActionsTitle: string;
  mapActionLabel: string;
  shuttleActionLabel: string;
  locale: string;
  townSlug: string;
  transportSchedule: TransportScheduleItem[];
  services: ServicesData;
}

function getWeatherIcon(iconName: string) {
  switch (iconName) {
    case 'sun':
    case 'Sunny':
    case 'Soleado':
      return <Sun className="w-8 h-8 text-yellow-400" />;
    case 'cloud-sun':
    case 'Partly cloudy':
    case 'Parcialmente nublado':
      return <CloudSun className="w-8 h-8 text-yellow-400" />;
    case 'cloud-rain':
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    case 'moon':
      return <Moon className="w-8 h-8 text-gray-400" />;
    case 'sunset':
      return <Sunset className="w-8 h-8 text-orange-400" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-400" />;
  }
}

export default function TownPracticalInfoPanel({
  weather,
  weatherTitle,
  humidityLabel,
  windLabel,
  feelsLikeLabel,
  howToGetTitle,
  servicesTitle,
  atmsTitle,
  noAtmsLabel,
  essentialsTitle,
  quickActionsTitle,
  mapActionLabel,
  shuttleActionLabel,
  locale,
  townSlug,
  transportSchedule,
  services,
}: TownPracticalInfoPanelProps) {
  const actionLinks = [
    {
      href: `/${locale}/mapa?town=${townSlug}`,
      label: mapActionLabel,
      icon: Map,
    },
    {
      href: `/${locale}/shuttles`,
      label: shuttleActionLabel,
      icon: Bus,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/70 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
              <Bus className="mr-2 h-5 w-5 text-cyan-500" />
              {howToGetTitle}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {transportSchedule.map((schedule, index) => (
              <article
                key={`${schedule.route}-${index}`}
                className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-gray-900/45"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{schedule.route}</h4>
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                </div>
                <div className="space-y-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {Array.isArray(schedule.times)
                    ? schedule.times.map((time, timeIndex) => <p key={timeIndex}>{time}</p>)
                    : <p>{schedule.times}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/70">
            <h3 className="mb-4 flex items-center text-lg font-bold text-gray-900 dark:text-white">
              <Sun className="mr-2 h-5 w-5 text-yellow-500" />
              {weatherTitle}
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                {getWeatherIcon(weather.condition)}
                <span className="ml-3 text-4xl font-bold text-gray-900 dark:text-white">{weather.temp}°C</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{weather.condition}</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-900/45">
                <Droplets className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">{humidityLabel}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{weather.humidity}%</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-900/45">
                <Wind className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">{windLabel}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{weather.wind} km/h</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-900/45">
                <Thermometer className="mx-auto mb-1 h-4 w-4 text-red-400" />
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">{feelsLikeLabel}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{weather.feelsLike}°C</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-400/20 bg-cyan-50/70 p-5 shadow-sm dark:bg-cyan-950/20">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
              {quickActionsTitle}
            </h3>
            <div className="grid gap-3">
              {actionLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between rounded-xl border border-cyan-500/20 bg-white/75 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-cyan-400/50 hover:bg-white dark:bg-gray-900/50 dark:text-white dark:hover:bg-gray-900/70"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-500" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/70 sm:p-6">
        <h3 className="mb-5 flex items-center text-xl font-bold text-gray-900 dark:text-white">
          <Landmark className="mr-2 h-5 w-5 text-green-500" />
          {servicesTitle}
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-gray-900/45">
            <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
              <Landmark className="mr-2 h-4 w-4 text-green-500" />
              {atmsTitle}
            </h4>
            {services.atms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {services.atms.map((atm, index) => (
                  <span
                    key={`${atm}-${index}`}
                    className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-200"
                  >
                    {atm}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">{noAtmsLabel}</p>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-gray-900/45">
            <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
              <Coffee className="mr-2 h-4 w-4 text-orange-500" />
              {essentialsTitle}
            </h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {services.essentials.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start text-sm leading-6 text-gray-600 dark:text-gray-300">
                  <span className="mr-2 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
