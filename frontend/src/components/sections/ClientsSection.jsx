import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Chip, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ClientsSection = ({ clients }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);

    const activeClients = clients.filter(client => client.is_active);
    const clientsWithTestimonials = activeClients.filter(client => client.testimonial);

    // Auto-advance testimonials
    useEffect(() => {
        if (clientsWithTestimonials.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % clientsWithTestimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [clientsWithTestimonials.length]);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % clientsWithTestimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + clientsWithTestimonials.length) % clientsWithTestimonials.length);
    };

    if (activeClients.length === 0) {
        return (
            <section id="clients" className="section-container">
                <h2 className="section-title">Our Clients</h2>
                <p className="section-subtitle">
                    Trusted by leading organizations across industries
                </p>
                <GridPlaceholder count={4} type="client" />
            </section>
        );
    }

    // Use activeClients directly (no duplication)

    // Industry type styling config (similar to partners)
    const industryTypeConfig = {
        technology: {
            gradient: 'from-blue-500 to-indigo-600',
            bgLight: 'rgba(59, 130, 246, 0.1)',
            text: '#3b82f6',
            glow: 'rgba(59, 130, 246, 0.3)'
        },
        finance: {
            gradient: 'from-emerald-500 to-teal-600',
            bgLight: 'rgba(16, 185, 129, 0.1)',
            text: '#10b981',
            glow: 'rgba(16, 185, 129, 0.3)'
        },
        healthcare: {
            gradient: 'from-rose-500 to-pink-600',
            bgLight: 'rgba(244, 63, 94, 0.1)',
            text: '#f43f5e',
            glow: 'rgba(244, 63, 94, 0.3)'
        },
        manufacturing: {
            gradient: 'from-amber-500 to-orange-600',
            bgLight: 'rgba(245, 158, 11, 0.1)',
            text: '#f59e0b',
            glow: 'rgba(245, 158, 11, 0.3)'
        },
        retail: {
            gradient: 'from-purple-500 to-violet-600',
            bgLight: 'rgba(139, 92, 246, 0.1)',
            text: '#8b5cf6',
            glow: 'rgba(139, 92, 246, 0.3)'
        },
        education: {
            gradient: 'from-cyan-500 to-sky-600',
            bgLight: 'rgba(6, 182, 212, 0.1)',
            text: '#06b6d4',
            glow: 'rgba(6, 182, 212, 0.3)'
        },
        government: {
            gradient: 'from-slate-500 to-gray-600',
            bgLight: 'rgba(100, 116, 139, 0.1)',
            text: '#64748b',
            glow: 'rgba(100, 116, 139, 0.3)'
        },
        other: {
            gradient: 'from-red-500 to-rose-600',
            bgLight: 'rgba(220, 38, 38, 0.1)',
            text: '#dc2626',
            glow: 'rgba(220, 38, 38, 0.3)'
        }
    };

    // Helper to get config based on industry
    const getIndustryConfig = (industry) => {
        if (!industry) return industryTypeConfig.other;
        const lowerIndustry = industry.toLowerCase();
        return Object.keys(industryTypeConfig).find(key => lowerIndustry.includes(key))
            ? industryTypeConfig[Object.keys(industryTypeConfig).find(key => lowerIndustry.includes(key))]
            : industryTypeConfig.other;
    };

    return (
        <section id="clients" className="section-container overflow-hidden">
            <h2 className="section-title">Our Clients</h2>
            <p className="section-subtitle">
                Trusted by leading organizations across industries
            </p>

            {/* Testimonials Carousel - Enhanced */}
            {clientsWithTestimonials.length > 0 && (
                <div className="mb-16 relative">
                    <div className="relative max-w-4xl mx-auto">
                        {/* Decorative gradient orbs */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-rose-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-rose-500/10 rounded-full blur-3xl"></div>

                        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-dark-700/50 shadow-xl">
                            <FormatQuoteIcon
                                sx={{
                                    fontSize: 100,
                                    color: 'rgba(220, 38, 38, 0.15)',
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                }}
                            />

                            <div className="relative z-10" key={currentTestimonial}>
                                <div className="animate-fadeIn">
                                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed">
                                        "{clientsWithTestimonials[currentTestimonial].testimonial}"
                                    </p>

                                    <div className="flex items-center space-x-4">
                                        {clientsWithTestimonials[currentTestimonial].logo_url && (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 rounded-full blur-md opacity-30"></div>
                                                <img
                                                    src={getImageUrl(clientsWithTestimonials[currentTestimonial].logo_url)}
                                                    alt={clientsWithTestimonials[currentTestimonial].name}
                                                    className="relative w-16 h-16 object-contain rounded-full bg-white dark:bg-dark-700 p-2 ring-2 ring-primary-500/20"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                                {clientsWithTestimonials[currentTestimonial].testimonial_author || clientsWithTestimonials[currentTestimonial].name}
                                            </div>
                                            {clientsWithTestimonials[currentTestimonial].testimonial_position && (
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {clientsWithTestimonials[currentTestimonial].testimonial_position}
                                                </div>
                                            )}
                                            <div className="text-primary-600 dark:text-primary-400 font-semibold">
                                                {clientsWithTestimonials[currentTestimonial].name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {clientsWithTestimonials.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={prevTestimonial}
                                        sx={{
                                            position: 'absolute',
                                            left: { xs: 8, md: -24 },
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: 'white',
                                            boxShadow: 3,
                                            '&:hover': {
                                                backgroundColor: '#dc2626',
                                                color: 'white',
                                                transform: 'translateY(-50%) scale(1.1)',
                                            },
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={nextTestimonial}
                                        sx={{
                                            position: 'absolute',
                                            right: { xs: 8, md: -24 },
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: 'white',
                                            boxShadow: 3,
                                            '&:hover': {
                                                backgroundColor: '#dc2626',
                                                color: 'white',
                                                transform: 'translateY(-50%) scale(1.1)',
                                            },
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>

                                    <div className="flex justify-center mt-8 space-x-2">
                                        {clientsWithTestimonials.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentTestimonial(index)}
                                                className={`h-2 rounded-full transition-all duration-500 ${index === currentTestimonial
                                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 w-8'
                                                    : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Client Logos - Infinite Marquee */}
            <div className="relative">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                    Trusted By
                </h3>

                {/* Gradient Fade Edges */}
                <div className="absolute left-0 top-8 bottom-0 w-20 bg-gradient-to-r from-white dark:from-dark-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-8 bottom-0 w-20 bg-gradient-to-l from-white dark:from-dark-950 to-transparent z-10 pointer-events-none"></div>

                {/* Marquee Container */}
                <div
                    ref={marqueeRef}
                    className="overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        className={`flex gap-6 ${isPaused ? '' : 'animate-marquee'}`}
                        style={{
                            width: 'fit-content',
                            animationPlayState: isPaused ? 'paused' : 'running',
                        }}
                    >
                        {activeClients.map((client, index) => {
                            const config = getIndustryConfig(client.industry);
                            return (
                                <Tooltip
                                    key={`${client.id}-${index}`}
                                    title={
                                        <div className="p-2">
                                            <div className="font-semibold mb-1">{client.name}</div>
                                            {client.industry && (
                                                <div className="text-sm mb-1">Industry: {client.industry}</div>
                                            )}
                                            {client.description && (
                                                <div className="text-sm mb-2">{client.description}</div>
                                            )}
                                            {client.project_description && (
                                                <div className="text-sm mb-2">
                                                    <span className="font-semibold">Project:</span> {client.project_description}
                                                </div>
                                            )}
                                            {client.collaboration_since && (
                                                <div className="text-xs">Client since {client.collaboration_since}</div>
                                            )}
                                        </div>
                                    }
                                    arrow
                                >
                                    <div
                                        className="flex-shrink-0 group cursor-pointer"
                                        onClick={() => client.website_url && window.open(client.website_url, '_blank')}
                                    >
                                        <div
                                            className="relative bg-white dark:bg-dark-800 rounded-2xl p-8 w-44 h-36 flex flex-col items-center justify-center border border-gray-200 dark:border-dark-700 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 overflow-hidden"
                                            style={{
                                                '--glow-color': config.glow,
                                            }}
                                        >
                                            {/* Top gradient bar based on industry type */}
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                                            {/* Glow effect on hover */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                style={{
                                                    boxShadow: `0 0 30px ${config.glow}, inset 0 0 20px ${config.glow}`,
                                                    borderRadius: '1rem',
                                                }}
                                            ></div>

                                            {client.is_featured && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-full p-1.5 shadow-lg">
                                                        <StarIcon sx={{ fontSize: 14, color: 'white' }} />
                                                    </div>
                                                </div>
                                            )}

                                            {client.logo_url ? (
                                                <img
                                                    src={getImageUrl(client.logo_url)}
                                                    alt={client.name}
                                                    className="relative z-10 max-w-full max-h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                />
                                            ) : (
                                                <div className="relative z-10 text-center">
                                                    <div className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {client.name}
                                                    </div>
                                                </div>
                                            )}

                                            {client.industry && (
                                                <Chip
                                                    label={client.industry}
                                                    size="small"
                                                    sx={{
                                                        mt: 2,
                                                        fontSize: '0.65rem',
                                                        height: '20px',
                                                        textTransform: 'capitalize',
                                                        backgroundColor: config.bgLight,
                                                        color: config.text,
                                                        fontWeight: 600,
                                                        position: 'relative',
                                                        zIndex: 10,
                                                    }}
                                                />
                                            )}

                                            {/* Shine effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </div>
                                    </div>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CSS for marquee animation */}
            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee ${activeClients.length * 3}s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default ClientsSection;
