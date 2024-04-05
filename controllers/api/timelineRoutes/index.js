const router = require('express').Router();   

const CommentRoutes = require('./CommentRoutes');
const PLikeRoutes = require('./PLikeRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/likes', PLikeRoutes);
router.use('/comments', CommentRoutes);
router.use('/tags', tagRoutes);


module.exports = router;