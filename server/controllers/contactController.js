import {
  submitContactService,
  getContactsService,
} from "../services/contactService.js";

export const submitContact = async (req, res) => {
  try {
    const contact = await submitContactService(req.body);
    res
      .status(201)
      .json({ message: "Message received! We'll get back to you soon." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await getContactsService();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
