import React, { useState } from 'react';
import { useCities } from '../lib/use-cities';
import { motion } from 'motion/react';
import { MapPin, Info } from 'lucide-react';

export function MapView() {
  const { cities } = useCities();
  const [hoveredCity, setHoveredCity] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const getSafetyColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 80) return 'High Safety';
    if (score >= 70) return 'Moderate Safety';
    return 'Low Safety';
  };

  // Mock map boundaries
  const mapWidth = 1000;
  const mapHeight = 600;

  // Convert lat/lng to x/y (simplified projection for India)
  const latToY = (lat: number) => {
    const minLat = 8;
    const maxLat = 35;
    return ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
  };

  const lngToX = (lng: number) => {
    const minLng = 68;
    const maxLng = 97;
    return ((lng - minLng) / (maxLng - minLng)) * mapWidth;
  };

  const cityData = cities.find((c) => c.id === selectedCity);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          Safety Heatmap
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive map showing safety levels across India
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">High Safety (80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Moderate Safety (70-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Low Safety (&lt;70)</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
        >
          <div className="relative w-full aspect-[5/3] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden">
            {/* Simple India outline */}
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Background */}
              <rect width="1000" height="600" fill="transparent" />

              {/* Cities as markers */}
              {cities.map((city) => {
                const x = lngToX(city.coordinates.lng);
                const y = latToY(city.coordinates.lat);
                const isHovered = hoveredCity === city.id;
                const isSelected = selectedCity === city.id;
                const color = getSafetyColor(city.safetyScore);

                return (
                  <g key={city.id}>
                    {/* Pulse animation for selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={20}
                        fill={color}
                        opacity={0.3}
                        className="animate-ping"
                      />
                    )}

                    {/* Main marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered || isSelected ? 12 : 8}
                      fill={color}
                      stroke="white"
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: isHovered || isSelected ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))' : 'none'
                      }}
                      onMouseEnter={() => setHoveredCity(city.id)}
                      onMouseLeave={() => setHoveredCity(null)}
                      onClick={() => setSelectedCity(city.id === selectedCity ? null : city.id)}
                    />

                    {/* Tooltip on hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={x + 15}
                          y={y - 30}
                          width={120}
                          height={50}
                          rx={8}
                          fill="white"
                          stroke={color}
                          strokeWidth={2}
                          filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                        />
                        <text
                          x={x + 75}
                          y={y - 15}
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight="bold"
                          fill="#1f2937"
                        >
                          {city.city}
                        </text>
                        <text
                          x={x + 75}
                          y={y - 2}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#6b7280"
                        >
                          Score: {city.safetyScore}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200 dark:border-purple-700 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Hover or click on markers to view details
              </span>
            </div>
          </div>
        </motion.div>

        {/* City Details Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {selectedCity && cityData ? (
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl text-gray-900 dark:text-white mb-1">
                    {cityData.city}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{cityData.state}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              {/* Safety Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Overall Safety</span>
                  <span
                    className="text-3xl"
                    style={{ color: getSafetyColor(cityData.safetyScore) }}
                  >
                    {cityData.safetyScore}
                  </span>
                </div>
                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${cityData.safetyScore}%`,
                      backgroundColor: getSafetyColor(cityData.safetyScore)
                    }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {getSafetyLevel(cityData.safetyScore)}
                </div>
              </div>

              {/* Sub-scores */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lighting</span>
                    <span className="text-purple-600 dark:text-purple-400">{cityData.lightingScore}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${cityData.lightingScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transport</span>
                    <span className="text-blue-600 dark:text-blue-400">{cityData.publicTransportScore}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${cityData.publicTransportScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Crowd</span>
                    <span className="text-pink-600 dark:text-pink-400">{cityData.crowdScore}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${cityData.crowdScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reviews</span>
                    <span className="text-green-600 dark:text-green-400">{cityData.womenReviewScore}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${cityData.womenReviewScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <span className="text-sm text-gray-600 dark:text-gray-400">Budget: </span>
                <span className="text-gray-900 dark:text-white">{cityData.budgetLevel}</span>
              </div>

              {/* Activities */}
              <div className="mb-4">
                <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {cityData.activities.slice(0, 6).map((activity, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                <h4 className="text-sm text-yellow-800 dark:text-yellow-400 mb-2">Alerts</h4>
                <ul className="space-y-1">
                  {cityData.alerts.map((alert, i) => (
                    <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                      • {alert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 text-center">
              <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 dark:text-white mb-2">
                Select a City
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on any marker on the map to view detailed safety information
              </p>
            </div>
          )}

          {/* Statistics */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Safest City</span>
                <span className="text-green-600 dark:text-green-400">
                  {[...cities].sort((a, b) => b.safetyScore - a.safetyScore)[0].city}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Safety Score</span>
                <span className="text-purple-600 dark:text-purple-400">
                  {Math.round(cities.reduce((sum, c) => sum + c.safetyScore, 0) / cities.length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Best Lighting</span>
                <span className="text-yellow-600 dark:text-yellow-400">
                  {[...cities].sort((a, b) => b.lightingScore - a.lightingScore)[0].city}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
