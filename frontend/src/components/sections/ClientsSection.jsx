import React, { useState } from 'react';
import { IconButton, Chip, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ClientsSection = ({ clients }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const activeClients = clients.filter(client => client.is_active);
    const clientsWithTestimonials = activeClients.filter(client => client.testimonial);
    const featuredClients = activeClients.filter(client => client.is_featured);

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

    return (
        <section id="clients" className="section-container">
            <h2 className="section-title">Our Clients</h2>
            <p className="section-subtitle">
                Trusted by leading organizations across industries
            </p>

            {/* Testimonials Carousel */}
            {clientsWithTestimonials.length > 0 && (
                <div className="mb-16">
                    <div className="card p-8 md:p-12 max-w-4xl mx-auto relative">
                        <FormatQuoteIcon
                            sx={{
                                fontSize: 80,
                                color: 'rgba(220, 38, 38, 0.1)',
                                position: 'absolute',
                                top: 20,
                                left: 20,
                            }}
                        />

                        <div className="relative z-10 animate-fadeIn" key={currentTestimonial}>
                            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                                "{clientsWithTestimonials[currentTestimonial].testimonial}"
                            </p>

                            <div className="flex items-center space-x-4">
                                {clientsWithTestimonials[currentTestimonial].logo_url && (
                                    <img
                                        src={getImageUrl(clientsWithTestimonials[currentTestimonial].logo_url)}
                                        alt={clientsWithTestimonials[currentTestimonial].name}
                                        className="w-16 h-16 object-contain rounded-full bg-gray-100 dark:bg-dark-800 p-2"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                        {clientsWithTestimonials[currentTestimonial].testimonial_author || clientsWithTestimonials[currentTestimonial].name}
                                    </div>
                                    {clientsWithTestimonials[currentTestimonial].testimonial_position && (
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {clientsWithTestimonials[currentTestimonial].testimonial_position}
                                        </div>
                                    )}
                                    <div className="text-primary-600 dark:text-primary-400 font-medium">
                                        {clientsWithTestimonials[currentTestimonial].name}
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
                                        left: { xs: 8, md: -20 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        '&:hover': {
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                                <IconButton
                                    onClick={nextTestimonial}
                                    sx={{
                                        position: 'absolute',
                                        right: { xs: 8, md: -20 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        '&:hover': {
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    <ChevronRightIcon />
                                </IconButton>

                                <div className="flex justify-center mt-6 space-x-2">
                                    {clientsWithTestimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentTestimonial(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTestimonial
                                                ? 'bg-primary-600 w-6'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Client Logos Grid */}
            <div>
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                    Trusted By
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {activeClients.map((client, index) => (
                        <Tooltip
                            key={client.id}
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
                                        <div className="text-xs">Partner since {client.collaboration_since}</div>
                                    )}
                                </div>
                            }
                            arrow
                        >
                            <div
                                className="card p-6 h-32 flex flex-col items-center justify-center group cursor-pointer relative"
                                style={{
                                    animation: `scaleIn 0.5s ease-out ${index * 0.05}s both`,
                                }}
                                onClick={() => client.website_url && window.open(client.website_url, '_blank')}
                            >
                                {client.is_featured && (
                                    <div className="absolute top-2 right-2">
                                        <StarIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                                    </div>
                                )}

                                {client.logo_url ? (
                                    <img
                                        src={getImageUrl(client.logo_url)}
                                        alt={client.name}
                                        className="max-w-full max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                                            fontSize: '0.7rem',
                                            height: '20px',
                                        }}
                                    />
                                )}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientsSection;
