const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: null,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'Active',
    },
    unreadMessage: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: {
        sex: String,
        faceColor: String,
        hairStyle: String,
        hairColor: String,
        eyeStyle: String,
        noseStyle: String,
        mouthStyle: String,
        glassesStyle: String,
        bgColor: String,
        hatStyle: String,
        earSize: String,
        shirtStyle: String,
        shirtColor: String,
      },
      default: null,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    stats: {
      level: {
        type: Number,
        default: 1,
      },
      energy: {
        type: Number,
        default: 100,
      },
      exp: {
        current: {
          type: Number,
          default: 0,
        },
        goal: {
          type: Number,
          default: 100,
        },
      },
      brainHealth: { type: Number, default: 10 },
      stressResistance: { type: Number, default: 10 },
      logic: { type: Number, default: 10 },
      luck: { type: Number, default: 10 },
      pointsToSpend: { type: Number, default: 0 },
    },
    task: {
      isPending: {
        type: Boolean,
        default: false,
      },
      task: {
        id: { type: String },
        name: { type: String },
        description: { type: String },
      },
      startAt: {
        type: Date,
      },
      endAt: {
        type: Date,
      },
      reward: {
        exp: { type: Number },
        money: { type: Number },
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = { User };
