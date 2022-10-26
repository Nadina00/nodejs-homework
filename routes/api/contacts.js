const express = require("express");

const router = express.Router();

const {listContacts, getContactId, addContact, removeContact, updateContact, updateStatusContact} = require('../../controllers/contactsControllers')

router.get("/", listContacts);

router.get("/:id", getContactId);

router.post("/", addContact);

router.delete("/:id", removeContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateStatusContact)

module.exports = router;