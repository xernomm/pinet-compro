import { Value } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllValues = async (req, res) => {
  try {
    const { is_active } = req.query;
    const where = {};

    if (is_active !== undefined) where.is_active = is_active === 'true';

    const values = await Value.findAll({
      where,
      order: [['order_number', 'ASC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching values',
      error: error.message
    });
  }
};

export const getValueById = async (req, res) => {
  try {
    const value = await Value.findByPk(req.params.id);

    if (!value) {
      return res.status(404).json({
        success: false,
        message: 'Value not found'
      });
    }

    res.json({
      success: true,
      data: value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching value',
      error: error.message
    });
  }
};

export const createValue = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image_url = `/uploads/images/${req.file.filename}`;
    }

    const value = await Value.create(data);

    res.status(201).json({
      success: true,
      data: value,
      message: 'Value created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating value',
      error: error.message
    });
  }
};

export const updateValue = async (req, res) => {
  try {
    const value = await Value.findByPk(req.params.id);

    if (!value) {
      return res.status(404).json({
        success: false,
        message: 'Value not found'
      });
    }

    const data = { ...req.body };
    if (req.file) {
      data.image_url = `/uploads/images/${req.file.filename}`;
    }

    await value.update(data);

    res.json({
      success: true,
      data: value,
      message: 'Value updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating value',
      error: error.message
    });
  }
};

export const deleteValue = async (req, res) => {
  try {
    const value = await Value.findByPk(req.params.id);

    if (!value) {
      return res.status(404).json({
        success: false,
        message: 'Value not found'
      });
    }

    await value.destroy();

    res.json({
      success: true,
      message: 'Value deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting value',
      error: error.message
    });
  }
};