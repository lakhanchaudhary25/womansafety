import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './lib/theme-context';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ComparePage } from './components/ComparePage';
import { MapView } from './components/MapView';
import { ReportIncident } from './components/ReportIncident';
import { AboutPage } from './components/AboutPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}
