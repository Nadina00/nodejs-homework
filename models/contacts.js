const fs = require("fs/promises");
const uuid = require("uuid");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const dataString = await fs.readFile(contactsPath, "utf8");
  const data = JSON.parse(dataString);
  return data;
};

const getContactById = async (id) => {
  const constatsAll = await listContacts();
  const contactFind = constatsAll.find((constat) => constat.id === id);
  console.log(contactFind);
  return contactFind;
};

const removeContact = async (contactId) => {
  const constatsAll = await listContacts();
  const index = constatsAll.findIndex((contact) => contact.id === contactId);
  const deletedContact = constatsAll[index];
  if (index !== -1) {
    constatsAll.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(constatsAll));
  }
  return deletedContact;
};

const addContact = async (name, email, phone) => {
  const newContact = {
    id: uuid.v4(),
    name: name,
    email: email,
    phone: phone,
  };
  const constatsAll = await listContacts();
  constatsAll.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(constatsAll), null, 2);
  return newContact;
};

const updateContact = async (contactId, name, email, phone) => {
  const constatsAll = await listContacts();
  const contactIndex = constatsAll.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex !== -1) {
    constatsAll[contactIndex].name = name;
    constatsAll[contactIndex].email = email;
    constatsAll[contactIndex].phone = phone;
    await fs.writeFile(contactsPath, JSON.stringify(constatsAll), null, 2);
    return constatsAll[contactIndex];
  } else return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
