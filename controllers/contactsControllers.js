const {
  getAlltasks,
  getContactById,
  creatContact,
  removeContactId,
  updateContactId,
} = require("../models/contacts");

const listContacts = async (req, res, next) => {
  try {
    const results = await getAlltasks();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getContactId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await getContactById(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const results = await creatContact({ name, email, phone, favorite });
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone, favorite } = req.body;
    const results = await updateContactId(contactId, {
      name,
      email,
      phone,
      favorite,
    });
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (!favorite) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const results = await updateContactId(contactId, {
      favorite,
    });
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await removeContactId(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  listContacts,
  getContactId,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
