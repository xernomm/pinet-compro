import React from 'react';
import { getImageUrl } from '../../utils/imageUtils';

const ValuesSection = ({ values }) => {
    const activeValues = values.filter(value => value.is_active);

    if (activeValues.length === 0) return null;

    return (
        <section id="values" className="section-container bg-gray-50 dark:bg-dark-900">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
                The principles that guide everything we do
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeValues.map((value, index) => (
                    <div
                        key={value.id}
                        className="card card-hover-red p-6 text-center group"
                        style={{
                            animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
                        }}
                    >
                        {/* Icon or Image */}
                        <div className="mb-4 flex justify-center">
                            {value.image_url ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-600 dark:border-primary-400">
                                    <img
                                        src={getImageUrl(value.image_url)}
                                        alt={value.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ) : value.icon ? (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                    <i className={`${value.icon} text-4xl text-white`} />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 flex items-center justify-center text-white text-3xl font-bold transform group-hover:rotate-12 transition-transform duration-300">
                                    {value.title.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {value.title}
                        </h3>
                        {value.description && (
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {value.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ValuesSection;
