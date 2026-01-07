import { Product } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllProducts = async (req, res) => {
  try {
    const { is_active, is_featured, category, search, page = 1, limit = 10 } = req.query;
    const where = {};

    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [['order_number', 'ASC'], ['created_at', 'DESC']],
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
      message: 'Error fetching products',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Helper function to sanitize product data
const sanitizeProductData = (data) => {
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
  if (typeof sanitized.is_featured === 'string') {
    sanitized.is_featured = sanitized.is_featured === 'true';
  }

  return sanitized;
};

export const createProduct = async (req, res) => {
  try {
    const data = sanitizeProductData(req.body);

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        data.image_url = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files.gallery) {
        const galleryPaths = req.files.gallery.map(file => `/uploads/gallery/${file.filename}`);
        data.gallery = JSON.stringify(galleryPaths);
      }
    }

    // Parse and re-stringify JSON fields for TEXT columns
    ['features', 'benefits', 'specifications'].forEach(field => {
      if (data[field]) {
        if (typeof data[field] === 'string') {
          try {
            // Validate it's valid JSON, then keep as string
            JSON.parse(data[field]);
          } catch (e) {
            // If not valid JSON, wrap in array
            data[field] = JSON.stringify([data[field]]);
          }
        } else if (Array.isArray(data[field]) || typeof data[field] === 'object') {
          data[field] = JSON.stringify(data[field]);
        }
      }
    });

    // Stringify gallery if it's an array
    if (Array.isArray(data.gallery)) {
      data.gallery = JSON.stringify(data.gallery);
    }

    const product = await Product.create(data);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const data = sanitizeProductData(req.body);

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        data.image_url = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files.gallery) {
        const newGallery = req.files.gallery.map(file => `/uploads/gallery/${file.filename}`);
        // Parse existing gallery if it's a string
        let existingGallery = product.gallery || [];
        if (typeof existingGallery === 'string') {
          try {
            existingGallery = JSON.parse(existingGallery);
          } catch (e) {
            existingGallery = [];
          }
        }
        data.gallery = JSON.stringify([...existingGallery, ...newGallery]);
      }
    }

    // Parse and re-stringify JSON fields for TEXT columns
    ['features', 'benefits', 'specifications'].forEach(field => {
      if (data[field]) {
        if (typeof data[field] === 'string') {
          try {
            // Validate it's valid JSON, then keep as string
            JSON.parse(data[field]);
          } catch (e) {
            // If not valid JSON, wrap in array
            data[field] = JSON.stringify([data[field]]);
          }
        } else if (Array.isArray(data[field]) || typeof data[field] === 'object') {
          data[field] = JSON.stringify(data[field]);
        }
      }
    });

    // Stringify gallery if it's an array
    if (Array.isArray(data.gallery)) {
      data.gallery = JSON.stringify(data.gallery);
    }

    await product.update(data);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};