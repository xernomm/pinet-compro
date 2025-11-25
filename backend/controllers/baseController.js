import { Op } from 'sequelize';

/**
 * Base Controller with common CRUD operations
 * Can be extended by other controllers
 */
class BaseController {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Get all records with filtering, searching, and pagination
   */
  getAll = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, ...filters } = req.query;
      const where = {};

      // Apply filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          if (filters[key] === 'true' || filters[key] === 'false') {
            where[key] = filters[key] === 'true';
          } else {
            where[key] = filters[key];
          }
        }
      });

      // Apply search if searchFields are defined
      if (search && this.searchFields) {
        where[Op.or] = this.searchFields.map(field => ({
          [field]: { [Op.like]: `%${search}%` }
        }));
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await this.model.findAndCountAll({
        where,
        order: this.defaultOrder || [['created_at', 'DESC']],
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
        message: `Error fetching ${this.modelName}`,
        error: error.message
      });
    }
  };

  /**
   * Get single record by ID
   */
  getById = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`
        });
      }

      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching ${this.modelName}`,
        error: error.message
      });
    }
  };

  /**
   * Get single record by slug
   */
  getBySlug = async (req, res) => {
    try {
      const record = await this.model.findOne({
        where: { slug: req.params.slug }
      });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`
        });
      }

      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching ${this.modelName}`,
        error: error.message
      });
    }
  };

  /**
   * Create new record
   */
  create = async (req, res) => {
    try {
      const record = await this.model.create(req.body);

      res.status(201).json({
        success: true,
        data: record,
        message: `${this.modelName} created successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error creating ${this.modelName}`,
        error: error.message
      });
    }
  };

  /**
   * Update existing record
   */
  update = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`
        });
      }

      await record.update(req.body);

      res.json({
        success: true,
        data: record,
        message: `${this.modelName} updated successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error updating ${this.modelName}`,
        error: error.message
      });
    }
  };

  /**
   * Delete record
   */
  delete = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`
        });
      }

      await record.destroy();

      res.json({
        success: true,
        message: `${this.modelName} deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error deleting ${this.modelName}`,
        error: error.message
      });
    }
  };
}

export default BaseController;