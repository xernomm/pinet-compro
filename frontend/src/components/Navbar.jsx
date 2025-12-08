import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { getImageUrl } from '../utils/imageUtils';

const Navbar = ({ companyInfo }) => {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'services', label: 'Services' },
        { id: 'values', label: 'Values' },
        { id: 'products', label: 'Products' },
        { id: 'partners', label: 'Partners' },
        { id: 'clients', label: 'Clients' },
        { id: 'news', label: 'News' },
        { id: 'events', label: 'Events' },
        { id: 'careers', label: 'Careers' },
        { id: 'contact', label: 'Contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Update active section based on scroll position
            const sections = navItems.map(item => item.id);
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-md shadow-lg'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => scrollToSection('home')}
                        >
                            {companyInfo?.logo_url ? (
                                <img
                                    src={getImageUrl(companyInfo.logo_url)}
                                    alt={companyInfo.company_name}
                                    className="h-12"
                                    style={{
                                        width: "65%",
                                        height: "65%"
                                    }}
                                />
                            ) : (
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                                    {companyInfo?.company_name || 'Company'}
                                </span>
                            )}
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeSection === item.id
                                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            {/* Theme Toggle */}
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    ml: 2,
                                    color: theme === 'dark' ? '#fbbf24' : '#dc2626',
                                }}
                            >
                                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-2">
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    color: theme === 'dark' ? '#fbbf24' : '#dc2626',
                                }}
                            >
                                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <IconButton
                                onClick={handleDrawerToggle}
                                sx={{
                                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
                    },
                }}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            Menu
                        </span>
                        <IconButton onClick={handleDrawerToggle}>
                            <CloseIcon sx={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }} />
                        </IconButton>
                    </div>
                    <List>
                        {navItems.map((item) => (
                            <ListItem
                                button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                sx={{
                                    borderRadius: '8px',
                                    mb: 1,
                                    backgroundColor: activeSection === item.id
                                        ? (theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)')
                                        : 'transparent',
                                    '&:hover': {
                                        backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: activeSection === item.id
                                                ? (theme === 'dark' ? '#ef4444' : '#dc2626')
                                                : (theme === 'dark' ? '#f9fafb' : '#111827'),
                                            fontWeight: activeSection === item.id ? 600 : 400,
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </>
    );
};

export default Navbar;
