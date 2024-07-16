const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactController');

router.get('/search', contactController.searchContactsByEmail);
router.get('', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.post('', contactController.createContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);
router.put('/mark-replied/:id', contactController.markContactReplied);

module.exports = router;
