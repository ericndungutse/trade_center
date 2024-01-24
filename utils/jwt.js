import jwt from 'jsonwebtoken';

export const verifyJWToken = (userToken) => {
  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error(`${error.message}, Please login again`);
  }
};
