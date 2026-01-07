import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import ServiceDetail from './pages/ServiceDetail';
import NewsDetail from './pages/NewsDetail';
import EventDetail from './pages/EventDetail';
import CareerDetail from './pages/CareerDetail';

// API Services
import { companyAPI } from './api/apiService';

// Scroll to top on route change
function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Otherwise scroll to top
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await companyAPI.getInfo();
        setCompanyInfo(response.data);
      } catch (err) {
        console.error('Error fetching company info:', err);
      }
    };
    fetchCompanyInfo();
  }, []);

  return (
    <div className="App">
      <ScrollToTopOnNavigate />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:slug" element={<ProductDetail companyInfo={companyInfo} />} />
        <Route path="/services/:slug" element={<ServiceDetail companyInfo={companyInfo} />} />
        <Route path="/news/:slug" element={<NewsDetail companyInfo={companyInfo} />} />
        <Route path="/events/:slug" element={<EventDetail companyInfo={companyInfo} />} />
        <Route path="/careers/:slug" element={<CareerDetail companyInfo={companyInfo} />} />
      </Routes>
    </div>
  );
}

// Wrap App with ThemeProvider and Router
function AppWithProviders() {
  return (
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
}

export default AppWithProviders;
