const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all user contacts
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.status(200).json({ contacts });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
  '/',
  [check('name', 'Name is required').not().isEmpty()],
  auth,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, type } = req.body;

      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.status(201).json({ contact });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ contact });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.status(200).json({ msg: 'Contact removed' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
