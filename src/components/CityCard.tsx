import React from 'react';
import { City } from '../data/cities-expanded';
import { MapPin, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CityCardProps {
  city: City;
  onSelect?: (city: City) => void;
  isSelected?: boolean;
}

export function CityCard({ city, onSelect, isSelected }: CityCardProps) {
  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSafetyBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 80) return 'High Safety';
    if (score >= 70) return 'Moderate Safety';
    return 'Low Safety';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={() => onSelect?.(city)}
      className={`relative group cursor-pointer rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${
        isSelected
          ? 'ring-4 ring-purple-500 shadow-2xl bg-white dark:bg-gray-800'
          : 'bg-white/80 dark:bg-gray-800/80 hover:shadow-xl'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-purple-500 rounded-full p-1"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl text-gray-900 dark:text-white mb-1">
              {city.city}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{city.state}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs ${getSafetyBgColor(city.safetyScore)}`}>
            <span className={getSafetyColor(city.safetyScore)}>
              {city.budgetLevel} Budget
            </span>
          </div>
        </div>

        {/* Safety Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">Overall Safety</span>
            <span className={`text-2xl ${getSafetyColor(city.safetyScore)}`}>
              {city.safetyScore}
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${city.safetyScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full rounded-full ${
                city.safetyScore >= 80
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : city.safetyScore >= 70
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {getSafetyLevel(city.safetyScore)}
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lighting</div>
            <div className="text-lg text-purple-600 dark:text-purple-400">
              {city.lightingScore}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transport</div>
            <div className="text-lg text-blue-600 dark:text-blue-400">
              {city.publicTransportScore}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Crowd</div>
            <div className="text-lg text-pink-600 dark:text-pink-400">
              {city.crowdScore}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reviews</div>
            <div className="text-lg text-green-600 dark:text-green-400">
              {city.womenReviewScore}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Popular Activities</div>
          <div className="flex flex-wrap gap-2">
            {city.activities.slice(0, 3).map((activity, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                {activity}
              </span>
            ))}
            {city.activities.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{city.activities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="flex gap-1 h-16 items-end">
          {[
            { value: city.lightingScore, color: 'bg-purple-400' },
            { value: city.publicTransportScore, color: 'bg-blue-400' },
            { value: city.crowdScore, color: 'bg-pink-400' },
            { value: city.womenReviewScore, color: 'bg-green-400' }
          ].map((bar, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${bar.value}%` }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className={`flex-1 ${bar.color} rounded-t opacity-70 hover:opacity-100 transition-opacity`}
            />
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
}
