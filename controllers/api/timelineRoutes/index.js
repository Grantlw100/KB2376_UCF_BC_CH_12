const router = require('express').Router();   

const CommentRoutes = require('./commentRoutes');
const PLikeRoutes = require('./PLikeRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/likes', PLikeRoutes);
router.use('/comments', CommentRoutes);
router.use('/tags', tagRoutes);


module.exports = router;