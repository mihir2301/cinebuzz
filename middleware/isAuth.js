const jwt = require('jsonwebtoken');
require('dotenv/config');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.statusCode = 401
    return res.json('token required')
  }
  else{
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.TKN);
    }catch (err) {
      err.statusCode = 503;
      res.json('token expired')
    }
    if (!decodedToken) {
      res.statusCode = 503;
      res.json('token expired');
    }
    req.email = decodedToken.email;
  }
  next();
};