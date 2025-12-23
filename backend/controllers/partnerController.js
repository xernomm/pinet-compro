import { Partner } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllPartners = async (req, res) => {
  try {
    const { is_active, partnership_type, search } = req.query;
    const where = {};

    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (partnership_type) where.partnership_type = partnership_type;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const partners = await Partner.findAll({
      where,
      order: [['order_number', 'ASC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching partners',
      error: error.message
    });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching partner',
      error: error.message
    });
  }
};

export const getPartnerBySlug = async (req, res) => {
  try {
    const partner = await Partner.findOne({
      where: { slug: req.params.slug }
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching partner',
      error: error.message
    });
  }
};

export const createPartner = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.logo_url = `/uploads/logos/${req.file.filename}`;
    }

    const partner = await Partner.create(data);

    res.status(201).json({
      success: true,
      data: partner,
      message: 'Partner created successfully'
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating partner',
      error: error.message
    });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    const data = { ...req.body };
    if (req.file) {
      data.logo_url = `/uploads/logos/${req.file.filename}`;
    }

    await partner.update(data);

    res.json({
      success: true,
      data: partner,
      message: 'Partner updated successfully'
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating partner',
      error: error.message
    });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    await partner.destroy();

    res.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting partner',
      error: error.message
    });
  }
};