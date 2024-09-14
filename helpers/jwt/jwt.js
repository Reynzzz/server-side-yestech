const jwt = require("jsonwebtoken");
const SECRET = 'secret';

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, SECRET);
  },
  verify: (token) => {
    return jwt.verify(token, SECRET);
  },
};
