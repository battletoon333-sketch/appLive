const { addGorup, fetchUrl, myGroups, getGroups, approveGroup, getGroupsForAdmin, increaseViews } = require('../controllers/waController');
const router = require('express').Router()

router.get('/fetchUrl', fetchUrl);

router.post('/addGroup', addGorup);

router.get('/myGroups', myGroups);

router.get('/getGroups', getGroups);

router.post('/increaseViews', increaseViews);


router.get('/admin/getGroups', getGroupsForAdmin);
router.post('/admin/approveGroup', approveGroup);

module.exports = router;