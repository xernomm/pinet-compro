import React, { useState, useEffect } from 'react';
import { clientAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        logo_url: '',
        website_url: '',
        industry: '',
        project_description: '',
        testimonial: '',
        testimonial_author: '',
        testimonial_position: '',
        collaboration_since: '',
        order_number: 0,
        is_featured: false,
        is_featured: false,
        is_active: true,
    });
    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await clientAPI.getAll();
            setClients(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const openCreateModal = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            logo_url: '',
            website_url: '',
            industry: '',
            project_description: '',
            testimonial: '',
            testimonial_author: '',
            testimonial_position: '',
            collaboration_since: '',
            order_number: 0,
            is_featured: false,
            is_active: true,
        });
        setLogo(null);
        setPreviewLogo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client) => {
        setCurrentClient(client);
        setFormData({
            name: client.name || '',
            slug: client.slug || '',
            description: client.description || '',
            logo_url: client.logo_url || '',
            website_url: client.website_url || '',
            industry: client.industry || '',
            project_description: client.project_description || '',
            testimonial: client.testimonial || '',
            testimonial_author: client.testimonial_author || '',
            testimonial_position: client.testimonial_position || '',
            collaboration_since: client.collaboration_since || '',
            order_number: client.order_number || 0,
            is_featured: client.is_featured ?? false,
            is_active: client.is_active ?? true,
        });
        setLogo(null);
        if (client.logo_url) {
            setPreviewLogo(getImageUrl(client.logo_url));
        } else {
            setPreviewLogo(null);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (logo) {
                submitData.append('logo', logo);
            }

            if (currentClient) {
                await clientAPI.update(currentClient.id, submitData);
                toast.success('Client updated successfully');
            } else {
                await clientAPI.create(submitData);
                toast.success('Client created successfully');
            }
            setIsModalOpen(false);
            fetchClients();
        } catch (error) {
            console.error('Error saving client:', error);
            toast.error('Failed to save client');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await clientAPI.delete(id);
                toast.success('Client deleted successfully');
                fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                toast.error('Failed to delete client');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Clients</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Client
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Name</th>
                            <th>Industry</th>
                            <th>Since</th>
                            <th>Order</th>
                            <th>Featured</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    {client.logo_url && (
                                        <img src={getImageUrl(client.logo_url)} alt={client.name} style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }} />
                                    )}
                                </td>
                                <td>{client.name}</td>
                                <td>{client.industry}</td>
                                <td>{client.collaboration_since}</td>
                                <td>{client.order_number}</td>
                                <td>
                                    {client.is_featured && <span className="status-badge status-active">Featured</span>}
                                </td>
                                <td>
                                    <span className={`status-badge ${client.is_active ? 'status-active' : 'status-inactive'}`}>
                                        {client.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(client)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
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
                title={currentClient ? 'Edit Client' : 'Add New Client'}
            >
                <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="2"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Logo</label>
                        <div className="flex items-center gap-4">
                            {previewLogo && (
                                <img
                                    src={previewLogo}
                                    alt="Logo Preview"
                                    style={{ height: '80px', width: '80px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="form-control"
                                style={{ width: 'auto' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Website URL</label>
                        <input
                            type="url"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Industry</label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Project Description</label>
                        <textarea
                            name="project_description"
                            value={formData.project_description}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Testimonial</label>
                        <textarea
                            name="testimonial"
                            value={formData.testimonial}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Testimonial Author</label>
                        <input
                            type="text"
                            name="testimonial_author"
                            value={formData.testimonial_author}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Testimonial Author Position</label>
                        <input
                            type="text"
                            name="testimonial_position"
                            value={formData.testimonial_position}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Collaboration Since</label>
                        <input
                            type="text"
                            name="collaboration_since"
                            value={formData.collaboration_since}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., 2020 or January 2020"
                        />
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

export default ClientList;
