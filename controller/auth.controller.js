import Company from '../model/companyProfile.model.js';
import User from '../model/user.model.js';
import randomPasswordGenerator from '../utils/randomPasswordGenerator.js';

export const signUp = async (req, res) => {
  try {
    const entityType = req.body.role;
    let company, responseMsg;

    // Determine Entity type
    const isCompany = entityType === 'company';
    const isUser = entityType === 'user';

    // Check if user already exists
    if (await User.findOne({ email: req.body.email }))
      return res.status(400).json({
        status: 'fail',
        message: 'email already in use.',
      });

    // 1) create company profile
    if (isCompany) {
      company = await Company.create({
        name: req.body.name,
        companyLogo: req.body.companyLogo,
        sector: req.body.sector,
        location: req.body.location,
      });

      // 2) created associated associated user passed in the
      await User.create({
        ...req.body,
        company: company.id,
        password: randomPasswordGenerator(),
      });

      responseMsg =
        'Company registered successfully! You will be notified once your company is verified.';
    }

    if (isUser) {
      await User.create(req.body);
      responseMsg =
        'Registration successfully! Check your email for verification link.';
    }

    res.status(201).json({
      status: 'sucesss',
      message: responseMsg,
    });
  } catch (error) {
    console.error(error);
  }
};
