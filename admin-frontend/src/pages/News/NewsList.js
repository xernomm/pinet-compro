import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: '',
        excerpt: '',
        content: '',
        featured_image: '',
        gallery: '',
        author: '',
        published_date: '',
        is_featured: false,
        is_published: false,
        meta_title: '',
        meta_description: '',
        tags: '',
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await newsAPI.getAll();
            setNews(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
            toast.error('Failed to load news');
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
        setCurrentNews(null);
        setFormData({
            title: '',
            slug: '',
            category: '',
            excerpt: '',
            content: '',
            featured_image: '',
            gallery: '',
            author: '',
            published_date: '',
            is_featured: false,
            is_published: false,
            meta_title: '',
            meta_description: '',
            tags: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (newsItem) => {
        setCurrentNews(newsItem);
        setFormData({
            title: newsItem.title || '',
            slug: newsItem.slug || '',
            category: newsItem.category || '',
            excerpt: newsItem.excerpt || '',
            content: newsItem.content || '',
            featured_image: newsItem.featured_image || '',
            gallery: Array.isArray(newsItem.gallery) ? newsItem.gallery.join('\n') : newsItem.gallery || '',
            author: newsItem.author || '',
            published_date: newsItem.published_date ? newsItem.published_date.split('T')[0] : '',
            is_featured: newsItem.is_featured ?? false,
            is_published: newsItem.is_published ?? false,
            meta_title: newsItem.meta_title || '',
            meta_description: newsItem.meta_description || '',
            tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : newsItem.tags || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                gallery: formData.gallery ? formData.gallery.split('\n').filter(g => g.trim()) : [],
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
            };

            if (currentNews) {
                await newsAPI.update(currentNews.id, submitData);
                toast.success('News updated successfully');
            } else {
                await newsAPI.create(submitData);
                toast.success('News created successfully');
            }
            setIsModalOpen(false);
            fetchNews();
        } catch (error) {
            console.error('Error saving news:', error);
            toast.error('Failed to save news');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                await newsAPI.delete(id);
                toast.success('News deleted successfully');
                fetchNews();
            } catch (error) {
                console.error('Error deleting news:', error);
                toast.error('Failed to delete news');
            }
        }
    };

    const handlePublish = async (id) => {
        try {
            await newsAPI.publish(id);
            toast.success('News published successfully');
            fetchNews();
        } catch (error) {
            console.error('Error publishing news:', error);
            toast.error('Failed to publish news');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>News</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New News
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Featured</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((newsItem) => (
                            <tr key={newsItem.id}>
                                <td>
                                    {newsItem.featured_image && (
                                        <img src={getImageUrl(newsItem.featured_image)} alt={newsItem.title} style={{ height: '40px', width: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td>{newsItem.title}</td>
                                <td>{newsItem.category}</td>
                                <td>{newsItem.author}</td>
                                <td>{newsItem.published_date ? new Date(newsItem.published_date).toLocaleDateString() : '-'}</td>
                                <td>
                                    {newsItem.is_featured && <span className="status-badge status-active">Featured</span>}
                                </td>
                                <td>
                                    <span className={`status-badge ${newsItem.is_published ? 'status-active' : 'status-inactive'}`}>
                                        {newsItem.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    {!newsItem.is_published && (
                                        <button
                                            onClick={() => handlePublish(newsItem.id)}
                                            className="btn btn-sm btn-success mr-2"
                                        >
                                            Publish
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(newsItem)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(newsItem.id)}
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
                title={currentNews ? 'Edit News' : 'Add New News'}
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
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            rows="2"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows="6"
                            className="form-control"
                            required
                        ></textarea>
                    </div>
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
                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Published Date</label>
                        <input
                            type="date"
                            name="published_date"
                            value={formData.published_date}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Tags (comma-separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="technology, innovation, business"
                        />
                    </div>
                    <div className="form-group">
                        <label>Meta Title</label>
                        <input
                            type="text"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Meta Description</label>
                        <textarea
                            name="meta_description"
                            value={formData.meta_description}
                            onChange={handleInputChange}
                            rows="2"
                            className="form-control"
                        ></textarea>
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

export default NewsList;
