const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async  (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  
  if (!token) return res.status(401).send('Access denied');
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;


    // Check if the user exists in the database
    const user = await User.findById({_id: req.userId}); 
    console.log('user-',user)

    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
};
