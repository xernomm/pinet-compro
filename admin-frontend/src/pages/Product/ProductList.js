import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category: '',
        short_description: '',
        description: '',
        features: '',
        benefits: '',
        target_segment: '',
        image_url: '',
        gallery: '',
        brochure_url: '',
        video_url: '',
        price_range: '',
        order_number: 0,
        is_featured: false,
        is_active: true,
        meta_title: '',
        meta_description: '',
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [previewGallery, setPreviewGallery] = useState([]);
    const [specificationEntries, setSpecificationEntries] = useState([{ key: '', value: '' }]);

    // Specification entry handlers
    const addSpecificationEntry = () => {
        setSpecificationEntries([...specificationEntries, { key: '', value: '' }]);
    };

    const removeSpecificationEntry = (index) => {
        if (specificationEntries.length > 1) {
            setSpecificationEntries(specificationEntries.filter((_, i) => i !== index));
        }
    };

    const updateSpecificationEntry = (index, field, value) => {
        const updated = [...specificationEntries];
        updated[index][field] = value;
        setSpecificationEntries(updated);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productAPI.getAll();
            setProducts(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
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

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(files);
            const previews = files.map(file => URL.createObjectURL(file));
            setPreviewGallery(previews);
        }
    };

    const openCreateModal = () => {
        setCurrentProduct(null);
        setFormData({
            name: '',
            slug: '',
            category: '',
            short_description: '',
            description: '',
            features: '',
            benefits: '',
            target_segment: '',
            image_url: '',
            gallery: '',
            brochure_url: '',
            video_url: '',
            price_range: '',
            order_number: 0,
            is_featured: false,
            is_active: true,
            meta_title: '',
            meta_description: '',
        });
        setImage(null);
        setPreviewImage(null);
        setGalleryFiles([]);
        setPreviewGallery([]);
        setSpecificationEntries([{ key: '', value: '' }]);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name || '',
            slug: product.slug || '',
            category: product.category || '',
            short_description: product.short_description || '',
            description: product.description || '',
            features: Array.isArray(product.features) ? product.features.join('\n') : product.features || '',
            benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : product.benefits || '',
            target_segment: product.target_segment || '',
            image_url: product.image_url || '',
            gallery: Array.isArray(product.gallery) ? product.gallery.join('\n') : product.gallery || '',
            brochure_url: product.brochure_url || '',
            video_url: product.video_url || '',
            price_range: product.price_range || '',
            order_number: product.order_number || 0,
            is_featured: product.is_featured ?? false,
            is_active: product.is_active ?? true,
            meta_title: product.meta_title || '',
            meta_description: product.meta_description || '',
        });

        // Parse specifications to key-value entries
        let specs = product.specifications;
        if (typeof specs === 'string') {
            try {
                specs = JSON.parse(specs);
            } catch (e) {
                specs = {};
            }
        }
        if (specs && typeof specs === 'object' && !Array.isArray(specs)) {
            const entries = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
            setSpecificationEntries(entries.length > 0 ? entries : [{ key: '', value: '' }]);
        } else {
            setSpecificationEntries([{ key: '', value: '' }]);
        }

        setImage(null);
        if (product.image_url) {
            setPreviewImage(getImageUrl(product.image_url));
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

            // Reconstruct data first? No, append directly.
            Object.keys(formData).forEach(key => {
                if (key === 'features' || key === 'benefits' || key === 'gallery') {
                    // Skip direct append for arrays handled specially below, 
                    // EXCEPT for basic fields. 
                    // Original logic: split by newline.
                } else if (key !== 'specifications') {
                    submitData.append(key, formData[key]);
                }
            });

            // Handle features/benefits (logic from original)
            if (formData.features) {
                const features = formData.features.split('\n').filter(f => f.trim());
                features.forEach(f => submitData.append('features', f)); // or features[]
            }
            if (formData.benefits) {
                const benefits = formData.benefits.split('\n').filter(b => b.trim());
                benefits.forEach(b => submitData.append('benefits', b));
            }

            // Handle specifications from key-value entries
            const specsObject = {};
            specificationEntries.forEach(entry => {
                if (entry.key.trim()) {
                    specsObject[entry.key.trim()] = entry.value.trim();
                }
            });
            if (Object.keys(specsObject).length > 0) {
                submitData.append('specifications', JSON.stringify(specsObject));
            }

            // Handle Images
            if (image) {
                submitData.append('image', image);
            }
            if (galleryFiles.length > 0) {
                galleryFiles.forEach(file => {
                    submitData.append('gallery', file);
                });
            }

            if (currentProduct) {
                await productAPI.update(currentProduct.id, submitData);
                toast.success('Product updated successfully');
            } else {
                await productAPI.create(submitData);
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productAPI.delete(id);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Products</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Product
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Order</th>
                            <th>Featured</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {product.image_url && (
                                        <img src={getImageUrl(product.image_url)} alt={product.name} style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.order_number}</td>
                                <td>
                                    {product.is_featured && <span className="status-badge status-active">Featured</span>}
                                </td>
                                <td>
                                    <span className={`status-badge ${product.is_active ? 'status-active' : 'status-inactive'}`}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
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
                title={currentProduct ? 'Edit Product' : 'Add New Product'}
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
                        <label>Features (one per line)</label>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Benefits (one per line)</label>
                        <textarea
                            name="benefits"
                            value={formData.benefits}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                            placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Specifications</label>
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                            {specificationEntries.map((entry, index) => (
                                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={entry.key}
                                        onChange={(e) => updateSpecificationEntry(index, 'key', e.target.value)}
                                        placeholder="Key (e.g., Weight)"
                                        className="form-control"
                                        style={{ flex: 1 }}
                                    />
                                    <input
                                        type="text"
                                        value={entry.value}
                                        onChange={(e) => updateSpecificationEntry(index, 'value', e.target.value)}
                                        placeholder="Value (e.g., 1kg)"
                                        className="form-control"
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpecificationEntry(index)}
                                        className="btn btn-sm btn-danger"
                                        disabled={specificationEntries.length === 1}
                                        style={{ padding: '4px 8px' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSpecificationEntry}
                                className="btn btn-sm btn-secondary"
                                style={{ marginTop: '4px' }}
                            >
                                + Add Specification
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Target Segment</label>
                        <input
                            type="text"
                            name="target_segment"
                            value={formData.target_segment}
                            onChange={handleInputChange}
                            className="form-control"
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
                        <label>Brochure URL</label>
                        <input
                            type="text"
                            name="brochure_url"
                            value={formData.brochure_url}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Video URL</label>
                        <input
                            type="text"
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price Range</label>
                        <input
                            type="text"
                            name="price_range"
                            value={formData.price_range}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., $100 - $500"
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

export default ProductList;
