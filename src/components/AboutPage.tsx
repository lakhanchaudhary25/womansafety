import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Heart, Users, TrendingUp, Lock, AlertCircle, Award } from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Comprehensive safety metrics analyzed from multiple data sources including women traveler reviews, lighting conditions, and public transport accessibility.'
    },
    {
      icon: Target,
      title: 'Data-Driven Insights',
      description: 'Real-time safety scores calculated using advanced algorithms that factor in crowd density, police presence, and incident reports.'
    },
    {
      icon: Heart,
      title: 'By Women, For Women',
      description: 'Built with input from women travelers to address the unique safety concerns and travel needs of solo female travelers.'
    },
    {
      icon: Users,
      title: 'Community Powered',
      description: 'Anonymous incident reporting and user reviews help keep our safety data current and relevant for all women travelers.'
    }
  ];

  const metrics = [
    { icon: TrendingUp, value: '22+', label: 'Cities Analyzed' },
    { icon: Users, value: '1000+', label: 'Women Helped' },
    { icon: Shield, value: '85%', label: 'Avg Safety Score' },
    { icon: Award, value: '100%', label: 'Free to Use' }
  ];

  const mission = [
    {
      icon: Lock,
      title: 'Privacy & Security',
      description: 'All reports are anonymous. We never collect personal information that could identify individual users.'
    },
    {
      icon: AlertCircle,
      title: 'Transparency',
      description: 'Our safety scores are based on clear, measurable criteria that you can understand and verify.'
    },
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'We believe every woman should travel freely and confidently, armed with the right information.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          About Women Safety Index
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Empowering women travelers with data-driven safety insights to explore India confidently and safely
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700"
      >
        <h2 className="text-3xl text-gray-900 dark:text-white mb-4 text-center">Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto">
          To create a comprehensive, transparent, and accessible platform that provides women travelers with reliable safety information about destinations across India. We believe that with the right information, every woman can explore, travel, and experience the world on her own terms.
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 text-center"
            >
              <Icon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <div className="text-4xl text-purple-600 dark:text-purple-400 mb-2">
                {metric.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Features */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl text-gray-900 dark:text-white mb-8 text-center"
        >
          What Makes Us Different
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + 0.1 * index }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50"
      >
        <h2 className="text-3xl text-gray-900 dark:text-white mb-8 text-center">
          How We Calculate Safety Scores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white mb-2">Lighting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Street lighting coverage and quality in public areas
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚇</span>
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white mb-2">Transport</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Public transport safety and accessibility
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white mb-2">Crowd Density</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Population density and public space management
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white mb-2">Reviews</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real experiences from women travelers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-3xl text-gray-900 dark:text-white mb-8 text-center"
        >
          Our Core Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mission.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + 0.1 * index }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-6 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700"
      >
        <h3 className="text-lg text-yellow-800 dark:text-yellow-300 mb-3">Important Note</h3>
        <p className="text-yellow-700 dark:text-yellow-400 mb-3">
          This is a demonstration MVP (Minimum Viable Product) of the Women Safety Index platform. The safety scores and data are based on mock datasets created for demonstration purposes.
        </p>
        <p className="text-yellow-700 dark:text-yellow-400">
          <strong>In real emergencies:</strong> Please call 112 (Emergency Services) or 1091 (Women Helpline). Always trust your instincts and prioritize your personal safety above all else.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center p-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white"
      >
        <h2 className="text-3xl mb-4">Join Our Mission</h2>
        <p className="text-xl mb-6 opacity-90">
          Help us make travel safer for all women by contributing your experiences and insights
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-white text-purple-600 hover:bg-gray-100 transition-colors"
          >
            Report an Incident
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 transition-colors"
          >
            Share Feedback
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
