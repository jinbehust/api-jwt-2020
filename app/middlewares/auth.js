const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (payload) {
        req.user = payload;
        next();
      } else {
        res.status(401).send(`Error: ${err.message}`);
      }
    });
  } catch (err) {
    res.status(401).send(`Error: ${err.message}`);
  }
};


module.exports = {
  checkToken,
};
