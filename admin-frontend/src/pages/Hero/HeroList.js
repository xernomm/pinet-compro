import React, { useState, useEffect } from 'react';
import { heroAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const HeroList = () => {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHero, setCurrentHero] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        button_text: '',
        button_link: '',
        order_number: 0,
        is_active: true,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchHeroes();
    }, []);

    const fetchHeroes = async () => {
        try {
            const response = await heroAPI.getAll();
            setHeroes(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching heroes:', error);
            toast.error('Failed to load heroes');
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
        setCurrentHero(null);
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image_url: '',
            button_text: '',
            button_link: '',
            order_number: 0,
            is_active: true,
        });
        setImage(null);
        setPreviewImage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (hero) => {
        setCurrentHero(hero);
        setFormData({
            title: hero.title || '',
            subtitle: hero.subtitle || '',
            description: hero.description || '',
            image_url: hero.image_url || '',
            button_text: hero.button_text || '',
            button_link: hero.button_link || '',
            order_number: hero.order_number || 0,
            is_active: hero.is_active ?? true,
        });
        setImage(null);
        if (hero.image_url) {
            setPreviewImage(getImageUrl(hero.image_url));
        } else {
            setPreviewImage(null);
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
            if (image) {
                submitData.append('image', image);
            }

            if (currentHero) {
                await heroAPI.update(currentHero.id, submitData);
                toast.success('Hero updated successfully');
            } else {
                await heroAPI.create(submitData);
                toast.success('Hero created successfully');
            }
            setIsModalOpen(false);
            fetchHeroes();
        } catch (error) {
            console.error('Error saving hero:', error);
            toast.error('Failed to save hero');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hero?')) {
            try {
                await heroAPI.delete(id);
                toast.success('Hero deleted successfully');
                fetchHeroes();
            } catch (error) {
                console.error('Error deleting hero:', error);
                toast.error('Failed to delete hero');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Heroes</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Hero
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Subtitle</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {heroes.map((hero) => (
                            <tr key={hero.id}>
                                <td>
                                    {hero.image_url && (
                                        <img src={getImageUrl(hero.image_url)} alt={hero.title} style={{ height: '40px', width: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td>{hero.title}</td>
                                <td>{hero.subtitle}</td>
                                <td>{hero.order_number}</td>
                                <td>
                                    <span className={`status-badge ${hero.is_active ? 'status-active' : 'status-inactive'}`}>
                                        {hero.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(hero)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hero.id)}
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
                title={currentHero ? 'Edit Hero' : 'Add New Hero'}
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
                        <label>Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            className="form-control"
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
                        <label>Button Text</label>
                        <input
                            type="text"
                            name="button_text"
                            value={formData.button_text}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., Learn More"
                        />
                    </div>
                    <div className="form-group">
                        <label>Button Link</label>
                        <input
                            type="text"
                            name="button_link"
                            value={formData.button_link}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., /about"
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

export default HeroList;
