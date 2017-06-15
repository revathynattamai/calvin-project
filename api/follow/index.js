const router = require('express').Router({ mergeParams: true });

const controller = require('../follow/follow.controller');

router.post('/:mailboxId/circle/:circleId', controller.follow);
router.delete('/:mailboxId/circle/:circleId', controller.unfollow);

module.exports=router;
