import Company from '../model/company.model.js';

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('products');

    res.status(200).json({
      status: 'success',
      data: {
        companies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('products');

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
};
