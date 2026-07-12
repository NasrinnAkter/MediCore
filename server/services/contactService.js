import Contact from "../models/Contact.js";

export const submitContactService = async (data) => {
  return await Contact.create(data);
};

export const getContactsService = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};
