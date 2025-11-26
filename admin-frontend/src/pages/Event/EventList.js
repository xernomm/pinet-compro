import React, { useState, useEffect } from 'react';
import { eventAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        event_type: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
        venue: '',
        address: '',
        is_online: false,
        meeting_link: '',
        featured_image: '',
        gallery: '',
        organizer: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        registration_url: '',
        max_participants: '',
        is_featured: false,
        is_published: false,
        status: 'upcoming',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAll();
            setEvents(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openCreateModal = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            slug: '',
            description: '',
            event_type: '',
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            location: '',
            venue: '',
            address: '',
            is_online: false,
            meeting_link: '',
            featured_image: '',
            gallery: '',
            organizer: '',
            contact_person: '',
            contact_email: '',
            contact_phone: '',
            registration_url: '',
            max_participants: '',
            is_featured: false,
            is_published: false,
            status: 'upcoming',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (event) => {
        setCurrentEvent(event);
        setFormData({
            title: event.title || '',
            slug: event.slug || '',
            description: event.description || '',
            event_type: event.event_type || '',
            start_date: event.start_date ? event.start_date.split('T')[0] : '',
            end_date: event.end_date ? event.end_date.split('T')[0] : '',
            start_time: event.start_time || '',
            end_time: event.end_time || '',
            location: event.location || '',
            venue: event.venue || '',
            address: event.address || '',
            is_online: event.is_online ?? false,
            meeting_link: event.meeting_link || '',
            featured_image: event.featured_image || '',
            gallery: Array.isArray(event.gallery) ? event.gallery.join('\n') : event.gallery || '',
            organizer: event.organizer || '',
            contact_person: event.contact_person || '',
            contact_email: event.contact_email || '',
            contact_phone: event.contact_phone || '',
            registration_url: event.registration_url || '',
            max_participants: event.max_participants || '',
            is_featured: event.is_featured ?? false,
            is_published: event.is_published ?? false,
            status: event.status || 'upcoming',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                gallery: formData.gallery ? formData.gallery.split('\n').filter(g => g.trim()) : [],
                max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
            };

            if (currentEvent) {
                await eventAPI.update(currentEvent.id, submitData);
                toast.success('Event updated successfully');
            } else {
                await eventAPI.create(submitData);
                toast.success('Event created successfully');
            }
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error('Failed to save event');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventAPI.delete(id);
                toast.success('Event deleted successfully');
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                toast.error('Failed to delete event');
            }
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await eventAPI.updateStatus(id, status);
            toast.success('Event status updated successfully');
            fetchEvents();
        } catch (error) {
            console.error('Error updating event status:', error);
            toast.error('Failed to update event status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Events</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Event
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>
                                    {event.featured_image && (
                                        <img src={getImageUrl(event.featured_image)} alt={event.title} style={{ height: '40px', width: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td>{event.title}</td>
                                <td>{event.event_type}</td>
                                <td>{event.start_date ? new Date(event.start_date).toLocaleDateString() : '-'}</td>
                                <td>{event.is_online ? 'Online' : event.location}</td>
                                <td>
                                    <span className={`status-badge ${event.status === 'upcoming' ? 'status-active' : event.status === 'ongoing' ? 'status-warning' : 'status-inactive'}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(event)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentEvent ? 'Edit Event' : 'Add New Event'}
            >
                <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Event Type</label>
                        <input
                            type="text"
                            name="event_type"
                            value={formData.event_type}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., Conference, Workshop, Webinar"
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Date *</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group flex items-center">
                        <input
                            type="checkbox"
                            name="is_online"
                            checked={formData.is_online}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <label style={{ margin: 0 }}>Online Event</label>
                    </div>
                    {formData.is_online ? (
                        <div className="form-group">
                            <label>Meeting Link</label>
                            <input
                                type="url"
                                name="meeting_link"
                                value={formData.meeting_link}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="form-control"
                                ></textarea>
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>Featured Image URL</label>
                        <input
                            type="text"
                            name="featured_image"
                            value={formData.featured_image}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Gallery URLs (one per line)</label>
                        <textarea
                            name="gallery"
                            value={formData.gallery}
                            onChange={handleInputChange}
                            rows="2"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Organizer</label>
                        <input
                            type="text"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Person</label>
                        <input
                            type="text"
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Email</label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Phone</label>
                        <input
                            type="tel"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Registration URL</label>
                        <input
                            type="url"
                            name="registration_url"
                            value={formData.registration_url}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Max Participants</label>
                        <input
                            type="number"
                            name="max_participants"
                            value={formData.max_participants}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group flex items-center">
                        <input
                            type="checkbox"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <label style={{ margin: 0 }}>Featured</label>
                    </div>
                    <div className="form-group flex items-center">
                        <input
                            type="checkbox"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <label style={{ margin: 0 }}>Published</label>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EventList;
