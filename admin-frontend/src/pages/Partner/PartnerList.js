import React, { useState, useEffect } from 'react';
import { partnerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const PartnerList = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPartner, setCurrentPartner] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        logo_url: '',
        website_url: '',
        partnership_type: '',
        partnership_since: '',
        order_number: 0,
        is_active: true,
    });
    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await partnerAPI.getAll();
            setPartners(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching partners:', error);
            toast.error('Failed to load partners');
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
        setCurrentPartner(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            logo_url: '',
            website_url: '',
            partnership_type: '',
            partnership_since: '',
            order_number: 0,
            is_active: true,
        });
        setLogo(null);
        setPreviewLogo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (partner) => {
        setCurrentPartner(partner);
        setFormData({
            name: partner.name || '',
            slug: partner.slug || '',
            description: partner.description || '',
            logo_url: partner.logo_url || '',
            website_url: partner.website_url || '',
            partnership_type: partner.partnership_type || '',
            partnership_since: partner.partnership_since || '',
            order_number: partner.order_number || 0,
            is_active: partner.is_active ?? true,
        });
        setLogo(null);
        if (partner.logo_url) {
            setPreviewLogo(getImageUrl(partner.logo_url));
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

            if (currentPartner) {
                await partnerAPI.update(currentPartner.id, submitData);
                toast.success('Partner updated successfully');
            } else {
                await partnerAPI.create(submitData);
                toast.success('Partner created successfully');
            }
            setIsModalOpen(false);
            fetchPartners();
        } catch (error) {
            console.error('Error saving partner:', error);
            toast.error('Failed to save partner');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this partner?')) {
            try {
                await partnerAPI.delete(id);
                toast.success('Partner deleted successfully');
                fetchPartners();
            } catch (error) {
                console.error('Error deleting partner:', error);
                toast.error('Failed to delete partner');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Partners</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Partner
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Since</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map((partner) => (
                            <tr key={partner.id}>
                                <td>
                                    {partner.logo_url && (
                                        <img src={getImageUrl(partner.logo_url)} alt={partner.name} style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }} />
                                    )}
                                </td>
                                <td>{partner.name}</td>
                                <td>{partner.partnership_type}</td>
                                <td>{partner.partnership_since}</td>
                                <td>{partner.order_number}</td>
                                <td>
                                    <span className={`status-badge ${partner.is_active ? 'status-active' : 'status-inactive'}`}>
                                        {partner.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(partner)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(partner.id)}
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
                title={currentPartner ? 'Edit Partner' : 'Add New Partner'}
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
                        <label>Partnership Type</label>
                        <input
                            type="text"
                            name="partnership_type"
                            value={formData.partnership_type}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., Strategic, Technology, Distributor"
                        />
                    </div>
                    <div className="form-group">
                        <label>Partnership Since</label>
                        <input
                            type="text"
                            name="partnership_since"
                            value={formData.partnership_since}
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

export default PartnerList;
