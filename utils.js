const healthFormula = (
  brainHealth,
  level,
  multipler = 1
) => {
  return Math.round(
    level * 2 + brainHealth * multipler * 10
  );
};

const dmgFormula = (logic, level, multipler = 1) => {
  return {
    min: Math.round(logic * multipler + level),
    max: Math.round(level * 2 + logic * multipler * 2),
  };
};

module.exports = { healthFormula, dmgFormula };
