import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import { parseJSON } from '../../utils/imageUtils';
import { format } from 'date-fns';
import { GridPlaceholder } from '../PlaceholderCard';

const CareersSection = ({ careers }) => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const openJobs = careers.filter(job => job.status === 'open' && job.is_active);

    if (openJobs.length === 0) {
        return (
            <section id="careers" className="section-container bg-gray-50 dark:bg-dark-900">
                <h2 className="section-title">Join Our Team</h2>
                <p className="section-subtitle">
                    Build your career with us and make an impact
                </p>
                <GridPlaceholder count={3} type="career" />
            </section>
        );
    }
    const departments = ['all', ...new Set(openJobs.map(j => j.department).filter(Boolean))];

    const filteredJobs = selectedDepartment === 'all'
        ? openJobs
        : openJobs.filter(j => j.department === selectedDepartment);

    const featuredJobs = filteredJobs.filter(j => j.is_featured);
    const regularJobs = filteredJobs.filter(j => !j.is_featured);
    const displayJobs = [...featuredJobs, ...regularJobs];

    const handleOpenModal = (job) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const employmentTypeLabels = {
        full_time: 'Full Time',
        part_time: 'Part Time',
        contract: 'Contract',
        internship: 'Internship',
        freelance: 'Freelance',
    };

    const experienceLevelLabels = {
        entry: 'Entry Level',
        junior: 'Junior',
        mid: 'Mid Level',
        senior: 'Senior',
        lead: 'Lead',
        manager: 'Manager',
    };

    if (openJobs.length === 0) {
        return (
            <section id="careers" className="section-container bg-gray-50 dark:bg-dark-900">
                <h2 className="section-title">Join Our Team</h2>
                <p className="section-subtitle">
                    No open positions at the moment. Check back soon for opportunities!
                </p>
            </section>
        );
    }

    return (
        <section id="careers" className="section-container bg-gray-50 dark:bg-dark-900">
            <h2 className="section-title">Join Our Team</h2>
            <p className="section-subtitle">
                Explore exciting career opportunities and grow with us
            </p>

            {/* Department Filter */}
            {departments.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {departments.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDepartment(dept)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedDepartment === dept
                                ? 'bg-primary-600 text-white shadow-red-glow'
                                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                                }`}
                        >
                            {dept === 'all' ? 'All Departments' : dept}
                        </button>
                    ))}
                </div>
            )}

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayJobs.map((job, index) => (
                    <div
                        key={job.id}
                        className="card p-6 cursor-pointer group"
                        onClick={() => handleOpenModal(job)}
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {job.is_featured && (
                            <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 mb-3">
                                <StarIcon fontSize="small" />
                                <span className="text-sm font-semibold">Featured</span>
                            </div>
                        )}

                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {job.job_title}
                        </h3>

                        <div className="space-y-2 mb-4">
                            {job.department && (
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <WorkIcon fontSize="small" />
                                    <span>{job.department}</span>
                                </div>
                            )}

                            {job.location && (
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <LocationOnIcon fontSize="small" />
                                    <span>{job.location}</span>
                                </div>
                            )}

                            {job.application_deadline && (
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <CalendarTodayIcon fontSize="small" />
                                    <span>Apply by {formatDate(job.application_deadline)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {job.employment_type && (
                                <Chip
                                    label={employmentTypeLabels[job.employment_type] || job.employment_type}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                            {job.experience_level && (
                                <Chip
                                    label={experienceLevelLabels[job.experience_level] || job.experience_level}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </div>

                        {job.salary_range && (
                            <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                                {job.salary_range}
                            </p>
                        )}

                        <div className="text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                            View Details
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Detail Modal */}
            <Dialog
                open={!!selectedJob}
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
                {selectedJob && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {selectedJob.job_title}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedJob.department && <Chip label={selectedJob.department} size="small" />}
                                {selectedJob.location && <Chip label={selectedJob.location} size="small" />}
                                {selectedJob.employment_type && (
                                    <Chip
                                        label={employmentTypeLabels[selectedJob.employment_type]}
                                        size="small"
                                        color="primary"
                                    />
                                )}
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
                            {/* Description */}
                            {selectedJob.description && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Job Description</h3>
                                    <div
                                        className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                                    />
                                </div>
                            )}

                            {/* Responsibilities */}
                            {selectedJob.responsibilities && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Responsibilities</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        {parseJSON(selectedJob.responsibilities, []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Requirements */}
                            {selectedJob.requirements && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Requirements</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        {parseJSON(selectedJob.requirements, []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Qualifications */}
                            {selectedJob.qualifications && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Qualifications</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        {parseJSON(selectedJob.qualifications, []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Benefits */}
                            {selectedJob.benefits && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Benefits</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        {parseJSON(selectedJob.benefits, []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {selectedJob.salary_range && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Salary Range</h4>
                                        <p className="text-primary-600 dark:text-primary-400 font-semibold">{selectedJob.salary_range}</p>
                                    </div>
                                )}
                                {selectedJob.application_deadline && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Application Deadline</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{formatDate(selectedJob.application_deadline)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Apply Button */}
                            {selectedJob.application_url && (
                                <a
                                    href={selectedJob.application_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full text-center block"
                                >
                                    Apply Now
                                </a>
                            )}

                            {!selectedJob.application_url && selectedJob.contact_email && (
                                <a
                                    href={`mailto:${selectedJob.contact_email}?subject=Application for ${selectedJob.job_title}`}
                                    className="btn-primary w-full text-center block"
                                >
                                    Apply via Email
                                </a>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </section>
    );
};

export default CareersSection;
