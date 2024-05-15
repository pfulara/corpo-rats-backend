const express = require('express');

const { User } = require('../models/User');
const { Task } = require('../models/Task');
const { Encounter } = require('../models/Encounter');

const admin = express.Router();

// Users list
admin.get('/users', async (req, res) => {
  try {
    const users = await User.find().select(
      'email username createdAt status admin'
    );

    if (users) {
      return res.json({ users, error: null });
    }
    return res.json({ users: [], error: 'Server Error' });
  } catch {
    return res.json({ users: [], error: 'Server Error' });
  }
});

// Tasks list
admin.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('encounters');

    if (tasks) {
      return res.json({ tasks, error: 'Server Error' });
    }
    return res.json({ tasks: [], error: 'Server Error' });
  } catch {
    return res.json({ tasks: [], error: 'Server Error' });
  }
});

// Delete Task
admin.post('/delete-task', async (req, res) => {
  try {
    return res.json({ tasks: [], error: null });
  } catch {
    return res.json({ tasks: [], error: 'Server Error' });
  }
});

// Encounters list
admin.get('/encounters', async (req, res) => {
  try {
    const encounters = await Encounter.find();

    if (encounters) {
      return res.json({
        encounters,
        error: 'Server Error',
      });
    }
    return res.json({
      encounters: [],
      error: 'Server Error',
    });
  } catch {
    return res.json({
      encounters: [],
      error: 'Server Error',
    });
  }
});

// Add Encounter
admin.post('/add-encounter', async (req, res) => {
  try {
    const encounter = req.body.encounter;
    delete encounter._id;
    await Encounter.create(encounter);
    return res.json({ error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

// Edit encounter
admin.post('/edit-encounter', async (req, res) => {
  try {
    const encounter = req.body.encounter;

    const dupa = await Encounter.findByIdAndUpdate(
      encounter._id,
      encounter
    );

    console.log(req.body.encounter);
    return res.json({ error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

// Delete encounter
admin.post('/delete-encounter', async (req, res) => {
  try {
    const encounter = await Encounter.findByIdAndDelete(
      req.body.encounterId
    );

    if (encounter) {
      return res.json({ error: null });
    }
    return res.json({ error: 'Server Error' });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

module.exports = admin;
