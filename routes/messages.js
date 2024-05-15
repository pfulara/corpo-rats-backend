const express = require('express');
const jwt = require('jsonwebtoken');

const { Message } = require('../models/Message');
const { User } = require('../models/User');
const { getIdFromHeader } = require('../functions');
const messages = express.Router();

messages.post('/send', async (req, res) => {
  try {
    if (req.body.recipient && req.body.message) {
      const sender = getIdFromHeader(req.headers);
      const message = await Message.create({
        ...req.body,
        sender,
      });
      await User.findOneAndUpdate(
        { _id: req.body.recipient },
        { unreadMessage: true }
      );

      if (!message) {
        return res.json({ error: 'Server Error' });
      }
      return res.json({ error: null });
    }
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

messages.get('/get-messages', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);
    const messages = await Message.find({ recipient: id })
      .populate({ path: 'sender', select: 'username' })
      .limit(10)
      .sort('-createdAt');

    return res.json(messages);
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

messages.post('/delete', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);

    const deleted = await Message.findOneAndDelete({
      _id: req.body.messageId,
      recipient: id,
    });

    if (deleted) {
      const messages = await Message.find({
        recipient: id,
        unread: true,
      }).select('_id');

      if (!messages.length) {
        await User.findOneAndUpdate(
          { _id: id },
          { unreadMessage: false }
        );
      }
    }

    return res.json({ error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

messages.post('/flag-read', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);
    const message = await Message.findOneAndUpdate(
      { _id: req.body.messageId, recipient: id },
      { unread: false }
    );

    if (message) {
      const messages = await Message.find({
        recipient: id,
        unread: true,
      }).select('_id');

      if (!messages.length) {
        await User.findOneAndUpdate(
          { _id: id },
          { unreadMessage: false }
        );
      }
    }
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

module.exports = messages;
