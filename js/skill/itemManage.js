const { findItem } = require('../utils/inventory')
const { resolveEntity } = require('../utils/entity')
const { goals } = require('mineflayer-pathfinder')

/**
 * 物品管理技能 - 与感知层解耦版本
 * AI 负责：通过感知层获取物品信息 → 构造参数
 * skill 负责：接收参数 → 执行丢弃/拾取
 */
async function itemManage(bot, options = {}) {
  const { mode } = options
  if (!mode) return { success: false, error: '未指定 mode (drop / pickup)' }

  switch (mode) {
    case 'drop':    return handleDrop(bot, options)
    case 'pickup':  return handlePickup(bot, options)
    default:        return { success: false, error: `未知模式: ${mode}` }
  }
}

// ===== 丢弃背包物品 =====

async function handleDrop(bot, options) {
  const { item: itemName, count = 64 } = options
  if (!itemName) return { success: false, error: '未指定要丢弃的物品，请通过感知层获取物品名后传入' }

  // 计算该物品在背包中的总数（跨所有组）
  const allItems = bot.inventory.items()
  const matched = allItems.filter(i => i.name === itemName || i.name.includes(itemName))
  if (matched.length === 0) return { success: false, error: `背包中没有: ${itemName}` }

  const total = matched.reduce((sum, i) => sum + i.count, 0)
  const tossCount = Math.min(count, total)
  try {
    await bot.toss(matched[0].type, null, tossCount)
    return { success: true, count: tossCount, item: itemName }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// ===== 拾取地上掉落物 =====

async function handlePickup(bot, options) {
  const { targetEntity, item: itemName } = options

  // 解耦后：AI 负责通过感知层找到掉落物并传入 entity
  if (!targetEntity) {
    return { success: false, error: '未指定目标掉落物，请通过感知层获取 entity 后传入' }
  }

  // 使用 resolveEntity 解析（支持 ID / 名称 / 实体对象）
  const entity = resolveEntity(bot, targetEntity)
  if (!entity || entity.type !== 'object' || entity.name !== 'item') {
    return { success: false, error: '目标不是有效的掉落物实体' }
  }

  const { GoalNear } = goals
  await bot.pathfinder.goto(new GoalNear(
    entity.position.x,
    entity.position.y,
    entity.position.z,
    2
  ))

  return { success: true, item: itemName || 'any' }
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
itemManage.metadata = {
  name: 'itemManage',
  description: '管理背包物品，支持丢弃和拾取。AI负责通过感知层获取物品信息并传入参数。',
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['drop', 'pickup'],
        description: '操作模式：drop=丢弃, pickup=拾取'
      },
      item: {
        type: 'string',
        description: '物品名称（由AI通过perception获取后传入）'
      },
      targetEntity: {
        type: 'object',
        description: '目标掉落物实体（由AI通过perception.getNearbyEntities({name:"item"})获取后传入）'
      },
      count: {
        type: 'number',
        description: '丢弃数量',
        default: 64
      }
    },
    required: ['mode']
  }
}

module.exports = itemManage
