const Contact = require('../models/Contact');

const ContactController = {
    getAllContacts: async (req, res) => {
        try {
            const contacts = await Contact.find();
            res.json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getContactById: async (req, res) => {
        try {
            const id = req.params.id;
            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.json(contact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createContact: async (req, res) => {
        try {
            const contactData = req.body;
            const newContact = new Contact(contactData);
            await newContact.save();
            res.status(201).json(newContact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateContact: async (req, res) => {
        try {
            const id = req.params.id;
            const contactData = req.body;
            const updatedContact = await Contact.findByIdAndUpdate(id, contactData, { new: true });
            if (!updatedContact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.json(updatedContact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteContact: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedContact = await Contact.findByIdAndDelete(id);
            if (!deletedContact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchContactsByEmail: async (req, res) => {
        try {
            const email = req.query.email;
            const contacts = await Contact.find({ email: { $regex: email, $options: 'i' } });
            res.json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    markContactReplied: async (req, res) => {
        try {
            const id = req.params.id;
            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            contact.status = 'Replied';
            await contact.save();
            res.json({ message: 'Contact marked as replied' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = ContactController;
