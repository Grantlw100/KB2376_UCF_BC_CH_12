const router = require('express').Router();
const apiRoutes = require('./profileRoutes');
const timelineRoutes = require('./timelineRoutes');

router.use('/profile', apiRoutes);
router.use('/timeline', timelineRoutes);

module.exports = router;