import { Service } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllServices = async (req, res) => {
  try {
    const { is_active, search } = req.query;
    const where = {};

    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } }
      ];
    }

    const services = await Service.findAll({
      where,
      order: [['order_number', 'ASC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

export const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      where: { slug: req.params.slug }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Helper function to sanitize service data
const sanitizeServiceData = (data) => {
  const sanitized = { ...data };

  // Handle INTEGER fields
  if (sanitized.order_number === '' || sanitized.order_number === undefined) {
    sanitized.order_number = 0;
  } else {
    sanitized.order_number = parseInt(sanitized.order_number, 10) || 0;
  }

  // Handle boolean fields
  if (typeof sanitized.is_active === 'string') {
    sanitized.is_active = sanitized.is_active === 'true';
  }

  return sanitized;
};

// Helper function to create slug
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start
    .replace(/-+$/, '');      // Trim - from end
};

export const createService = async (req, res) => {
  try {
    const data = sanitizeServiceData(req.body);
    if (req.file) {
      data.image_url = `/uploads/images/${req.file.filename}`;
    }

    // Generate or clean slug
    if (!data.slug && data.name) {
      data.slug = createSlug(data.name);
    } else if (data.slug) {
      data.slug = createSlug(data.slug);
    }

    // Ensure slug is not empty
    if (!data.slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug cannot be generated. Please provide a valid name or slug.'
      });
    }

    const service = await Service.create(data);

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Service with this slug already exists',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const data = sanitizeServiceData(req.body);
    if (req.file) {
      data.image_url = `/uploads/images/${req.file.filename}`;
    }

    // Clean slug if provided
    if (data.slug) {
      data.slug = createSlug(data.slug);
    }
    // If slug is cleared/empty string, we might want to regenerate it from name, or keep old one?
    // If user explicitly sends empty slug, let's regenerate from name (new name or old name)
    if (data.slug === '' && data.name) {
      data.slug = createSlug(data.name);
    } else if (data.slug === '' && !data.name) {
      // If updating without name and clearing slug, fallback to current name
      data.slug = createSlug(service.name);
    }

    await service.update(data);

    res.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Service with this slug already exists',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.destroy();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};