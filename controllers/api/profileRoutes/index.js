const router = require('express').Router();

const followerRoutes = require('./followerRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');

router.use('/follow', followerRoutes);
router.use('/:user_id/posts', postRoutes);
router.use('/', userRoutes);

module.exports = router;