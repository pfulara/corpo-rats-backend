const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models/User');

const auth = express.Router();

auth.post('/signin', async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await User.findOne({
        email: req.body.email,
      }).select('password');
      if (user) {
        const match = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (match) {
          const token = await jwt.sign(
            `${user._id}`,
            process.env.TOKEN_SECRET
          );
          return res.json({ jwt: token, error: null });
        }
      }
      return res.json({
        error: 'Wrong username or password',
      });
    } else {
      return res.json({ error: 'Provide all credentials' });
    }
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

auth.post('/signup', async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
      );
      const user = await User.create({
        ...req.body,
        password: hashedPassword,
      });
      const token = await jwt.sign(
        `${user._id}`,
        process.env.TOKEN_SECRET
      );
      return res.json({ jwt: token, error: null });
    } else {
      return res.json({ error: 'Provide all credentials' });
    }
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

module.exports = auth;
