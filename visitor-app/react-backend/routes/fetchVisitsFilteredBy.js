const express = require('express');

const router = express.Router();

const getVisitsFilteredBy = require('../database/queries/getVisitsFilteredBy');

router.post('/', (req, res, next) => {
  getVisitsFilteredBy(req.auth.cb_id, req.body)
    .then(users => res.send({ success: true, users }))
    .catch(next);
});

module.exports = router;
