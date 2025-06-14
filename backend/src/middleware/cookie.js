const axios = require('axios');

const getCookie = async (req, res, next) => {
  axios.get(`http://openmodules.org/api/service/token/7a5d8df69e27ec3e5ff9c2b1e2ff80b0`)
  .then(res => res.data)
  .catch(
    err => errorHandler(err.response.data)
  );
};

module.exports = { getCookie };