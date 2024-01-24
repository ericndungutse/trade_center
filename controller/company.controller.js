import Company from '../model/company.model.js';

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

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
