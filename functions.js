const jwt = require('jsonwebtoken');
const { healthFormula, dmgFormula } = require('./utils');
const { User } = require('./models/User');

const getIdFromHeader = (header) => {
  const token = header['authorization'].split(' ')[1];
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

const battleFunction = async (defender, attacker) => {
  let playerHealth = healthFormula(
    defender.stats.brainHealth,
    defender.stats.level
  );

  let enemyHealth = healthFormula(
    attacker.stats.brainHealth,
    defender.stats.level,
    attacker.stats.multipler
  );

  const turns = [
    {
      id: 'start',
      playerHealth,
      enemyHealth,
      move: null,
      dmg: null,
    },
  ];

  let turnCounter = 1;
  let whosTurn = 'player';
  const baseChance = 50;

  while (playerHealth > 0 && enemyHealth > 0) {
    let attackDmg = 0;
    let crit = false;

    if (whosTurn === 'player') {
      const attackChance =
        baseChance +
        (defender.stats.logic -
          attacker.stats.stressResistance *
            attacker.stats.multipler) *
          10;

      const attackSuccess =
        Math.round(Math.random() * 101) <= attackChance;

      if (attackSuccess) {
        const dmg = dmgFormula(
          defender.stats.logic,
          defender.stats.level
        );

        crit =
          Math.round(Math.random() * 100) + 1 <=
          defender.stats.luck;

        if (crit) {
          attackDmg =
            Math.round(
              Math.random() * (dmg.max - dmg.min + 1) +
                dmg.min
            ) * 2;
        } else {
          attackDmg = Math.round(
            Math.random() * (dmg.max - dmg.min + 1) +
              dmg.min
          );
        }
      }
      enemyHealth = enemyHealth - attackDmg;

      turns.push({
        id: turnCounter,
        playerHealth,
        enemyHealth,
        move: 'player',
        dmg: attackDmg,
        critic: crit,
      });

      whosTurn = 'enemy';
    } else {
      const attackChance =
        baseChance +
        (attacker.stats.logic * attacker.stats.multipler -
          defender.stats.stressResistance) *
          10;

      const attackSuccess =
        Math.round(Math.random() * 101) <= attackChance;

      if (attackSuccess) {
        const dmg = dmgFormula(
          attacker.stats.logic,
          defender.stats.level
        );
        crit =
          Math.round(Math.random() * 100) + 1 <=
          defender.stats.luck;

        if (crit) {
          attackDmg =
            Math.round(
              Math.random() * (dmg.max - dmg.min + 1) +
                dmg.min
            ) * 2;
        } else {
          attackDmg = Math.round(
            Math.random() * (dmg.max - dmg.min + 1) +
              dmg.min
          );
        }
      }
      playerHealth = playerHealth - attackDmg;

      turns.push({
        id: turnCounter,
        playerHealth,
        enemyHealth,
        move: 'enemy',
        dmg: attackDmg,
        critic: crit,
      });

      whosTurn = 'player';
    }
    turnCounter++;
  }

  turns.push({
    id: 'end',
    playerHealth,
    enemyHealth,
    move: playerHealth < 1 ? 'enemy wins' : 'player wins',
    dmg: null,
  });

  return turns;
};

const reset = async () => {
  const res = await User.updateMany(
    {},
    { $set: { stats: { energy: 100 } } }
  );
};

const pingDB = async () => {
  const user = await User.findById(
    '65f734682d3e3d8c1abb8419'
  ).select('username');

  console.log(`Ping - ${new Date()} ${user.username}`);
};

module.exports = {
  getIdFromHeader,
  battleFunction,
  reset,
  pingDB,
};
