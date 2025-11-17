import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { City } from '../data/cities-expanded';
import { ArrowLeft, MapPin, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cities = location.state?.cities as City[] | undefined;

  if (!cities || cities.length !== 2) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">No cities selected for comparison</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const [city1, city2] = cities;

  const comparisonData = [
    {
      category: 'Safety Score',
      [city1.city]: city1.safetyScore,
      [city2.city]: city2.safetyScore
    },
    {
      category: 'Lighting',
      [city1.city]: city1.lightingScore,
      [city2.city]: city2.lightingScore
    },
    {
      category: 'Transport',
      [city1.city]: city1.publicTransportScore,
      [city2.city]: city2.publicTransportScore
    },
    {
      category: 'Crowd',
      [city1.city]: city1.crowdScore,
      [city2.city]: city2.crowdScore
    },
    {
      category: 'Reviews',
      [city1.city]: city1.womenReviewScore,
      [city2.city]: city2.womenReviewScore
    }
  ];

  const radarData = [
    {
      subject: 'Safety',
      [city1.city]: city1.safetyScore,
      [city2.city]: city2.safetyScore,
      fullMark: 100
    },
    {
      subject: 'Lighting',
      [city1.city]: city1.lightingScore,
      [city2.city]: city2.lightingScore,
      fullMark: 100
    },
    {
      subject: 'Transport',
      [city1.city]: city1.publicTransportScore,
      [city2.city]: city2.publicTransportScore,
      fullMark: 100
    },
    {
      subject: 'Crowd',
      [city1.city]: city1.crowdScore,
      [city2.city]: city2.crowdScore,
      fullMark: 100
    },
    {
      subject: 'Reviews',
      [city1.city]: city1.womenReviewScore,
      [city2.city]: city2.womenReviewScore,
      fullMark: 100
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white">City Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400">Side-by-side analysis of safety metrics</p>
        </div>
      </motion.div>

      {/* City Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl text-gray-900 dark:text-white mb-1">{city.city}</h2>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{city.state}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl text-purple-600 dark:text-purple-400">{city.safetyScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Safety Score</div>
              </div>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${city.safetyScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${
                  city.safetyScore >= 80
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : city.safetyScore >= 70
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
      >
        <h3 className="text-xl text-gray-900 dark:text-white mb-6">Category Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <XAxis dataKey="category" stroke="#9333ea" />
            <YAxis stroke="#9333ea" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e9d5ff',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey={city1.city} fill="#a855f7" radius={[8, 8, 0, 0]} />
            <Bar dataKey={city2.city} fill="#ec4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
      >
        <h3 className="text-xl text-gray-900 dark:text-white mb-6">Overall Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#9333ea" />
            <PolarAngleAxis dataKey="subject" stroke="#9333ea" />
            <PolarRadiusAxis stroke="#9333ea" />
            <Radar name={city1.city} dataKey={city1.city} stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
            <Radar name={city2.city} dataKey={city2.city} stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
          >
            <h3 className="text-xl text-gray-900 dark:text-white mb-4">{city.city}</h3>

            {/* Sub-scores */}
            <div className="space-y-3 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lighting Score</span>
                  <span className="text-purple-600 dark:text-purple-400">{city.lightingScore}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${city.lightingScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Transport Score</span>
                  <span className="text-blue-600 dark:text-blue-400">{city.publicTransportScore}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${city.publicTransportScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Crowd Score</span>
                  <span className="text-pink-600 dark:text-pink-400">{city.crowdScore}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${city.crowdScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Women Reviews</span>
                  <span className="text-green-600 dark:text-green-400">{city.womenReviewScore}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${city.womenReviewScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">Budget Level: </span>
              <span className="text-gray-900 dark:text-white">{city.budgetLevel}</span>
            </div>

            {/* Pros */}
            <div className="mb-4">
              <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <ThumbsUp className="w-4 h-4" />
                <span>Pros</span>
              </h4>
              <ul className="space-y-2">
                {city.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="mb-4">
              <h4 className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <ThumbsDown className="w-4 h-4" />
                <span>Cons</span>
              </h4>
              <ul className="space-y-2">
                {city.cons.map((con, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div>
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Activities</h4>
              <div className="flex flex-wrap gap-2">
                {city.activities.map((activity, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
              <h4 className="text-sm text-yellow-800 dark:text-yellow-400 mb-2">Important Alerts</h4>
              <ul className="space-y-1">
                {city.alerts.map((alert, i) => (
                  <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                    • {alert}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Winner Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700"
      >
        <h3 className="text-xl text-gray-900 dark:text-white mb-4">Recommendation</h3>
        <p className="text-gray-700 dark:text-gray-300">
          {city1.safetyScore > city2.safetyScore ? (
            <>
              <span className="text-purple-600 dark:text-purple-400">{city1.city}</span> has a higher overall safety score ({city1.safetyScore}) compared to {city2.city} ({city2.safetyScore}). However, consider your specific needs like budget, activities, and transport requirements when making your final decision.
            </>
          ) : city2.safetyScore > city1.safetyScore ? (
            <>
              <span className="text-purple-600 dark:text-purple-400">{city2.city}</span> has a higher overall safety score ({city2.safetyScore}) compared to {city1.city} ({city1.safetyScore}). However, consider your specific needs like budget, activities, and transport requirements when making your final decision.
            </>
          ) : (
            <>
              Both cities have equal safety scores ({city1.safetyScore}). Consider other factors like budget, activities, and specific requirements to make your decision.
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
