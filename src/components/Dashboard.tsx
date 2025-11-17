import React, { useState, useMemo } from 'react';
import { cities as fallbackCities, City } from '../data/cities-expanded';
import { useCities } from '../lib/use-cities';
import { CityCard } from './CityCard';
import { FilterPanel, Filters } from './FilterPanel';
import { Search, SlidersHorizontal, ArrowUpDown, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const { cities, loading: citiesLoading, isUsingSupabase, refreshCities } = useCities();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'highest' | 'lowest' | 'budget' | 'recommended'>('highest');
  const [filters, setFilters] = useState<Filters>({
    state: [],
    safetyLevel: [],
    budgetLevel: [],
    activities: []
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let result = [...cities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (city) =>
          city.city.toLowerCase().includes(query) ||
          city.state.toLowerCase().includes(query)
      );
    }

    // State filter
    if (filters.state.length > 0) {
      result = result.filter((city) => filters.state.includes(city.state));
    }

    // Safety level filter
    if (filters.safetyLevel.length > 0) {
      result = result.filter((city) => {
        if (filters.safetyLevel.includes('High (80+)') && city.safetyScore >= 80) return true;
        if (filters.safetyLevel.includes('Moderate (70-79)') && city.safetyScore >= 70 && city.safetyScore < 80) return true;
        if (filters.safetyLevel.includes('Low (<70)') && city.safetyScore < 70) return true;
        return false;
      });
    }

    // Budget filter
    if (filters.budgetLevel.length > 0) {
      result = result.filter((city) => filters.budgetLevel.includes(city.budgetLevel));
    }

    // Activities filter
    if (filters.activities.length > 0) {
      result = result.filter((city) =>
        filters.activities.some((activity) => city.activities.includes(activity))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'highest':
        result.sort((a, b) => b.safetyScore - a.safetyScore);
        break;
      case 'lowest':
        result.sort((a, b) => a.safetyScore - b.safetyScore);
        break;
      case 'budget':
        result.sort((a, b) => {
          const budgetOrder = { Low: 1, Medium: 2, High: 3 };
          return budgetOrder[a.budgetLevel] - budgetOrder[b.budgetLevel];
        });
        break;
      case 'recommended':
        result.sort((a, b) => b.womenReviewScore - a.womenReviewScore);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  // Top 5 cities for charts
  const topCities = useMemo(() => {
    return [...cities].sort((a, b) => b.safetyScore - a.safetyScore).slice(0, 5);
  }, []);

  const chartData = topCities.map((city) => ({
    name: city.city,
    score: city.safetyScore
  }));

  const safetyDistribution = [
    { name: 'High Safety', value: cities.filter((c) => c.safetyScore >= 80).length, color: '#10b981' },
    { name: 'Moderate', value: cities.filter((c) => c.safetyScore >= 70 && c.safetyScore < 80).length, color: '#f59e0b' },
    { name: 'Low Safety', value: cities.filter((c) => c.safetyScore < 70).length, color: '#ef4444' }
  ];

  const handleCitySelect = (city: City) => {
    if (selectedCities.find((c) => c.id === city.id)) {
      setSelectedCities(selectedCities.filter((c) => c.id !== city.id));
    } else if (selectedCities.length < 2) {
      setSelectedCities([...selectedCities, city]);
    } else {
      setSelectedCities([selectedCities[1], city]);
    }
  };

  const handleCompare = () => {
    if (selectedCities.length === 2) {
      navigate('/compare', { state: { cities: selectedCities } });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Explore Safe Destinations
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Compare cities, view safety analytics, and make informed travel decisions with our comprehensive Women Safety Index
        </p>
      </motion.div>

      {/* Data Source Indicator */}
      {!citiesLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
        >
          <div className={`w-2 h-2 rounded-full ${isUsingSupabase ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isUsingSupabase ? 'Connected to live database' : 'Using local data'}
          </span>
          <button
            onClick={refreshCities}
            className="p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </button>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cities</p>
              <p className="text-3xl text-purple-600 dark:text-purple-400">{cities.length}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Safety</p>
              <p className="text-3xl text-green-600 dark:text-green-400">
                {cities.filter((c) => c.safetyScore >= 80).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              ✓
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Moderate Safety</p>
              <p className="text-3xl text-yellow-600 dark:text-yellow-400">
                {cities.filter((c) => c.safetyScore >= 70 && c.safetyScore < 80).length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">States Covered</p>
              <p className="text-3xl text-blue-600 dark:text-blue-400">
                {new Set(cities.map((c) => c.state)).size}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              🗺
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
        >
          <h3 className="text-lg text-gray-900 dark:text-white mb-4">Top 5 Safest Cities</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9333ea" />
              <YAxis stroke="#9333ea" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e9d5ff',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
        >
          <h3 className="text-lg text-gray-900 dark:text-white mb-4">Safety Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={safetyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {safetyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {safetyDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by city or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="pl-12 pr-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="highest">Highest Safety</option>
            <option value="lowest">Lowest Safety</option>
            <option value="budget">Budget Friendly</option>
            <option value="recommended">Most Recommended</option>
          </select>
        </div>

        {/* Filter Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {(filters.state.length +
            filters.safetyLevel.length +
            filters.budgetLevel.length +
            filters.activities.length) > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white text-purple-600 text-sm">
              {filters.state.length +
                filters.safetyLevel.length +
                filters.budgetLevel.length +
                filters.activities.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Comparison Mode Banner */}
      {selectedCities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-900 dark:text-white">
              {selectedCities.length} {selectedCities.length === 1 ? 'city' : 'cities'} selected for comparison
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCities.length === 1
                ? 'Select one more city to compare'
                : 'Click compare to view side-by-side analysis'}
            </p>
          </div>
          {selectedCities.length === 2 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompare}
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Compare Now
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          isOpen={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
        />

        {/* Cities Grid */}
        <div className="flex-1">
          {filteredCities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-900 dark:text-white mb-2">No cities found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Showing {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    onSelect={handleCitySelect}
                    isSelected={selectedCities.some((c) => c.id === city.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
