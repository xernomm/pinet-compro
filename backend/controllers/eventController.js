import { Event } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllEvents = async (req, res) => {
  try {
    const { is_published, is_featured, event_type, status, is_online, search, page = 1, limit = 10 } = req.query;
    const where = {};

    if (is_published !== undefined) where.is_published = is_published === 'true';
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (event_type) where.event_type = event_type;
    if (status) where.status = status;
    if (is_online !== undefined) where.is_online = is_online === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      where,
      order: [['start_date', 'DESC'], ['created_at', 'DESC']],
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
      message: 'Error fetching events',
      error: error.message
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { slug: req.params.slug }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        status: 'upcoming',
        is_published: true,
        start_date: {
          [Op.gte]: new Date()
        }
      },
      order: [['start_date', 'ASC']],
      limit: 10
    });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

// Helper function to sanitize event data
const sanitizeEventData = (data) => {
  const sanitized = { ...data };

  // Handle ENUM fields - use default if empty
  if (!sanitized.event_type || sanitized.event_type === '') {
    sanitized.event_type = 'seminar';
  }
  if (!sanitized.status || sanitized.status === '') {
    sanitized.status = 'upcoming';
  }

  // Handle INTEGER fields
  if (sanitized.max_participants === '' || sanitized.max_participants === undefined) {
    sanitized.max_participants = null;
  } else if (sanitized.max_participants) {
    sanitized.max_participants = parseInt(sanitized.max_participants, 10) || null;
  }

  // Handle boolean fields
  if (typeof sanitized.is_online === 'string') {
    sanitized.is_online = sanitized.is_online === 'true';
  }
  if (typeof sanitized.is_featured === 'string') {
    sanitized.is_featured = sanitized.is_featured === 'true';
  }
  if (typeof sanitized.is_published === 'string') {
    sanitized.is_published = sanitized.is_published === 'true';
  }

  // Handle DATE fields - convert empty string to null
  ['start_date', 'end_date'].forEach(field => {
    if (sanitized[field] === '' || sanitized[field] === undefined) {
      sanitized[field] = null;
    }
  });

  // Handle TIME fields - convert empty string to null
  ['start_time', 'end_time'].forEach(field => {
    if (sanitized[field] === '' || sanitized[field] === undefined) {
      sanitized[field] = null;
    }
  });

  return sanitized;
};

export const createEvent = async (req, res) => {
  try {
    const data = sanitizeEventData(req.body);

    if (req.file) {
      data.featured_image = `/uploads/images/${req.file.filename}`;
    }

    // Ensure gallery is stringified JSON if present
    if (data.gallery) {
      if (typeof data.gallery === 'string') {
        try {
          // Validate it's valid JSON
          JSON.parse(data.gallery);
        } catch (e) {
          // If not valid JSON, wrap in array
          data.gallery = JSON.stringify([data.gallery]);
        }
      } else if (Array.isArray(data.gallery)) {
        data.gallery = JSON.stringify(data.gallery);
      }
    }

    const event = await Event.create(data);

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const data = sanitizeEventData(req.body);

    if (req.file) {
      data.featured_image = `/uploads/images/${req.file.filename}`;
    }

    // Ensure gallery is stringified JSON if present
    if (data.gallery) {
      if (typeof data.gallery === 'string') {
        try {
          // Validate it's valid JSON
          JSON.parse(data.gallery);
        } catch (e) {
          // If not valid JSON, wrap in array
          data.gallery = JSON.stringify([data.gallery]);
        }
      } else if (Array.isArray(data.gallery)) {
        data.gallery = JSON.stringify(data.gallery);
      }
    }

    await event.update(data);

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.update({ status });

    res.json({
      success: true,
      data: event,
      message: 'Event status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event status',
      error: error.message
    });
  }
};