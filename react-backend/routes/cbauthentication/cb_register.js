const router = require('express').Router();
const hashCB = require('../../functions/cbhash');
const cbAdd = require('../../database/queries/cb/cb_add');
const sendCBemail = require('../../functions/sendCBemail');

router.post('/', (req, res, next) => {
  const { formPswd, formName, formEmail, formGenre } = req.body;

  const hashedPassword = hashCB(formPswd);
  const name = formName.toLowerCase();

  cbAdd(name, formEmail, formGenre, hashedPassword)
    .then(() => sendCBemail(formEmail, formName))
    .then(() => res.send({ success: true }))
    .catch(next);
});

module.exports = router;