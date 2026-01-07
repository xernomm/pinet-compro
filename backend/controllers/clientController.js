import { Client } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllClients = async (req, res) => {
  try {
    const { is_active, is_featured, industry, search } = req.query;
    const where = {};

    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (industry) where.industry = industry;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const clients = await Client.findAll({
      where,
      order: [['order_number', 'ASC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
};

export const getClientBySlug = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { slug: req.params.slug }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
};

// Helper function to sanitize client data
const sanitizeClientData = (data) => {
  const sanitized = { ...data };

  // Handle INTEGER fields - convert to null if empty
  if (sanitized.collaboration_since === '' || sanitized.collaboration_since === undefined) {
    sanitized.collaboration_since = null;
  } else if (sanitized.collaboration_since) {
    sanitized.collaboration_since = parseInt(sanitized.collaboration_since, 10) || null;
  }

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

export const createClient = async (req, res) => {
  try {
    const data = sanitizeClientData(req.body);
    if (req.file) {
      data.logo_url = `/uploads/logos/${req.file.filename}`;
    }

    const client = await Client.create(data);

    res.status(201).json({
      success: true,
      data: client,
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const data = sanitizeClientData(req.body);
    if (req.file) {
      data.logo_url = `/uploads/logos/${req.file.filename}`;
    }

    await client.update(data);

    res.json({
      success: true,
      data: client,
      message: 'Client updated successfully'
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    await client.destroy();

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};