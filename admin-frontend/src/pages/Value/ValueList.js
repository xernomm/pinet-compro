import React, { useState, useEffect } from 'react';
import { valueAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const ValueList = () => {
    const [values, setValues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '',
        image_url: '',
        order_number: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchValues();
    }, []);

    const fetchValues = async () => {
        try {
            const response = await valueAPI.getAll();
            setValues(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching values:', error);
            toast.error('Failed to load values');
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
        setCurrentValue(null);
        setFormData({
            title: '',
            description: '',
            icon: '',
            image_url: '',
            order_number: 0,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (value) => {
        setCurrentValue(value);
        setFormData({
            title: value.title || '',
            description: value.description || '',
            icon: value.icon || '',
            image_url: value.image_url || '',
            order_number: value.order_number || 0,
            is_active: value.is_active ?? true,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentValue) {
                await valueAPI.update(currentValue.id, formData);
                toast.success('Value updated successfully');
            } else {
                await valueAPI.create(formData);
                toast.success('Value created successfully');
            }
            setIsModalOpen(false);
            fetchValues();
        } catch (error) {
            console.error('Error saving value:', error);
            toast.error('Failed to save value');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this value?')) {
            try {
                await valueAPI.delete(id);
                toast.success('Value deleted successfully');
                fetchValues();
            } catch (error) {
                console.error('Error deleting value:', error);
                toast.error('Failed to delete value');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Company Values</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Value
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((value) => (
                            <tr key={value.id}>
                                <td>
                                    {value.image_url ? (
                                        <img src={getImageUrl(value.image_url)} alt={value.title} style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : value.icon ? (
                                        <span style={{ fontSize: '24px' }}>{value.icon}</span>
                                    ) : null}
                                </td>
                                <td>{value.title}</td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value.description}</td>
                                <td>{value.order_number}</td>
                                <td>
                                    <span className={`status-badge ${value.is_active ? 'status-active' : 'status-inactive'}`}>
                                        {value.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(value)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(value.id)}
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
                title={currentValue ? 'Edit Value' : 'Add New Value'}
            >
                <form onSubmit={handleSubmit}>
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
                        <label>Icon (class or emoji)</label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., 💡 or fa-lightbulb"
                        />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            className="form-control"
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

export default ValueList;
