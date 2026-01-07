import React, { useState, useEffect, useRef } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';

const AboutSection = ({ companyInfo }) => {
    const [activeWidget, setActiveWidget] = useState(null);
    const [isVisible, setIsVisible] = useState({});
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.dataset.widget]: true,
                        }));
                    }
                });
            },
            { threshold: 0.2 }
        );

        const widgets = document.querySelectorAll('[data-widget]');
        widgets.forEach((widget) => observer.observe(widget));

        return () => observer.disconnect();
    }, []);

    if (!companyInfo) return null;

    const widgetData = [
        {
            id: 'about',
            label: 'About Us',
            icon: <BusinessIcon sx={{ fontSize: 40 }} />,
            content: companyInfo.about,
            gradient: 'from-red-500 to-rose-600',
            delay: '0ms',
        },
        {
            id: 'history',
            label: 'Our History',
            icon: <HistoryIcon sx={{ fontSize: 40 }} />,
            content: companyInfo.history,
            gradient: 'from-amber-500 to-orange-600',
            delay: '100ms',
        },
        {
            id: 'vision',
            label: 'Vision',
            icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
            content: companyInfo.vision,
            gradient: 'from-blue-500 to-indigo-600',
            delay: '200ms',
        },
        {
            id: 'mission',
            label: 'Mission',
            icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
            content: companyInfo.mission,
            gradient: 'from-emerald-500 to-teal-600',
            delay: '300ms',
        },
    ].filter(widget => widget.content);

    const statsData = [
        {
            id: 'years',
            value: companyInfo.established_year ? new Date().getFullYear() - companyInfo.established_year : null,
            label: 'Years of Excellence',
            suffix: '+',
            icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
            gradient: 'from-red-500 to-rose-600',
        },
        {
            id: 'established',
            value: companyInfo.established_year,
            label: 'Established',
            prefix: 'Est. ',
            icon: <GroupsIcon sx={{ fontSize: 32 }} />,
            gradient: 'from-orange-500 to-amber-600',
        },
        {
            id: 'commitment',
            value: 100,
            label: 'Commitment',
            suffix: '%',
            icon: <HandshakeIcon sx={{ fontSize: 32 }} />,
            gradient: 'from-emerald-500 to-teal-600',
        },
    ].filter(stat => stat.value !== null);

    const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
        const [count, setCount] = useState(0);
        const countRef = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        let start = 0;
                        const end = parseInt(value);
                        const duration = 2000;
                        const increment = end / (duration / 16);

                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= end) {
                                setCount(end);
                                clearInterval(timer);
                            } else {
                                setCount(Math.floor(start));
                            }
                        }, 16);
                    }
                },
                { threshold: 0.5 }
            );

            if (countRef.current) {
                observer.observe(countRef.current);
            }

            return () => observer.disconnect();
        }, [value]);

        return (
            <span ref={countRef}>
                {prefix}{count}{suffix}
            </span>
        );
    };

    return (
        <section id="about" className="section-container bg-gray-50 dark:bg-dark-900 relative overflow-hidden" ref={sectionRef}>
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/10 to-rose-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="section-title">About {companyInfo.company_name}</h2>
                    {companyInfo.tagline && (
                        <p className="section-subtitle">{companyInfo.tagline}</p>
                    )}
                </div>

                {/* Animated Stats Cards */}
                {statsData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {statsData.map((stat, index) => (
                            <div
                                key={stat.id}
                                data-widget={`stat-${stat.id}`}
                                className={`
                                    relative group cursor-pointer overflow-hidden
                                    bg-white dark:bg-dark-800 rounded-2xl p-8
                                    border border-gray-200 dark:border-dark-700
                                    transform transition-all duration-500
                                    hover:scale-105 hover:-translate-y-2
                                    ${isVisible[`stat-${stat.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                {/* Icon with pulse effect */}
                                <div className={`
                                    inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
                                    bg-gradient-to-br ${stat.gradient} text-white
                                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                                    shadow-lg group-hover:shadow-xl
                                `}>
                                    {stat.icon}
                                </div>

                                {/* Counter */}
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                                    <AnimatedCounter
                                        value={stat.value}
                                        prefix={stat.prefix || ''}
                                        suffix={stat.suffix || ''}
                                    />
                                </div>

                                <div className="text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.label}
                                </div>

                                {/* Decorative corner */}
                                <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-5 group-hover:opacity-20 transition-opacity duration-500`}></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Widget Cards */}
                {widgetData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {widgetData.map((widget, index) => (
                            <div
                                key={widget.id}
                                data-widget={widget.id}
                                className={`
                                    relative group cursor-pointer overflow-hidden
                                    bg-white dark:bg-dark-800 rounded-2xl
                                    border border-gray-200 dark:border-dark-700
                                    transform transition-all duration-700
                                    ${activeWidget === widget.id ? 'ring-2 ring-primary-500 shadow-red-glow' : ''}
                                    ${isVisible[widget.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
                                style={{ transitionDelay: widget.delay }}
                                onClick={() => setActiveWidget(activeWidget === widget.id ? null : widget.id)}
                            >
                                {/* Header Bar with Gradient */}
                                <div className={`
                                    flex items-center gap-4 p-6
                                    bg-gradient-to-r ${widget.gradient}
                                    text-white
                                `}>
                                    <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                        {widget.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">{widget.label}</h3>

                                    {/* Expand Indicator */}
                                    <div className={`
                                        ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                                        transition-transform duration-300
                                        ${activeWidget === widget.id ? 'rotate-180' : ''}
                                    `}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className={`
                                    overflow-hidden transition-all duration-500
                                    ${activeWidget === widget.id ? 'max-h-96 p-6' : 'max-h-24 p-6'}
                                `}>
                                    <div
                                        className={`
                                            text-gray-700 dark:text-gray-300 leading-relaxed
                                            ${activeWidget === widget.id ? '' : 'line-clamp-3'}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: widget.content }}
                                    />
                                </div>

                                {/* Hover Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact Cards with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companyInfo.address && (
                        <div
                            data-widget="location"
                            className={`
                                relative overflow-hidden rounded-2xl p-8
                                bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg
                                border border-gray-200/50 dark:border-dark-700/50
                                transform transition-all duration-700 hover:scale-[1.02]
                                ${isVisible['location'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                                    <LocationOnIcon sx={{ fontSize: 28 }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
                                        Our Location
                                    </h3>
                                    <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                        <p className="font-medium">{companyInfo.address}</p>
                                        {(companyInfo.city || companyInfo.province || companyInfo.postal_code) && (
                                            <p>
                                                {[companyInfo.city, companyInfo.province, companyInfo.postal_code]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        )}
                                        {companyInfo.country && <p>{companyInfo.country}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-red-500/10 to-rose-500/5 rounded-full blur-2xl"></div>
                        </div>
                    )}

                    <div
                        data-widget="contact"
                        className={`
                            relative overflow-hidden rounded-2xl p-8
                            bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg
                            border border-gray-200/50 dark:border-dark-700/50
                            transform transition-all duration-700 hover:scale-[1.02]
                            ${isVisible['contact'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
                        `}
                        style={{ transitionDelay: '100ms' }}
                    >
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-6">
                            Get In Touch
                        </h3>
                        <div className="space-y-4">
                            {companyInfo.email && (
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <EmailIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">Email</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {companyInfo.email}
                                        </p>
                                    </div>
                                </a>
                            )}
                            {companyInfo.phone && (
                                <a
                                    href={`tel:${companyInfo.phone}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <PhoneIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">Phone</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {companyInfo.phone}
                                        </p>
                                    </div>
                                </a>
                            )}
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
