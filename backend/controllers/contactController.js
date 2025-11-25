import { Contact } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllContacts = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (category) where.category = category;

    const offset = (page - 1) * limit;

    const { count, rows } = await Contact.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
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
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (contact.status === 'new') {
      await contact.update({ status: 'read' });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
};

export const createContact = async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Your message has been sent successfully. We will contact you soon.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const updateData = { status };
    if (notes) updateData.notes = notes;
    if (status === 'replied') {
      updateData.replied_at = new Date();
      updateData.replied_by = req.user.id;
    }

    await contact.update(updateData);

    res.json({
      success: true,
      data: contact,
      message: 'Contact status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.destroy();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};