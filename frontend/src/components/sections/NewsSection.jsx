import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl, parseJSON } from '../../utils/imageUtils';
import { format } from 'date-fns';
import { GridPlaceholder } from '../PlaceholderCard';

const NewsSection = ({ news }) => {
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const publishedNews = news.filter(item => item.is_published);
    const categories = ['all', ...new Set(publishedNews.map(n => n.category).filter(Boolean))];

    const filteredNews = selectedCategory === 'all'
        ? publishedNews
        : publishedNews.filter(n => n.category === selectedCategory);

    const featuredNews = filteredNews.filter(n => n.is_featured);
    const regularNews = filteredNews.filter(n => !n.is_featured);
    const displayNews = [...featuredNews, ...regularNews].slice(0, 6);

    const handleOpenModal = (newsItem) => {
        setSelectedNews(newsItem);
    };

    const handleCloseModal = () => {
        setSelectedNews(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    if (publishedNews.length === 0) {
        return (
            <section id="news" className="section-container bg-gray-50 dark:bg-dark-900">
                <h2 className="section-title">Latest News</h2>
                <p className="section-subtitle">
                    Stay updated with our latest announcements and insights
                </p>
                <GridPlaceholder count={3} type="news" />
            </section>
        );
    }

    return (
        <section id="news" className="section-container bg-gray-50 dark:bg-dark-900">
            <h2 className="section-title">Latest News</h2>
            <p className="section-subtitle">
                Stay updated with our latest announcements and insights
            </p>

            {/* Category Filter */}
            {categories.length > 1 && (
                <div className="flex justify-center mb-12 flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-red-glow transform scale-105'
                                : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayNews.map((item, index) => (
                    <div
                        key={item.id}
                        className="card group cursor-pointer h-full flex flex-col"
                        onClick={() => handleOpenModal(item)}
                        style={{
                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={getImageUrl(item.featured_image)}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {item.category && (
                                <span className="absolute top-4 right-4 bg-primary-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                                    {item.category}
                                </span>
                            )}
                            {item.is_featured && (
                                <span className="absolute top-4 left-4 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                                    <StarIcon fontSize="small" />
                                </span>
                            )}
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                                <span className="flex items-center">
                                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    {formatDate(item.published_date)}
                                </span>
                                {item.author && (
                                    <span className="flex items-center">
                                        <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        {item.author}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                                {item.excerpt}
                            </p>
                            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                                Read More →
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* News Detail Modal */}
            <Dialog
                open={Boolean(selectedNews)}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: 'bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100'
                }}
            >
                {selectedNews && (
                    <>
                        <DialogTitle className="flex justify-between items-center border-b border-gray-200 dark:border-dark-700">
                            <span className="text-xl font-bold pr-8">{selectedNews.title}</span>
                            <IconButton onClick={handleCloseModal} className="text-gray-500 hover:text-red-500">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent className="mt-4">
                            {/* Gallery Carousel in Modal */}
                            {(() => {
                                const gallery = parseJSON(selectedNews.gallery, []);
                                const images = gallery.length > 0 ? gallery : (selectedNews.featured_image ? [selectedNews.featured_image] : []);

                                if (images.length > 0) {
                                    return (
                                        <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                                            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="flex-shrink-0 w-full snap-center">
                                                        <img
                                                            src={getImageUrl(img)}
                                                            alt={`${selectedNews.title} - ${idx + 1}`}
                                                            className="w-full h-64 md:h-96 object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {images.length > 1 && (
                                                <div className="text-center text-sm text-gray-500 mt-2">
                                                    Swipe to see more images ({images.length})
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center bg-gray-100 dark:bg-dark-800 px-3 py-1 rounded-full">
                                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    {formatDate(selectedNews.published_date)}
                                </span>
                                {selectedNews.author && (
                                    <span className="flex items-center bg-gray-100 dark:bg-dark-800 px-3 py-1 rounded-full">
                                        <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        {selectedNews.author}
                                    </span>
                                )}
                                {selectedNews.category && (
                                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full font-medium">
                                        {selectedNews.category}
                                    </span>
                                )}
                            </div>

                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                            />

                            {selectedNews.tags && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNews.tags.split(',').map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag.trim()}
                                                size="small"
                                                className="bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </section>
    );
};

export default NewsSection;
