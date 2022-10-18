const express = require("express");

const router = express.Router();

const Joi = require("joi");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts.js");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await listContacts();

    res.json({ allContacts, status: "success" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw console.error(404, "Not found");
    }
    res.json({ contact, status: "success" });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: Joi.number().required(),
    });

    const validationPost = schema.validate(req.body);
    if (validationPost.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.json({ newContact, status: "success" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteContact = await removeContact(id);
    if (!deleteContact) {
      throw Error(404, "Not found");
    }

    res.json({ message: "contact deleted" });
  } catch (e) {
    next(e);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: Joi.number().required(),
    });

    const validationPut = schema.validate(req.body);
    if (validationPut.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const newContact = await updateContact(contactId, name, email, phone);
    res.json({ newContact, status: "success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
