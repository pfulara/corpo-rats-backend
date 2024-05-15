const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  energy: {
    type: Number,
  },
  reward: {
    exp: { type: Number },
    money: { type: Number },
  },
  encounters: {
    type: Array,
    ref: 'Encounter',
    default: [],
  },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task };
