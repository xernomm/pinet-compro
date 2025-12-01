import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ServicesSection = ({ services }) => {
    const [selectedService, setSelectedService] = useState(null);
    const activeServices = services.filter(service => service.is_active);

    const handleOpenModal = (service) => {
        setSelectedService(service);
    };

    const handleCloseModal = () => {
        setSelectedService(null);
    };

    if (activeServices.length === 0) {
        return (
            <section id="services" className="section-container">
                <h2 className="section-title">Our Services</h2>
                <p className="section-subtitle">
                    Comprehensive solutions tailored to meet your business needs
                </p>
                <GridPlaceholder count={3} type="default" />
            </section>
        );
    }

    return (
        <section id="services" className="section-container">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
                Comprehensive solutions tailored to meet your business needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeServices.map((service, index) => (
                    <div
                        key={service.id}
                        className="card card-hover-red p-6 cursor-pointer group overflow-hidden"
                        onClick={() => handleOpenModal(service)}
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Icon or Image */}
                        <div className="mb-4 relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                            {service.image_url ? (
                                <img
                                    src={getImageUrl(service.image_url)}
                                    alt={service.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : service.icon ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <i className={`${service.icon} text-6xl text-primary-600 dark:text-primary-400`} />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                                        {service.name.charAt(0)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {service.name}
                        </h3>
                        {service.short_description && (
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                                {service.short_description}
                            </p>
                        )}
                        <div className="mt-4 text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                            Learn More
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Service Detail Modal */}
            <Dialog
                open={!!selectedService}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                    },
                }}
            >
                {selectedService && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {selectedService.name}
                            </div>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseModal}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: 'var(--color-text)',
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            {selectedService.image_url && (
                                <img
                                    src={getImageUrl(selectedService.image_url)}
                                    alt={selectedService.name}
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                            )}
                            {selectedService.description && (
                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: selectedService.description }}
                                />
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </section>
    );
};

export default ServicesSection;
