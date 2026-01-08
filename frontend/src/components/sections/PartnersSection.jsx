import React, { useState, useRef } from 'react';
import { Tooltip, Chip } from '@mui/material';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';
import HandshakeIcon from '@mui/icons-material/Handshake';

const PartnersSection = ({ partners }) => {
    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);

    const activePartners = partners.filter(partner => partner.is_active);

    if (activePartners.length === 0) {
        return (
            <section id="partners" className="section-container bg-gray-50 dark:bg-dark-900">
                <h2 className="section-title">Our Partners</h2>
                <p className="section-subtitle">
                    Collaborating with industry leaders to deliver excellence
                </p>
                <GridPlaceholder count={4} type="partner" />
            </section>
        );
    }

    const partnershipTypeConfig = {
        technology: {
            gradient: 'from-blue-500 to-indigo-600',
            bgLight: 'rgba(59, 130, 246, 0.1)',
            text: '#3b82f6'
        },
        strategic: {
            gradient: 'from-emerald-500 to-teal-600',
            bgLight: 'rgba(16, 185, 129, 0.1)',
            text: '#10b981'
        },
        vendor: {
            gradient: 'from-purple-500 to-violet-600',
            bgLight: 'rgba(139, 92, 246, 0.1)',
            text: '#8b5cf6'
        },
        solution: {
            gradient: 'from-amber-500 to-orange-600',
            bgLight: 'rgba(245, 158, 11, 0.1)',
            text: '#f59e0b'
        },
        other: {
            gradient: 'from-gray-500 to-slate-600',
            bgLight: 'rgba(107, 114, 128, 0.1)',
            text: '#6b7280'
        },
    };

    // Use activePartners directly (no duplication)

    // Group partners by type for visual organization
    const partnersByType = activePartners.reduce((acc, partner) => {
        const type = partner.partnership_type || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(partner);
        return acc;
    }, {});

    return (
        <section id="partners" className="section-container bg-gray-50 dark:bg-dark-900 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white mb-6 shadow-lg">
                        <HandshakeIcon sx={{ fontSize: 32 }} />
                    </div>
                    <h2 className="section-title">Our Partners</h2>
                    <p className="section-subtitle">
                        Collaborating with industry leaders to deliver excellence
                    </p>
                </div>

                {/* Partnership Type Stats */}
                {Object.keys(partnersByType).length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {Object.entries(partnersByType).map(([type, typePartners]) => {
                            const config = partnershipTypeConfig[type] || partnershipTypeConfig.other;
                            return (
                                <div
                                    key={type}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-sm"
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full bg-gradient-to-br ${config.gradient}`}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                        {type}
                                    </span>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: config.bgLight,
                                            color: config.text
                                        }}
                                    >
                                        {typePartners.length}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Partners Marquee - Scrolling Left */}
                <div className="relative mb-6">
                    {/* Gradient Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>

                    <div
                        ref={marqueeRef}
                        className="overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div
                            className={`flex gap-6 ${isPaused ? '' : 'animate-marquee-left'}`}
                            style={{
                                width: 'fit-content',
                                animationPlayState: isPaused ? 'paused' : 'running',
                            }}
                        >
                            {activePartners.map((partner, index) => {
                                const config = partnershipTypeConfig[partner.partnership_type] || partnershipTypeConfig.other;
                                return (
                                    <Tooltip
                                        key={`${partner.id}-${index}`}
                                        title={
                                            <div className="p-2">
                                                <div className="font-semibold mb-1">{partner.name}</div>
                                                {partner.description && (
                                                    <div className="text-sm mb-2">{partner.description}</div>
                                                )}
                                                {partner.partnership_since && (
                                                    <div className="text-xs">Partner since {partner.partnership_since}</div>
                                                )}
                                            </div>
                                        }
                                        arrow
                                    >
                                        <div
                                            className="flex-shrink-0 group cursor-pointer"
                                            onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                                        >
                                            <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 w-44 h-36 flex flex-col items-center justify-center border border-gray-200 dark:border-dark-700 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 overflow-hidden">
                                                {/* Top gradient bar based on partnership type */}
                                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                                                {partner.logo_url ? (
                                                    <img
                                                        src={getImageUrl(partner.logo_url)}
                                                        alt={partner.name}
                                                        className="max-w-full max-h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                            {partner.name}
                                                        </div>
                                                    </div>
                                                )}

                                                {partner.partnership_type && (
                                                    <Chip
                                                        label={partner.partnership_type}
                                                        size="small"
                                                        sx={{
                                                            mt: 2,
                                                            fontSize: '0.65rem',
                                                            height: '20px',
                                                            textTransform: 'capitalize',
                                                            backgroundColor: config.bgLight,
                                                            color: config.text,
                                                            fontWeight: 600,
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

                {/* Second Row - Scrolling Right (only if many partners) */}
                {activePartners.length > 4 && (
                    <div className="relative">
                        {/* Gradient Fade Edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-dark-900 to-transparent z-10 pointer-events-none"></div>

                        <div
                            className="overflow-hidden"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <div
                                className={`flex gap-6 ${isPaused ? '' : 'animate-marquee-right'}`}
                                style={{
                                    width: 'fit-content',
                                    animationPlayState: isPaused ? 'paused' : 'running',
                                }}
                            >
                                {[...activePartners].reverse().map((partner, index) => {
                                    const config = partnershipTypeConfig[partner.partnership_type] || partnershipTypeConfig.other;
                                    return (
                                        <Tooltip
                                            key={`rev-${partner.id}-${index}`}
                                            title={
                                                <div className="p-2">
                                                    <div className="font-semibold mb-1">{partner.name}</div>
                                                    {partner.description && (
                                                        <div className="text-sm mb-2">{partner.description}</div>
                                                    )}
                                                    {partner.partnership_since && (
                                                        <div className="text-xs">Partner since {partner.partnership_since}</div>
                                                    )}
                                                </div>
                                            }
                                            arrow
                                        >
                                            <div
                                                className="flex-shrink-0 group cursor-pointer"
                                                onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                                            >
                                                <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 w-44 h-36 flex flex-col items-center justify-center border border-gray-200 dark:border-dark-700 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 overflow-hidden">
                                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                                                    {partner.logo_url ? (
                                                        <img
                                                            src={getImageUrl(partner.logo_url)}
                                                            alt={partner.name}
                                                            className="max-w-full max-h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                        />
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                                {partner.name}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {partner.partnership_type && (
                                                        <Chip
                                                            label={partner.partnership_type}
                                                            size="small"
                                                            sx={{
                                                                mt: 2,
                                                                fontSize: '0.65rem',
                                                                height: '20px',
                                                                textTransform: 'capitalize',
                                                                backgroundColor: config.bgLight,
                                                                color: config.text,
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    )}

                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for marquee animations */}
            <style>{`
                @keyframes marquee-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                @keyframes marquee-right {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .animate-marquee-left {
                    animation: marquee-left ${activePartners.length * 4}s linear infinite;
                }
                .animate-marquee-right {
                    animation: marquee-right ${activePartners.length * 4}s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default PartnersSection;
