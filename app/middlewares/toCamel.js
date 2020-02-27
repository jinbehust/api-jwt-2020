const camelcaseKeys = require('camelcase-keys');

function toCamel(req, res, next) {
  try {
    req.params = camelcaseKeys(req.params, { deep: true });
    req.query = camelcaseKeys(req.query, { deep: true });
    req.body = camelcaseKeys(req.body, { deep: true });
    next();
  } catch (err) {
    res.send(`Error: ${err.message}`);
  }
}

module.exports = toCamel;
