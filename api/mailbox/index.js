const router = require('express').Router();
const controller = require('./mailbox.controller');

router.post('', controller.createMailbox);
router.delete('/:id', controller.deleteMailbox);

module.exports = router;
