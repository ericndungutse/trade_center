import jwt from 'jsonwebtoken';

import Company from '../model/company.model.js';
import User from '../model/user.model.js';

const createAndSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
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
    const entityType = req.body.entityType;
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
        role: 'admin',
      });

      // 2) create admin associated to the company created
      await User.create({
        email: req.body.email,
        company: company.id,
        password: 'test12345',
        role: 'admin',
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
    // TODO: HANDLE ERROR
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

  if (user && (user.verified === false || user.active === false)) {
    return res.status(403).json({
      status: 'fail',
      message: 'Your account is not activated',
    });
  }

  if (!user || !(await user.correctPassword(password, user.password)))
    return res.status(401).json({
      status: 'fail',
      message: 'Email or password is incorrect',
    });

  // 3) IF EVERYTHING OK, SIGN AND SEND TOKEN TO CLIENT
  createAndSendToken(user, 200, res);
};
