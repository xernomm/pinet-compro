import { Hero } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllHeroes = async (req, res) => {
  try {
    const { is_active } = req.query;
    const where = {};

    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    const heroes = await Hero.findAll({
      where,
      order: [['order_number', 'ASC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching heroes',
      error: error.message
    });
  }
};

export const getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero not found'
      });
    }

    res.json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero',
      error: error.message
    });
  }
};

export const createHero = async (req, res) => {
  try {
    const {
      title, subtitle, description, image_url, button_text, button_link,
      order_number, is_active
    } = req.body;

    const hero = await Hero.create({
      title, subtitle, description, image_url, button_text, button_link,
      order_number, is_active
    });

    res.status(201).json({
      success: true,
      data: hero,
      message: 'Hero created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating hero',
      error: error.message
    });
  }
};

export const updateHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero not found'
      });
    }

    const {
      title, subtitle, description, image_url, button_text, button_link,
      order_number, is_active
    } = req.body;

    await hero.update({
      title, subtitle, description, image_url, button_text, button_link,
      order_number, is_active
    });

    res.json({
      success: true,
      data: hero,
      message: 'Hero updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hero',
      error: error.message
    });
  }
};

export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero not found'
      });
    }

    await hero.destroy();

    res.json({
      success: true,
      message: 'Hero deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hero',
      error: error.message
    });
  }
};