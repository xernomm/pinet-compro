import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        short_description: '',
        description: '',
        icon: '',
        image_url: '',
        icon_class: '',
        order_number: 0,
        is_active: true,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await serviceAPI.getAll();
            setServices(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const openCreateModal = () => {
        setCurrentService(null);
        setFormData({
            name: '',
            slug: '',
            short_description: '',
            description: '',
            icon: '',
            image_url: '',
            order_number: 0,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setCurrentService(service);
        setFormData({
            name: service.name || '',
            slug: service.slug || '',
            short_description: service.short_description || '',
            description: service.description || '',
            icon: service.icon || '',
            image_url: service.image_url || '',
            order_number: service.order_number || 0,
            is_active: service.is_active ?? true,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (image) {
                submitData.append('image', image);
            }

            if (currentService) {
                await serviceAPI.update(currentService.id, submitData);
                toast.success('Service updated successfully');
            } else {
                await serviceAPI.create(submitData);
                toast.success('Service created successfully');
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Failed to save service');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await serviceAPI.delete(id);
                toast.success('Service deleted successfully');
                fetchServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                toast.error('Failed to delete service');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Services</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Service
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td>
                                    {service.image_url ? (
                                        <img src={getImageUrl(service.image_url)} alt={service.name} style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : service.icon ? (
                                        <span style={{ fontSize: '24px' }}>{service.icon}</span>
                                    ) : null}
                                </td>
                                <td>{service.name}</td>
                                <td>{service.slug}</td>
                                <td>{service.order_number}</td>
                                <td>
                                    <span className={`status-badge ${service.is_active ? 'status-active' : 'status-inactive'}`}>
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(service)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
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
                title={currentService ? 'Edit Service' : 'Add New Service'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                        <label>Short Description</label>
                        <textarea
                            name="short_description"
                            value={formData.short_description}
                            onChange={handleInputChange}
                            rows="2"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Icon (class or emoji)</label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., 🚀 or fa-rocket"
                        />
                    </div>
                    <div className="form-group">
                        <label>Image</label>
                        <div className="flex items-center gap-4">
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ height: '80px', width: '80px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="form-control"
                                style={{ width: 'auto' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Order Number</label>
                        <input
                            type="number"
                            name="order_number"
                            value={formData.order_number}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <label style={{ margin: 0 }}>Active</label>
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

export default ServiceList;
