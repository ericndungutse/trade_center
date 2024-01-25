import { verifyJWToken } from '../utils/jwt.js';
import User from '../model/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) GET THE TOKEN AND CHECK IF IT EXIST
    if (req.headers.authorization)
      token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'fail',
        message: 'Access denied! Please sign in.',
      });
      return;
    }

    // 2) VELIFY THE TOKEN (VERIFY AND CHECK TIMESPAN)
    const { id } = verifyJWToken(token);

    // 3) CHECK IF USER STILL EXIST
    const currentUser = await User.findById(id);
    if (!currentUser)
      return res
        .status(401)
        .json({ status: 'fail', message: 'User no longer exists' });

    // 5) GRANT ACCESS (AUTHORIZE)
    req.user = currentUser;

    next();
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
