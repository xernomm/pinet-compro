import React from 'react';
import { Tooltip, Chip } from '@mui/material';
import { getImageUrl } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const PartnersSection = ({ partners }) => {
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

    const partnershipTypeColors = {
        technology: 'primary',
        strategic: 'success',
        vendor: 'info',
        solution: 'warning',
        other: 'default',
    };

    return (
        <section id="partners" className="section-container bg-gray-50 dark:bg-dark-900">
            <h2 className="section-title">Our Partners</h2>
            <p className="section-subtitle">
                Collaborating with industry leaders to deliver excellence
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {activePartners.map((partner, index) => (
                    <Tooltip
                        key={partner.id}
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
                            className="card p-6 h-32 flex flex-col items-center justify-center group cursor-pointer"
                            style={{
                                animation: `scaleIn 0.5s ease-out ${index * 0.05}s both`,
                            }}
                            onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                        >
                            {partner.logo_url ? (
                                <img
                                    src={getImageUrl(partner.logo_url)}
                                    alt={partner.name}
                                    className="max-w-full max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {partner.name}
                                    </div>
                                </div>
                            )}
                            {partner.partnership_type && (
                                <Chip
                                    label={partner.partnership_type}
                                    size="small"
                                    color={partnershipTypeColors[partner.partnership_type] || 'default'}
                                    sx={{
                                        mt: 2,
                                        fontSize: '0.7rem',
                                        height: '20px',
                                        textTransform: 'capitalize',
                                    }}
                                />
                            )}
                        </div>
                    </Tooltip>
                ))}
            </div>
        </section>
    );
};

export default PartnersSection;
