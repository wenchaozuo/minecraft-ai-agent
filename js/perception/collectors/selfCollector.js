/**
 * 采集 bot 自身状态，返回原始数据
 * @param {Bot} bot - mineflayer bot 实例
 * @returns {Object} 自身状态对象
 */
function collectSelf(bot) {
  const entity = bot.entity

  // 背包物品
  const inventory = bot.inventory.items().map(item => ({
    name: item.name,      // 物品内部名称
    count: item.count,    // 数量
    slot: item.slot       // 背包槽位编号
  }))

  // 盔甲栏
  const armorSlots = bot.armorItems()
  const armor = [
    { slot: 'head', ...formatArmorItem(armorSlots[0]) },   // 头盔
    { slot: 'torso', ...formatArmorItem(armorSlots[1]) },  // 胸甲
    { slot: 'legs', ...formatArmorItem(armorSlots[2]) },   // 护腿
    { slot: 'feet', ...formatArmorItem(armorSlots[3]) }    // 靴子
  ]

  return {
    position: {
      x: Math.round(entity.position.x * 100) / 100,   // x 坐标（保留2位小数）
      y: Math.round(entity.position.y * 100) / 100,   // y 坐标
      z: Math.round(entity.position.z * 100) / 100    // z 坐标
    },
    velocity: {
      x: entity.velocity.x,   // x 轴速度
      y: entity.velocity.y,   // y 轴速度（跳跃/下落）
      z: entity.velocity.z    // z 轴速度
    },
    health: bot.health,           // 当前血量 (0-20)
    food: bot.food,               // 饥饿值 (0-20)
    saturation: bot.foodSaturation, // 饱和度（饥饿值下方的鸡腿）
    experience: {
      level: bot.experience.level,   // 经验等级
      points: bot.experience.points  // 当前等级经验值
    },
    inventory,                     // 背包物品列表
    heldItem: bot.heldItem ? {     // 当前手持物品（null 表示空手）
      name: bot.heldItem.name,
      count: bot.heldItem.count
    } : null,
    armor,                         // 盔甲栏状态
    isInWater: bot.isInWater,      // 是否在水里
    isOnGround: bot.isOnGround,    // 是否在地面上
    isInWeb: bot.isInWeb,          // 是否在蜘蛛网中
    gameMode: bot.game.gameMode    // 游戏模式 (survival/creative/adventure/spectator)
  }
}

function formatArmorItem(item) {
  if (!item || !item.name) {
    return { name: 'empty', slot: null }   // 槽位为空
  }
  return {
    name: item.name,   // 盔甲内部名称
    count: item.count, // 数量（通常为1）
    slot: item.slot    // 槽位编号
  }
}

module.exports = { collectSelf }
