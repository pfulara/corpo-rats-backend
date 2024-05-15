const express = require('express');
const { Task } = require('../models/Task');
const {
  getIdFromHeader,
  battleFunction,
} = require('../functions');
const { User } = require('../models/User');
const { Encounter } = require('../models/Encounter');

const tasks = express.Router();

const encounterList = [
  { name: 'Pani Anetka z HRów', stats: { multipler: 0.8 } },
];

tasks.post('/get-tasks-list', async (req, res) => {
  try {
    const tasks = await Task.aggregate([
      {
        $match: {
          $or: [
            {
              energy: {
                $lt: req.body.energy,
              },
            },
            {
              energy: {
                $eq: req.body.energy,
              },
            },
          ],
        },
      },
      { $sample: { size: 3 } },
    ]);
    res.json({ tasks, error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

tasks.post('/start-task', async (req, res) => {
  try {
    const id = getIdFromHeader(req.headers);

    const task = await Task.findById(req.body.taskId);

    if (task) {
      const date = new Date();
      const startedTask = {
        isPending: true,
        task: {
          id: task._id,
          name: task.name,
          description: task.description,
        },
        reward: task.reward,
        startAt: date,
        endAt: new Date(
          date.getTime() + task.energy * 60000
        ),
      };
      const user = await User.findById(id);
      if (user) {
        if (user.stats.energy < task.energy) {
          return res.json({ error: 'Not enough energy' });
        }
        user.task = startedTask;
        user.stats.energy = user.stats.energy - task.energy;
        await user.save();
      }
      return res.json({ error: null });
    }
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

tasks.post('/finish-task', async (req, res) => {
  try {
    const task = await Task.findById(
      req.body.taskId
    ).populate('encounters');

    if (task) {
      const id = getIdFromHeader(req.headers);

      const user = await User.findById(id).select(
        'username stats avatar'
      );
      if (user) {
        user.task = { isPending: false };
        const eCount = task.encounters.length;
        const encounter =
          task.encounters[
            Math.floor(Math.random() * eCount)
          ];
        const battle = await battleFunction(
          user,
          encounter
        );

        const lastTurn = battle.find(
          (turn) => turn.id === 'end'
        );

        if (lastTurn.move === 'player wins') {
          const exp = Math.round(
            (task.reward.exp * encounter.stats.multipler +
              user.stats.level * 10) /
              (user.stats.level *
                (encounter.stats.multipler / 2))
          );

          const money = Math.round(
            (task.reward.money * encounter.stats.multipler +
              user.stats.level * 10) /
              (user.stats.level * encounter.stats.multipler)
          );

          if (
            user.stats.exp.current + exp >
            user.stats.exp.goal
          ) {
            user.stats.level++;
            user.stats.pointsToSpend = 5;
            user.stats.exp.current = 0;
            user.stats.exp.goal =
              user.stats.exp.goal * user.stats.level;
          } else {
            user.stats.exp.current =
              user.stats.exp.current + exp;
          }
        }

        await user.save();

        return res.json({
          battle: {
            player: user,
            enemy: encounter,
            turns: battle,
          },
          error: null,
        });
      }
    }

    return res.json({ error: null });
  } catch {
    return res.json({ error: 'Server Error' });
  }
});

module.exports = tasks;
