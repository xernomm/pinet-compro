import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Chip, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl, parseJSON } from '../../utils/imageUtils';
import { GridPlaceholder } from '../PlaceholderCard';

const ProductsSection = ({ products }) => {
    // ... existing state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const activeProducts = products.filter(product => product.is_active);

    // ... existing logic

    if (activeProducts.length === 0) {
        return (
            <section id="products" className="section-container">
                <h2 className="section-title">Our Products</h2>
                <p className="section-subtitle">
                    Innovative solutions designed to drive your success
                </p>
                <GridPlaceholder count={3} type="default" />
            </section>
        );
    }

    // Get unique categories
    const categories = ['all', ...new Set(activeProducts.map(p => p.category).filter(Boolean))];

    const filteredProducts = selectedCategory === 'all'
        ? activeProducts
        : activeProducts.filter(p => p.category === selectedCategory);

    const featuredProducts = filteredProducts.filter(p => p.is_featured);
    const regularProducts = filteredProducts.filter(p => !p.is_featured);
    const displayProducts = [...featuredProducts, ...regularProducts];

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <section id="products" className="section-container">
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">
                Innovative solutions designed to drive your success
            </p>

            {/* Category Filter */}
            {categories.length > 1 && (
                <div className="flex justify-center mb-12">
                    <Tabs
                        value={selectedCategory}
                        onChange={(e, newValue) => setSelectedCategory(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                color: 'var(--color-text-secondary)',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                '&.Mui-selected': {
                                    color: '#dc2626',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#dc2626',
                            },
                        }}
                    >
                        {categories.map((category) => (
                            <Tab
                                key={category}
                                label={category === 'all' ? 'All Products' : category}
                                value={category}
                            />
                        ))}
                    </Tabs>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className="card card-hover-red overflow-hidden cursor-pointer group"
                        onClick={() => handleOpenModal(product)}
                        style={{
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Image */}
                        <div className="relative h-56 bg-gray-200 dark:bg-dark-800 overflow-hidden">
                            {product.image_url ? (
                                <img
                                    src={getImageUrl(product.image_url)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                                    <span className="text-white text-4xl font-bold">
                                        {product.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            {product.is_featured && (
                                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
                                    <StarIcon fontSize="small" />
                                    <span>Featured</span>
                                </div>
                            )}
                            {product.category && (
                                <div className="absolute bottom-4 left-4">
                                    <Chip
                                        label={product.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            fontWeight: 600,
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {product.name}
                            </h3>
                            {product.short_description && (
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                    {product.short_description}
                                </p>
                            )}
                            {product.price_range && (
                                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                                    {product.price_range}
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

            {/* Product Detail Modal */}
            <Dialog
                open={!!selectedProduct}
                onClose={handleCloseModal}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                    },
                }}
            >
                {selectedProduct && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {selectedProduct.name}
                                    </div>
                                    {selectedProduct.category && (
                                        <Chip label={selectedProduct.category} size="small" sx={{ mt: 1 }} />
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
                            </div>
                        </DialogTitle>
                        <DialogContent dividers>
                            {/* Main Image or Gallery */}
                            {(() => {
                                const gallery = parseJSON(selectedProduct.gallery, []);
                                const hasGallery = gallery.length > 0;
                                const images = hasGallery ? gallery : (selectedProduct.image_url ? [selectedProduct.image_url] : []);

                                if (images.length > 0) {
                                    return (
                                        <div className="mb-6">
                                            <img
                                                src={getImageUrl(images[0])}
                                                alt={selectedProduct.name}
                                                className="w-full h-80 object-cover rounded-lg"
                                            />
                                            {images.length > 1 && (
                                                <div className="grid grid-cols-4 gap-2 mt-2">
                                                    {images.slice(1, 5).map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={getImageUrl(img)}
                                                            alt={`${selectedProduct.name} ${idx + 2}`}
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

                            {/* Video */}
                            {selectedProduct.video_url && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Product Video</h3>
                                    <div className="aspect-video">
                                        <iframe
                                            src={selectedProduct.video_url}
                                            title={`${selectedProduct.name} video`}
                                            className="w-full h-full rounded-lg"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {selectedProduct.description && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Description</h3>
                                    <div
                                        className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                                    />
                                </div>
                            )}

                            {/* Features */}
                            {selectedProduct.features && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Features</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        {parseJSON(selectedProduct.features, []).map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Benefits */}
                            {selectedProduct.benefits && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Benefits</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        {parseJSON(selectedProduct.benefits, []).map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Specifications */}
                            {selectedProduct.specifications && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Specifications</h3>
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {(() => {
                                            const specs = parseJSON(selectedProduct.specifications, {});
                                            return Object.entries(specs).map(([key, value], index) => (
                                                <div key={index} className="flex justify-between py-2 border-b border-gray-200 dark:border-dark-700">
                                                    <span className="font-medium">{key}:</span>
                                                    <span>{value}</span>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {selectedProduct.target_segment && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Target Segment</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedProduct.target_segment}</p>
                                    </div>
                                )}
                                {selectedProduct.price_range && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Price Range</h4>
                                        <p className="text-primary-600 dark:text-primary-400 font-semibold">{selectedProduct.price_range}</p>
                                    </div>
                                )}
                            </div>

                            {/* Brochure Download */}
                            {selectedProduct.brochure_url && (
                                <a
                                    href={getImageUrl(selectedProduct.brochure_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full text-center block"
                                >
                                    Download Brochure
                                </a>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </section>
    );
};

export default ProductsSection;
