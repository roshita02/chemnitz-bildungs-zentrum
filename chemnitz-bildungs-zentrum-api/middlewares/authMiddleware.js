import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import blacklistModel from '../models/blacklist.model.js';
dotenv.config();

async function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({message: 'User unauthorized'});
    const blacklisted = await blacklistModel.findOne({token: token });
    if (blacklisted && blacklisted.token) {
      return res.status(401).send({ message: 'Invalid Token: Token is blacklisted' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({message: 'User unauthorized'});
        }
        if (!user || user.id == '') {
          return res.status(401).json({message: 'User unauthorized'});
        }
        req.user = user;
        next();
    });
}

export default authenticateToken;