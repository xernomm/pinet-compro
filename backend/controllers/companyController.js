import { CompanyInfo } from '../models/index.js';

export const getCompanyInfo = async (req, res) => {
  try {
    let company = await CompanyInfo.findOne();
    
    if (!company) {
      company = await CompanyInfo.create({
        company_name: 'Your Company Name',
        tagline: 'Your Company Tagline'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company info',
      error: error.message
    });
  }
};

export const updateCompanyInfo = async (req, res) => {
  try {
    let company = await CompanyInfo.findOne();
    
    if (!company) {
      company = await CompanyInfo.create(req.body);
    } else {
      await company.update(req.body);
    }

    res.json({
      success: true,
      data: company,
      message: 'Company info updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating company info',
      error: error.message
    });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    let company = await CompanyInfo.findOne();
    
    if (!company) {
      company = await CompanyInfo.create({ logo_url: logoUrl });
    } else {
      await company.update({ logo_url: logoUrl });
    }

    res.json({
      success: true,
      data: {
        logo_url: logoUrl
      },
      message: 'Logo uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading logo',
      error: error.message
    });
  }
};