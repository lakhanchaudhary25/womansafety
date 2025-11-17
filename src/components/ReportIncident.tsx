import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, MapPin, Calendar, FileText } from 'lucide-react';
import { useCities } from '../lib/use-cities';
import { useIncidentReports } from '../lib/use-incident-reports';

export function ReportIncident() {
  const { cities } = useCities();
  const { reports, submitReport } = useIncidentReports();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    date: '',
    time: '',
    location: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submitReport({
      city: formData.city,
      date: formData.date,
      description: formData.description,
      severity: formData.severity,
      location: formData.location,
      time: formData.time
    });

    if (result.success) {
      setShowSuccess(true);
      setShowError(false);

      // Reset form
      setFormData({
        city: '',
        date: '',
        time: '',
        location: '',
        severity: 'Medium',
        description: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          Report an Incident
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Help make our community safer by reporting safety incidents. Your reports remain anonymous and help other women travelers make informed decisions.
        </p>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-green-800 dark:text-green-300">Report Submitted Successfully</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Thank you for helping make travel safer for women
            </p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 flex items-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="text-red-800 dark:text-red-300">Submission Failed</h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              Unable to submit report. Your report has been saved locally.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
        >
          <h2 className="text-2xl text-gray-900 dark:text-white mb-6">Incident Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* City Selection */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.city}>
                      {city.city}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Specific Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., MG Road Metro Station"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Low', 'Medium', 'High'].map((severity) => (
                  <label
                    key={severity}
                    className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.severity === severity
                        ? getSeverityColor(severity)
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={severity}
                      checked={formData.severity === severity}
                      onChange={(e) =>
                        setFormData({ ...formData, severity: e.target.value as any })
                      }
                      className="sr-only"
                    />
                    <span>{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  required
                  rows={5}
                  placeholder="Please describe what happened..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> This is a mock incident reporting system for demonstration purposes. In real emergencies, please call 112 (Emergency) or 1091 (Women Helpline).
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all shadow-lg hover:shadow-xl"
            >
              Submit Report
            </motion.button>
          </form>
        </motion.div>

        {/* Recent Reports Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">
              Recent Reports ({reports.length})
            </h3>

            {reports.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No reports yet. Your reports will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reports.slice(0, 5).map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-900 dark:text-white">{report.city}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {report.location}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {report.date} at {report.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-700">
            <h3 className="text-lg text-red-800 dark:text-red-300 mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Emergency Services</p>
                <p className="text-xl text-red-900 dark:text-red-200">112</p>
              </div>
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Women Helpline</p>
                <p className="text-xl text-red-900 dark:text-red-200">1091</p>
              </div>
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Police</p>
                <p className="text-xl text-red-900 dark:text-red-200">100</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
