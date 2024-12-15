const express = require('express');
const router = express.Router();
const { create_links, get_links, get_links_by_username, delete_link, update_link } = require('../controllers/socialMediaControllers');


router.post('/', create_links);
router.get('/', get_links);
router.get('/:username', get_links_by_username);
router.delete('/:username', delete_link);
router.put('/:username', update_link);

module.exports = router;
