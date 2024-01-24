import jwt from 'jsonwebtoken';

import Company from '../model/company.model.js';
import User from '../model/user.model.js';
import randomPasswordGenerator from '../utils/randomPasswordGenerator.js';

const createAndSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;
  user.verified = undefined;
  user.active = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

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

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) CHECK IF EMAIL AND PASSWORD ARE PRESENT
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Please provide email and password' });
  }

  // 2) CHECK IF USER EXISTS AND PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select(
    '+password +verified +active'
  );

  if (user.verified === false || user.active === false) {
    return res.status(403).json({
      status: 'fail',
      message: 'Your account is not activated',
    });
  }

  if (user)
    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(401).json({
        status: 'fail',
        message: 'Email or password is incorrect',
      });

  // 3) IF EVERYTHING OK, SIGN AND SEND TOKEN TO CLIENT
  createAndSendToken(user, 200, res);
};
