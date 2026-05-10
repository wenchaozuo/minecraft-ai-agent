/**
 * 解析目标实体：支持名字、ID、实体对象
 * 解耦后，此方法只做解析，不扫描实体（扫描由感知层负责）
 * @param {Bot} bot - mineflayer bot 实例
 * @param {string|number|Object} target - 目标（玩家名/生物名/实体ID/实体对象）
 * @returns {Object|null} 实体对象或 null
 */
function resolveEntity(bot, target) {
  if (!target) return null;

  // 数字 → 实体 ID
  if (typeof target === 'number') {
    return bot.entityAt(target) || bot.nearestEntity(e => e.id === target) || null;
  }

  // 字符串 → 玩家名 / 生物名
  if (typeof target === 'string') {
    if (bot.players[target] && bot.players[target].entity) {
      return bot.players[target].entity;
    }
    return bot.nearestEntity(e => e.name === target || e.username === target) || null;
  }

  // 实体对象 → 直接返回
  if (target.id !== undefined || target.entityId !== undefined) {
    return target;
  }

  return null;
}

module.exports = { resolveEntity };
