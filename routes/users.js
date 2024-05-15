const express = require('express');

const { User } = require('../models/User');
const { getIdFromHeader } = require('../functions');

const users = express.Router();

users.get('/me', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);
    const user = await User.findById(id).select(
      '-password'
    );
    return res.json({ user, error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

users.post('/save-new-character', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);
    const uniqueUser = await User.findOne({
      username: req.body.username,
    }).select('username');
    if (uniqueUser) {
      return res.json({ error: 'Username taken' });
    }

    const user = await User.findByIdAndUpdate(id, {
      avatar: req.body.avatar,
      username: req.body.username,
    });
    if (user) {
      return res.json({ error: null });
    } else {
      return res.json({ error: 'Server Error' });
    }
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

users.get('/ranking', async (req, res) => {
  try {
    const users = await User.find({
      username: { $ne: null },
    })
      .select('-password -email')
      .sort('stats.level');
    return res.json({ users, error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

users.post('/add-stat', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);
    const user = await User.findById(id);

    if (user) {
      if (user.stats.pointsToSpend) {
        user.stats[req.body.key]++;
        user.stats.pointsToSpend--;

        user.save();
        return res.sendStatus(200);
      }
    }
    return res.json({ error: 'Server Error' });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

module.exports = users;
