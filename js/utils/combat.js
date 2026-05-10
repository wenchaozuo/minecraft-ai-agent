const { findItem } = require('./inventory')
const { GoalNear } = require('mineflayer-pathfinder').goals

// ===== 武器优先级 =====

const MELEE_WEAPONS = [
  'netherite_sword', 'diamond_sword', 'iron_sword', 'stone_sword', 'wooden_sword',
  'netherite_axe', 'diamond_axe', 'iron_axe', 'stone_axe', 'wooden_axe'
]

const FOOD_PRIORITY = [
  'golden_apple', 'enchanted_golden_apple',
  'cooked_beef', 'cooked_porkchop', 'cooked_mutton', 'cooked_cod', 'cooked_salmon',
  'apple', 'bread', 'cooked_chicken', 'baked_potato', 'pumpkin_pie',
  'carrot', 'beetroot', 'dried_kelp'
]

// ===== 武器 =====

/** 装备最好的近战武器或远程武器，返回是否成功 */
async function equipBestWeapon(bot, mode = 'melee') {
  if (mode === 'ranged') {
    const item = findItem(bot, { keywords: ['bow', 'crossbow', 'trident'] })
    if (!item) return false
    try { await bot.equip(item, 'hand'); return true } catch (e) { return false }
  }

  for (const name of MELEE_WEAPONS) {
    const item = findItem(bot, { name })
    if (!item) continue
    try { await bot.equip(item, 'hand'); return true } catch (e) { continue }
  }
  return false
}

/** 判断物品名是否为近战武器 */
function isWeapon(name) {
  return name ? MELEE_WEAPONS.some(w => name.includes(w)) : false
}

// ===== 自我保护 =====

/** 尝试吃食物补血，返回是否吃成功 */
async function tryEat(bot) {
  if (bot.food >= 20) return false
  const food = findItem(bot, { keywords: FOOD_PRIORITY })
  if (!food) return false

  try {
    if (bot.pvp) bot.pvp.stop()
    if (bot.pathfinder) bot.pathfinder.setGoal(null)
    await bot.equip(food, 'hand')
    await bot.consume()
    return true
  } catch (e) {
    return false
  }
}

/** 朝反方向撤退一段距离 */
async function retreat(bot) {
  stopCombat(bot)
  const yaw = bot.entity.yaw
  const pos = bot.entity.position
  try {
    await bot.pathfinder.goto(new GoalNear(
      pos.x - Math.sin(yaw) * 15,
      pos.y,
      pos.z - Math.cos(yaw) * 15,
      3
    ))
  } catch (e) { /* 跑不掉就算了 */ }
}

/** 停止所有战斗相关状态 */
function stopCombat(bot) {
  if (bot.pathfinder) bot.pathfinder.setGoal(null)
  if (bot.pvp) bot.pvp.stop()
  if (bot.isUsingItem) bot.deactivateItem()
  bot.clearControlStates()
}

module.exports = {
  equipBestWeapon,
  isWeapon,
  tryEat,
  retreat,
  stopCombat
}
