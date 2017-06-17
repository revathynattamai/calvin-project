const router = require('express').Router();
const controller = require('./activity.controller');
// For circle
router.post('/:circleId/activity', controller.createPublishActivity);

// console.log('Inside index');
module.exports = router;
