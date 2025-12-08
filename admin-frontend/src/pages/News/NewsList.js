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
    const [featuredImage, setFeaturedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [previewGallery, setPreviewGallery] = useState([]);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(files);
            const previews = files.map(file => URL.createObjectURL(file));
            setPreviewGallery(previews);
        }
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
        setFeaturedImage(null);
        setPreviewImage(null);
        setGalleryFiles([]);
        setPreviewGallery([]);
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
        setFeaturedImage(null);
        if (newsItem.featured_image) {
            setPreviewImage(getImageUrl(newsItem.featured_image));
        } else {
            setPreviewImage(null);
        }
        setGalleryFiles([]);
        setPreviewGallery([]);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'tags' || key === 'gallery') {
                    // Skip special handling here
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Handle tags
            if (formData.tags) {
                const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                tags.forEach(t => submitData.append('tags', t));
            }

            // Handle Images
            if (featuredImage) {
                submitData.append('featured_image', featuredImage);
            }
            if (galleryFiles.length > 0) {
                galleryFiles.forEach(file => {
                    submitData.append('gallery', file);
                });
            }

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
                        <label>Featured Image</label>
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
                        <label>Gallery Images</label>
                        <div className="flex flex-col gap-2">
                            {previewGallery.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {previewGallery.map((url, index) => (
                                        <img key={index} src={url} alt={`Gallery ${index}`} style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ))}
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                                className="form-control"
                            />
                            <small className="text-muted">Select multiple files to upload to gallery</small>
                        </div>
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
