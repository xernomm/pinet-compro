import { News } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllNews = async (req, res) => {
  try {
    const { is_published, is_featured, category, search, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (is_published !== undefined) where.is_published = is_published === 'true';
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      where,
      order: [['published_date', 'DESC'], ['created_at', 'DESC']],
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
      message: 'Error fetching news',
      error: error.message
    });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Increment views
    await news.increment('views');

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({
      where: { slug: req.params.slug }
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Increment views
    await news.increment('views');

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

export const createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);

    res.status(201).json({
      success: true,
      data: news,
      message: 'News created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: error.message
    });
  }
};

export const updateNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    await news.update(req.body);

    res.json({
      success: true,
      data: news,
      message: 'News updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: error.message
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    await news.destroy();

    res.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message
    });
  }
};

export const publishNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    await news.update({
      is_published: true,
      published_date: new Date()
    });

    res.json({
      success: true,
      data: news,
      message: 'News published successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error publishing news',
      error: error.message
    });
  }
};