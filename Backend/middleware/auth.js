import { verifyToken } from '../config/jwt.js';

export const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = decoded.id;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
  }
};