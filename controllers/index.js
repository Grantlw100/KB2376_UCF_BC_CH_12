const router = require('express').Router();
const apiRoutes = require('./api')
const homeRoutes = require('./homeRoutes'); // Change the import statement to './homeRoutes' with the correct casing

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
