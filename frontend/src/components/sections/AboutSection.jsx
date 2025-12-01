import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const AboutSection = ({ companyInfo }) => {
    const [activeTab, setActiveTab] = useState(0);

    if (!companyInfo) return null;

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const tabs = [
        {
            label: 'About Us',
            icon: <BusinessIcon />,
            content: companyInfo.about,
        },
        {
            label: 'History',
            icon: <HistoryIcon />,
            content: companyInfo.history,
        },
        {
            label: 'Vision',
            icon: <VisibilityIcon />,
            content: companyInfo.vision,
        },
        {
            label: 'Mission',
            icon: <TrackChangesIcon />,
            content: companyInfo.mission,
        },
    ].filter(tab => tab.content);

    return (
        <section id="about" className="section-container bg-gray-50 dark:bg-dark-900">
            <div className="text-center mb-12">
                <h2 className="section-title">About {companyInfo.company_name}</h2>
                {companyInfo.tagline && (
                    <p className="section-subtitle">{companyInfo.tagline}</p>
                )}
            </div>

            {/* Stats Cards */}
            {companyInfo.established_year && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card card-hover-red p-8 text-center">
                        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            {new Date().getFullYear() - companyInfo.established_year}+
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Years of Excellence</div>
                    </div>
                    <div className="card card-hover-red p-8 text-center">
                        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            Est. {companyInfo.established_year}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Established</div>
                    </div>
                    <div className="card card-hover-red p-8 text-center">
                        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            100%
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Commitment</div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            {tabs.length > 0 && (
                <div className="card p-6">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            mb: 3,
                            '& .MuiTab-root': {
                                color: 'var(--color-text-secondary)',
                                fontWeight: 600,
                                '&.Mui-selected': {
                                    color: '#dc2626',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#dc2626',
                            },
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                label={tab.label}
                                icon={tab.icon}
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>

                    {tabs.map((tab, index) => (
                        <Box
                            key={index}
                            role="tabpanel"
                            hidden={activeTab !== index}
                            className="animate-fadeIn"
                        >
                            {activeTab === index && (
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <div
                                        className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                                        dangerouslySetInnerHTML={{ __html: tab.content }}
                                    />
                                </div>
                            )}
                        </Box>
                    ))}
                </div>
            )}

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {companyInfo.address && (
                    <div className="card p-6">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                            Our Location
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400">
                            <p>{companyInfo.address}</p>
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
                )}

                <div className="card p-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                        Get In Touch
                    </h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                        {companyInfo.email && (
                            <p>
                                <span className="font-medium">Email:</span>{' '}
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    {companyInfo.email}
                                </a>
                            </p>
                        )}
                        {companyInfo.phone && (
                            <p>
                                <span className="font-medium">Phone:</span>{' '}
                                <a
                                    href={`tel:${companyInfo.phone}`}
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    {companyInfo.phone}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
