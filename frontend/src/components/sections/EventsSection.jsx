import React, { useState } from 'react';
import { Chip, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import VideocamIcon from '@mui/icons-material/Videocam';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { getImageUrl, parseJSON } from '../../utils/imageUtils';
import { format } from 'date-fns';
import { GridPlaceholder } from '../PlaceholderCard';

const EventsSection = ({ events }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const publishedEvents = events.filter(event => event.is_published);

    if (publishedEvents.length === 0) {
        return (
            <section id="events" className="section-container ">
                <h2 className="section-title p-4">Upcoming Events</h2>
                <p className="section-subtitle">
                    Join us at our upcoming events and conferences
                </p>
                <GridPlaceholder count={3} type="event" />
            </section>
        );
    }
    const upcomingEvents = publishedEvents.filter(event => {
        if (!event.start_date) return false;
        return new Date(event.start_date) >= new Date();
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString;
    };

    const eventTypeColors = {
        seminar: 'primary',
        workshop: 'secondary',
        conference: 'success',
        webinar: 'info',
        training: 'warning',
        exhibition: 'error',
        other: 'default',
    };

    const handleOpenModal = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    if (upcomingEvents.length === 0) {
        return (
            <section id="events" className="section-container">
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">
                    No upcoming events at the moment. Check back soon!
                </p>
            </section>
        );
    }

    return (
        <section id="events" className="section-container">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
                Join us at our upcoming events and stay connected
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                    <div
                        key={event.id}
                        className="card overflow-hidden group cursor-pointer"
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                        onClick={() => handleOpenModal(event)}
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200 dark:bg-dark-800 overflow-hidden">
                            {event.featured_image ? (
                                <img
                                    src={getImageUrl(event.featured_image)}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                                    <span className="text-white text-4xl font-bold">
                                        {event.title.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {event.is_featured && (
                                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
                                    <StarIcon fontSize="small" />
                                    <span>Featured</span>
                                </div>
                            )}

                            {event.is_online && (
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
                                    <VideocamIcon fontSize="small" />
                                    <span>Online</span>
                                </div>
                            )}

                            {event.event_type && (
                                <div className="absolute bottom-4 left-4">
                                    <Chip
                                        label={event.event_type}
                                        size="small"
                                        color={eventTypeColors[event.event_type] || 'default'}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {event.title}
                            </h3>

                            <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                {event.start_date && (
                                    <div className="flex items-center space-x-2">
                                        <CalendarTodayIcon fontSize="small" />
                                        <span>
                                            {formatDate(event.start_date)}
                                            {event.end_date && event.end_date !== event.start_date && (
                                                <> - {formatDate(event.end_date)}</>
                                            )}
                                        </span>
                                    </div>
                                )}

                                {(event.start_time || event.end_time) && (
                                    <div className="flex items-center space-x-2">
                                        <AccessTimeIcon fontSize="small" />
                                        <span>
                                            {formatTime(event.start_time)}
                                            {event.end_time && <> - {formatTime(event.end_time)}</>}
                                        </span>
                                    </div>
                                )}

                                {!event.is_online && (event.location || event.venue) && (
                                    <div className="flex items-center space-x-2">
                                        <LocationOnIcon fontSize="small" />
                                        <span>{event.venue || event.location}</span>
                                    </div>
                                )}

                                {event.max_participants && (
                                    <div className="flex items-center space-x-2">
                                        <PeopleIcon fontSize="small" />
                                        <span>Max {event.max_participants} participants</span>
                                    </div>
                                )}
                            </div>

                            {event.description && (
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                    {event.description.replace(/<[^>]*>/g, '')}
                                </p>
                            )}

                            <div className="text-primary-600 dark:text-primary-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                                View Details
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Event Detail Modal */}
            <Dialog
                open={!!selectedEvent}
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
                {selectedEvent && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {selectedEvent.title}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedEvent.event_type && (
                                    <Chip
                                        label={selectedEvent.event_type}
                                        size="small"
                                        color={eventTypeColors[selectedEvent.event_type] || 'default'}
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                )}
                                {selectedEvent.is_online && (
                                    <Chip label="Online Event" size="small" color="info" />
                                )}
                                {selectedEvent.is_featured && (
                                    <Chip label="Featured" size="small" color="error" />
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
                            {/* Main Image or Gallery */}
                            {(() => {
                                const gallery = parseJSON(selectedEvent.gallery, []);
                                const hasGallery = gallery.length > 0;
                                const images = hasGallery ? gallery : (selectedEvent.featured_image ? [selectedEvent.featured_image] : []);

                                if (images.length > 0) {
                                    return (
                                        <div className="mb-6">
                                            <img
                                                src={getImageUrl(images[0])}
                                                alt={selectedEvent.title}
                                                className="w-full h-80 object-cover rounded-lg"
                                            />
                                            {images.length > 1 && (
                                                <div className="grid grid-cols-4 gap-2 mt-2">
                                                    {images.slice(1, 5).map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={getImageUrl(img)}
                                                            alt={`${selectedEvent.title} ${idx + 2}`}
                                                            className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {selectedEvent.start_date && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                            <CalendarTodayIcon fontSize="small" className="mr-2" />
                                            Date
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {formatDate(selectedEvent.start_date)}
                                            {selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date && (
                                                <> - {formatDate(selectedEvent.end_date)}</>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {(selectedEvent.start_time || selectedEvent.end_time) && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                            <AccessTimeIcon fontSize="small" className="mr-2" />
                                            Time
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {formatTime(selectedEvent.start_time)}
                                            {selectedEvent.end_time && <> - {formatTime(selectedEvent.end_time)}</>}
                                        </p>
                                    </div>
                                )}

                                {!selectedEvent.is_online && (selectedEvent.venue || selectedEvent.location) && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                            <LocationOnIcon fontSize="small" className="mr-2" />
                                            Venue
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedEvent.venue || selectedEvent.location}
                                            {selectedEvent.address && <><br />{selectedEvent.address}</>}
                                        </p>
                                    </div>
                                )}

                                {selectedEvent.max_participants && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                            <PeopleIcon fontSize="small" className="mr-2" />
                                            Capacity
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Maximum {selectedEvent.max_participants} participants
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {selectedEvent.description && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">About This Event</h3>
                                    <div
                                        className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                                    />
                                </div>
                            )}

                            {/* Organizer Info */}
                            {(selectedEvent.organizer || selectedEvent.contact_person || selectedEvent.contact_email || selectedEvent.contact_phone) && (
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Contact Information</h3>
                                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                        {selectedEvent.organizer && (
                                            <p><span className="font-semibold">Organizer:</span> {selectedEvent.organizer}</p>
                                        )}
                                        {selectedEvent.contact_person && (
                                            <div className="flex items-center space-x-2">
                                                <PersonIcon fontSize="small" />
                                                <span>{selectedEvent.contact_person}</span>
                                            </div>
                                        )}
                                        {selectedEvent.contact_email && (
                                            <div className="flex items-center space-x-2">
                                                <EmailIcon fontSize="small" />
                                                <a href={`mailto:${selectedEvent.contact_email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                                                    {selectedEvent.contact_email}
                                                </a>
                                            </div>
                                        )}
                                        {selectedEvent.contact_phone && (
                                            <div className="flex items-center space-x-2">
                                                <PhoneIcon fontSize="small" />
                                                <a href={`tel:${selectedEvent.contact_phone}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                                                    {selectedEvent.contact_phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Registration Button */}
                            {(selectedEvent.registration_url || selectedEvent.meeting_link) && (
                                <a
                                    href={selectedEvent.registration_url || selectedEvent.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full text-center block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {selectedEvent.registration_url ? 'Register Now' : 'Join Event'}
                                </a>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </section>
    );
};

export default EventsSection;
