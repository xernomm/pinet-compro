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

export const createProduct = async (req, res) => {
  try {
    const {
      name, slug, category, short_description, description, features, benefits,
      specifications, target_segment, image_url, gallery, brochure_url, video_url,
      price_range, order_number, is_featured, is_active, meta_title, meta_description
    } = req.body;

    const product = await Product.create({
      name, slug, category, short_description, description, features, benefits,
      specifications, target_segment, image_url, gallery, brochure_url, video_url,
      price_range, order_number, is_featured, is_active, meta_title, meta_description
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
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

    const {
      name, slug, category, short_description, description, features, benefits,
      specifications, target_segment, image_url, gallery, brochure_url, video_url,
      price_range, order_number, is_featured, is_active, meta_title, meta_description
    } = req.body;

    await product.update({
      name, slug, category, short_description, description, features, benefits,
      specifications, target_segment, image_url, gallery, brochure_url, video_url,
      price_range, order_number, is_featured, is_active, meta_title, meta_description
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
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