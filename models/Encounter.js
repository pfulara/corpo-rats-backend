const mongoose = require('mongoose');

const EncounterSchema = new mongoose.Schema({
  name: { type: String },
  stats: {
    brainHealth: { type: Number, default: 10 },
    stressResistance: { type: Number, default: 10 },
    logic: { type: Number, default: 10 },
    luck: { type: Number, default: 10 },
    multipler: { type: Number, default: 1 },
  },
  avatar: {
    sex: { type: String },
    faceColor: { type: String },
    hairStyle: { type: String },
    hairColor: { type: String },
    eyeStyle: { type: String },
    noseStyle: { type: String },
    mouthStyle: { type: String },
    glassesStyle: { type: String },
    hatStyle: { type: String },
    earSize: { type: String },
    shirtStyle: { type: String },
    shirtColor: { type: String },
    bgColor: { type: String },
  },
});

const Encounter = mongoose.model(
  'Encounter',
  EncounterSchema
);

module.exports = { Encounter };
