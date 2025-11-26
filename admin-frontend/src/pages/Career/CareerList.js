import React, { useState, useEffect } from 'react';
import { careerAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';

const CareerList = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCareer, setCurrentCareer] = useState(null);
    const [formData, setFormData] = useState({
        job_title: '',
        slug: '',
        department: '',
        location: '',
        employment_type: '',
        experience_level: '',
        salary_range: '',
        description: '',
        responsibilities: '',
        requirements: '',
        qualifications: '',
        benefits: '',
        application_deadline: '',
        contact_email: '',
        application_url: '',
        is_featured: false,
        is_active: true,
        status: 'open',
    });

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        try {
            const response = await careerAPI.getAll();
            setCareers(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching careers:', error);
            toast.error('Failed to load careers');
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
        setCurrentCareer(null);
        setFormData({
            job_title: '',
            slug: '',
            department: '',
            location: '',
            employment_type: '',
            experience_level: '',
            salary_range: '',
            description: '',
            responsibilities: '',
            requirements: '',
            qualifications: '',
            benefits: '',
            application_deadline: '',
            contact_email: '',
            application_url: '',
            is_featured: false,
            is_active: true,
            status: 'open',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (career) => {
        setCurrentCareer(career);
        setFormData({
            job_title: career.job_title || '',
            slug: career.slug || '',
            department: career.department || '',
            location: career.location || '',
            employment_type: career.employment_type || '',
            experience_level: career.experience_level || '',
            salary_range: career.salary_range || '',
            description: career.description || '',
            responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.join('\n') : career.responsibilities || '',
            requirements: Array.isArray(career.requirements) ? career.requirements.join('\n') : career.requirements || '',
            qualifications: Array.isArray(career.qualifications) ? career.qualifications.join('\n') : career.qualifications || '',
            benefits: Array.isArray(career.benefits) ? career.benefits.join('\n') : career.benefits || '',
            application_deadline: career.application_deadline ? career.application_deadline.split('T')[0] : '',
            contact_email: career.contact_email || '',
            application_url: career.application_url || '',
            is_featured: career.is_featured ?? false,
            is_active: career.is_active ?? true,
            status: career.status || 'open',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').filter(r => r.trim()) : [],
                requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
                qualifications: formData.qualifications ? formData.qualifications.split('\n').filter(q => q.trim()) : [],
                benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : [],
            };

            if (currentCareer) {
                await careerAPI.update(currentCareer.id, submitData);
                toast.success('Career updated successfully');
            } else {
                await careerAPI.create(submitData);
                toast.success('Career created successfully');
            }
            setIsModalOpen(false);
            fetchCareers();
        } catch (error) {
            console.error('Error saving career:', error);
            toast.error('Failed to save career');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this career?')) {
            try {
                await careerAPI.delete(id);
                toast.success('Career deleted successfully');
                fetchCareers();
            } catch (error) {
                console.error('Error deleting career:', error);
                toast.error('Failed to delete career');
            }
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await careerAPI.updateStatus(id, status);
            toast.success('Career status updated successfully');
            fetchCareers();
        } catch (error) {
            console.error('Error updating career status:', error);
            toast.error('Failed to update career status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Careers</h2>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    Add New Career
                </button>
            </div>

            <div className="content-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Department</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {careers.map((career) => (
                            <tr key={career.id}>
                                <td>{career.job_title}</td>
                                <td>{career.department}</td>
                                <td>{career.location}</td>
                                <td>{career.employment_type}</td>
                                <td>
                                    <span className={`status-badge ${career.status === 'open' ? 'status-active' : 'status-inactive'}`}>
                                        {career.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => openEditModal(career)}
                                        className="btn btn-sm btn-secondary mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(career.id)}
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
                title={currentCareer ? 'Edit Career' : 'Add New Career'}
            >
                <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="form-group">
                        <label>Job Title *</label>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
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
                        <label>Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Employment Type</label>
                        <select
                            name="employment_type"
                            value={formData.employment_type}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Select Type</option>
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Experience Level</label>
                        <select
                            name="experience_level"
                            value={formData.experience_level}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Select Level</option>
                            <option value="entry">Entry Level</option>
                            <option value="mid">Mid Level</option>
                            <option value="senior">Senior Level</option>
                            <option value="lead">Lead</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Salary Range</label>
                        <input
                            type="text"
                            name="salary_range"
                            value={formData.salary_range}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g., $50,000 - $70,000"
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
                        <label>Responsibilities (one per line)</label>
                        <textarea
                            name="responsibilities"
                            value={formData.responsibilities}
                            onChange={handleInputChange}
                            rows="4"
                            className="form-control"
                            placeholder="Responsibility 1&#10;Responsibility 2&#10;Responsibility 3"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Requirements (one per line)</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleInputChange}
                            rows="4"
                            className="form-control"
                            placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Qualifications (one per line)</label>
                        <textarea
                            name="qualifications"
                            value={formData.qualifications}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                            placeholder="Qualification 1&#10;Qualification 2&#10;Qualification 3"
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
                        <label>Application Deadline</label>
                        <input
                            type="date"
                            name="application_deadline"
                            value={formData.application_deadline}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Email</label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Application URL</label>
                        <input
                            type="url"
                            name="application_url"
                            value={formData.application_url}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="on-hold">On Hold</option>
                        </select>
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

export default CareerList;
