import { verifyingToken } from '../utils/jwtToken.js';

const checkAuth = {
  verifyUser: (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).send({ error: 'no token provided' });
    }
    if (token) {
        try {
          const user = verifyingToken(token);
          req.user = user;
          next();
        } catch (error) {
          return res.status(401).send({ error: 'Invalid Token' });
        }
      
    }
  },
};

export default checkAuth;