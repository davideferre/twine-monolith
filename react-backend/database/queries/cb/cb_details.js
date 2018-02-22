const dbConnection = require('../../dbConnection');

const getCBDetailsQuery = `
  SELECT *
  FROM cbusiness
  WHERE id = $1`;

const getCBDetails = cbId =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getCBDetailsQuery, [cbId])
      .then(res => resolve(res.rows))
      .catch(reject);
  });

module.exports = getCBDetails;