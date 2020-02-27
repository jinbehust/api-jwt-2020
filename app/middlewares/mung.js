const mung = require('express-mung');
const snakecaseKeys = require('snakecase-keys');

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function transformObjectId(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  // typeof null = object
  if (obj === null) {
    return null;
  }

  // Check if obj is Mongoose Object
  if (obj._doc) {
    return transformObjectId(obj.toJSON());
  }

  // Check if obj is ObjectId
  if (obj._bsontype === 'ObjectID') {
    return obj.toString();
  }

  Object.keys(obj).forEach((key) => {
    obj[key] = transformObjectId(obj[key]);
  });

  if (Array.isArray(obj)) return obj;
  if (Object.prototype.toString.call(obj) === '[object Date]') return obj;

  return sortObject(obj);
}

function toSnake(body, req, res) {
  try {
    body = snakecaseKeys(transformObjectId(body), { deep: true });
    return body;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

module.exports = mung.json(toSnake);
