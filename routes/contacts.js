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
router.put('/:id', (req, res, next) => {
  res.send('Update contact');
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', (req, res, next) => {
  res.send('Delete contact');
});

module.exports = router;
