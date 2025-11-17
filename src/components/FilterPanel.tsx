import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Filters {
  state: string[];
  safetyLevel: string[];
  budgetLevel: string[];
  activities: string[];
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const states = [
  'All',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Telangana',
  'Tamil Nadu',
  'West Bengal',
  'Rajasthan',
  'Chandigarh',
  'Goa',
  'Kerala',
  'Gujarat',
  'Odisha',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Himachal Pradesh',
  'Puducherry',
  'Jammu & Kashmir'
];

const safetyLevels = ['High (80+)', 'Moderate (70-79)', 'Low (<70)'];
const budgetLevels = ['Low', 'Medium', 'High'];
const activityOptions = [
  'shopping',
  'nightlife',
  'beaches',
  'temples',
  'trekking',
  'cafes',
  'parks',
  'monuments',
  'museums',
  'lakes',
  'water sports',
  'churches',
  'backwaters',
  'ghats',
  'gardens'
];

export function FilterPanel({ filters, onFilterChange, isOpen, onClose }: FilterPanelProps) {
  const handleStateToggle = (state: string) => {
    if (state === 'All') {
      onFilterChange({ ...filters, state: [] });
    } else {
      const newStates = filters.state.includes(state)
        ? filters.state.filter((s) => s !== state)
        : [...filters.state, state];
      onFilterChange({ ...filters, state: newStates });
    }
  };

  const handleSafetyToggle = (level: string) => {
    const newLevels = filters.safetyLevel.includes(level)
      ? filters.safetyLevel.filter((l) => l !== level)
      : [...filters.safetyLevel, level];
    onFilterChange({ ...filters, safetyLevel: newLevels });
  };

  const handleBudgetToggle = (level: string) => {
    const newLevels = filters.budgetLevel.includes(level)
      ? filters.budgetLevel.filter((l) => l !== level)
      : [...filters.budgetLevel, level];
    onFilterChange({ ...filters, budgetLevel: newLevels });
  };

  const handleActivityToggle = (activity: string) => {
    const newActivities = filters.activities.includes(activity)
      ? filters.activities.filter((a) => a !== activity)
      : [...filters.activities, activity];
    onFilterChange({ ...filters, activities: newActivities });
  };

  const clearFilters = () => {
    onFilterChange({ state: [], safetyLevel: [], budgetLevel: [], activities: [] });
  };

  const activeFilterCount =
    filters.state.length +
    filters.safetyLevel.length +
    filters.budgetLevel.length +
    filters.activities.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white dark:bg-gray-800 border-r border-purple-200 dark:border-purple-700 overflow-y-auto z-50 lg:z-0 rounded-r-2xl lg:rounded-2xl shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-600 text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                  <button onClick={onClose} className="lg:hidden">
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* State Filter */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-3">State</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {states.map((state) => (
                    <label
                      key={state}
                      className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={state === 'All' ? filters.state.length === 0 : filters.state.includes(state)}
                        onChange={() => handleStateToggle(state)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Safety Level Filter */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-3">Safety Level</h4>
                <div className="space-y-2">
                  {safetyLevels.map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.safetyLevel.includes(level)}
                        onChange={() => handleSafetyToggle(level)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-3">Budget Level</h4>
                <div className="space-y-2">
                  {budgetLevels.map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.budgetLevel.includes(level)}
                        onChange={() => handleBudgetToggle(level)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activities Filter */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-3">Activities</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activityOptions.map((activity) => (
                    <label
                      key={activity}
                      className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.activities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {activity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
