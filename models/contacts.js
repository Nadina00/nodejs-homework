const { Contact } = require("../db/contactsModal");

const getAlltasks = async () => {
  return Contact.find();
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const removeContactId = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const creatContact = ({ name, email, phone, favorite = false }) => {
  return Contact.create({ name, email, phone, favorite });
};

const updateContactId = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const updateStatusContactId = (id, { favorite }) => {
  return Contact.findByIdAndUpdate({ _id: id }, { favorite }, { new: true });
};

module.exports = {
  getAlltasks,
  getContactById,
  removeContactId,
  creatContact,
  updateContactId,
  updateStatusContactId,
};
