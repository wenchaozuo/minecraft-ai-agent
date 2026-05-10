const { GoalNear } = require('mineflayer-pathfinder').goals

/**
 * 拾取附近掉落物
 * 挖方块/击杀生物后，掉落物可能离 bot 较远，需要移动过去才能拾取
 * @param {Bot} bot - mineflayer bot 实例
 * @param {number} [maxDist=3] - 超过此距离才移动过去，否则依赖 Minecraft 自动拾取
 */
async function pickupNearbyItems(bot, maxDist = 3) {
  // 等待掉落物生成
  await new Promise(r => setTimeout(r, 300));

  // 检查附近是否有掉落物
  const item = bot.nearestEntity(e => e.name === 'item');
  if (!item) return;

  const dist = bot.entity.position.distanceTo(item.position);
  // 如果掉落物在 maxDist 格内，Minecraft 会自动拾取；否则需要移动过去
  if (dist > maxDist) {
    try {
      await bot.pathfinder.goto(new GoalNear(item.position.x, item.position.y, item.position.z, 1));
      await new Promise(r => setTimeout(r, 1000)); // 等待自动拾取
    } catch (err) {
      // 移动失败，忽略
    }
  }
}

module.exports = { pickupNearbyItems }
