const router = require('express').Router();

const controller = require('./circle.controller');

router.post('/', controller.createCircle);
router.delete('/:circleId', controller.deleteCircle);
router.post('/:circleId/mailbox/:mailboxId', controller.follow);
router.delete('/:circleId/mailbox/:mailboxId', controller.unfollow);


module.exports = router;
