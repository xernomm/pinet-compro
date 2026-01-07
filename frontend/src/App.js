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

// Scroll to top or to hash element on route change
function ScrollToTopOnNavigate() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    const pathname = location.pathname;

    // Function to scroll to hash element with offset
    const scrollToHash = () => {
      if (hash) {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          return true;
        }
      }
      return false;
    };

    // If on home page with hash, try to scroll with retries
    if (pathname === '/' && hash) {
      // Try immediately
      if (!scrollToHash()) {
        // If element not found, retry multiple times as DOM may still be loading
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
          attempts++;
          if (scrollToHash() || attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    } else if (!hash) {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

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
