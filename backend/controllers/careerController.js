import { Career } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllCareers = async (req, res) => {
  try {
    const { is_active, is_featured, department, employment_type, experience_level, status, search, page = 1, limit = 10 } = req.query;
    const where = {};

    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (department) where.department = department;
    if (employment_type) where.employment_type = employment_type;
    if (experience_level) where.experience_level = experience_level;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { job_title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Career.findAndCountAll({
      where,
      order: [['posted_date', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching careers',
      error: error.message
    });
  }
};

export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    // Increment views
    await career.increment('views');

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching career',
      error: error.message
    });
  }
};

export const getCareerBySlug = async (req, res) => {
  try {
    const career = await Career.findOne({
      where: { slug: req.params.slug }
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    // Increment views
    await career.increment('views');

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching career',
      error: error.message
    });
  }
};

export const getOpenPositions = async (req, res) => {
  try {
    const careers = await Career.findAll({
      where: {
        status: 'open',
        is_active: true,
        [Op.or]: [
          { application_deadline: { [Op.gte]: new Date() } },
          { application_deadline: null }
        ]
      },
      order: [['posted_date', 'DESC']],
      limit: 20
    });

    res.json({
      success: true,
      count: careers.length,
      data: careers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching open positions',
      error: error.message
    });
  }
};

// Helper function to sanitize career data
const sanitizeCareerData = (data) => {
  const sanitized = { ...data };

  // Handle ENUM fields - use default if empty
  if (!sanitized.employment_type || sanitized.employment_type === '') {
    sanitized.employment_type = 'full_time';
  }
  if (!sanitized.status || sanitized.status === '') {
    sanitized.status = 'open';
  }
  // experience_level can be null, so only set to null if empty
  if (sanitized.experience_level === '') {
    sanitized.experience_level = null;
  }

  // Handle INTEGER fields
  if (sanitized.views === '' || sanitized.views === undefined) {
    sanitized.views = 0;
  } else {
    sanitized.views = parseInt(sanitized.views, 10) || 0;
  }

  // Handle boolean fields
  if (typeof sanitized.is_featured === 'string') {
    sanitized.is_featured = sanitized.is_featured === 'true';
  }
  if (typeof sanitized.is_active === 'string') {
    sanitized.is_active = sanitized.is_active === 'true';
  }

  // Handle DATE fields - convert empty string to null
  if (sanitized.application_deadline === '' || sanitized.application_deadline === undefined) {
    sanitized.application_deadline = null;
  }
  if (sanitized.posted_date === '' || sanitized.posted_date === undefined) {
    sanitized.posted_date = new Date();
  }

  return sanitized;
};

export const createCareer = async (req, res) => {
  try {
    const sanitized = sanitizeCareerData(req.body);
    const {
      job_title, slug, department, location, employment_type, experience_level,
      salary_range, description, responsibilities, requirements, qualifications,
      benefits, application_deadline, contact_email, application_url,
      is_featured, is_active, status
    } = sanitized;

    const career = await Career.create({
      job_title, slug, department, location, employment_type, experience_level,
      salary_range, description, responsibilities, requirements, qualifications,
      benefits, application_deadline, contact_email, application_url,
      is_featured, is_active, status
    });

    res.status(201).json({
      success: true,
      data: career,
      message: 'Career created successfully'
    });
  } catch (error) {
    console.error('Error creating career:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating career',
      error: error.message
    });
  }
};

export const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    const sanitized = sanitizeCareerData(req.body);
    const {
      job_title, slug, department, location, employment_type, experience_level,
      salary_range, description, responsibilities, requirements, qualifications,
      benefits, application_deadline, contact_email, application_url,
      is_featured, is_active, status
    } = sanitized;

    await career.update({
      job_title, slug, department, location, employment_type, experience_level,
      salary_range, description, responsibilities, requirements, qualifications,
      benefits, application_deadline, contact_email, application_url,
      is_featured, is_active, status
    });

    res.json({
      success: true,
      data: career,
      message: 'Career updated successfully'
    });
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating career',
      error: error.message
    });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    await career.destroy();

    res.json({
      success: true,
      message: 'Career deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting career',
      error: error.message
    });
  }
};

export const updateCareerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    await career.update({ status });

    res.json({
      success: true,
      data: career,
      message: 'Career status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating career status',
      error: error.message
    });
  }
};