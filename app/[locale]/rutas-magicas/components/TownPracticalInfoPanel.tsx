import { Bus, Clock, Coffee, Droplets, Landmark, Sun, Thermometer, Wind, CloudRain, CloudSun, Moon, Sunset } from 'lucide-react';

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
  transportSchedule,
  services,
}: TownPracticalInfoPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Sun className="w-5 h-5 mr-2 text-yellow-500" />
          {weatherTitle}
        </h3>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getWeatherIcon(weather.condition)}
            <span className="text-4xl font-bold ml-3 text-gray-900 dark:text-white">{weather.temp}°C</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">{weather.condition}</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <Droplets className="w-5 h-5 mx-auto text-blue-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400 block">{humidityLabel}</span>
            <p className="font-semibold text-gray-900 dark:text-white">{weather.humidity}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <Wind className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400 block">{windLabel}</span>
            <p className="font-semibold text-gray-900 dark:text-white">{weather.wind} km/h</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <Thermometer className="w-5 h-5 mx-auto text-red-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400 block">{feelsLikeLabel}</span>
            <p className="font-semibold text-gray-900 dark:text-white">{weather.feelsLike}°C</p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bus className="w-5 h-5 mr-2 text-cyan-500" />
          {howToGetTitle}
        </h3>
        <div className="space-y-4">
          {transportSchedule.map((schedule, index) => (
            <div key={`${schedule.route}-${index}`} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-white text-sm">{schedule.route}</span>
                <Clock className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {Array.isArray(schedule.times)
                  ? schedule.times.map((time, timeIndex) => <div key={timeIndex}>{time}</div>)
                  : <div>{schedule.times}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Landmark className="w-5 h-5 mr-2 text-green-500" />
          {servicesTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Landmark className="w-4 h-4 mr-2 text-green-500" />
              {atmsTitle}
            </h4>
            {services.atms.length > 0 ? (
              <ul className="space-y-2">
                {services.atms.map((atm, index) => (
                  <li key={`${atm}-${index}`} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0" />
                    {atm}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">{noAtmsLabel}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Coffee className="w-4 h-4 mr-2 text-orange-500" />
              {essentialsTitle}
            </h4>
            <ul className="space-y-2">
              {services.essentials.map((item, index) => (
                <li key={`${item}-${index}`} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 mr-2 flex-shrink-0" />
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
