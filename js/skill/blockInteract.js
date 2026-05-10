const { findItem } = require('../utils/inventory')
const { ensureVec3 } = require('../utils/vec3')
const { goals } = require('mineflayer-pathfinder')

/**
 * 方块交互技能 - 与感知层解耦版本
 * AI 负责：通过感知层获取容器/工作台等 → 传入参数
 * skill 负责：接收参数 → 执行交互（制作/熔炼/存取）
 */
async function blockInteract(bot, options = {}) {
  const { mode } = options
  if (!mode) return { success: false, error: '未指定 mode' }

  switch (mode) {
    case 'craft':     return handleCraft(bot, options)
    case 'smelt':     return handleSmelt(bot, options)
    case 'store':     return handleStore(bot, options)
    case 'withdraw':  return handleWithdraw(bot, options)
    default:          return { success: false, error: `未知模式: ${mode}` }
  }
}

// ===== 制作物品 =====

async function handleCraft(bot, options) {
  const { item: itemName, count = 1, position } = options
  if (!itemName) return { success: false, error: '未指定要制作的物品，请AI通过感知层获取物品名后传入' }
  if (!position) return { success: false, error: '未指定工作台位置，请AI通过感知层找到工作台后传入坐标' }

  // 查物品 ID，然后获取配方（用 recipesAll 避免被背包材料过滤干扰）
  const itemEntry = bot.registry?.itemsByName?.[itemName] ||
    Object.values(bot.registry?.items ?? {}).find(i => i.name === itemName)
  const itemId = itemEntry?.id
  if (!itemId) return { success: false, error: `未知物品: ${itemName}` }

  const recipes = bot.recipesAll(itemId, null, true)
  if (!recipes || recipes.length === 0) {
    return { success: false, error: `不知道如何制作: ${itemName}` }
  }

  // 遍历所有配方，选第一个材料足够的
  let chosen = null
  let lastMissing = []
  for (const r of recipes) {
    const missing = checkIngredients(bot, r, count)
    if (missing.length === 0) {
      chosen = r
      break
    }
    lastMissing = missing
  }
  if (!chosen) {
    const detail = lastMissing.map(m =>
      `${m.name} 缺 ${m.shortfall} 个 (有 ${m.has}，需要 ${m.needs})`
    ).join('；')
    return { success: false, error: `材料不足: ${detail}` }
  }

  // AI 负责传入工作台位置，skill 不再自己找
  const tablePos = ensureVec3(position)
  if (!tablePos) return { success: false, error: '工作台坐标非法' }

  const table = bot.blockAt(tablePos)
  if (!table || table.name !== 'crafting_table') {
    return { success: false, error: '指定位置不是工作台' }
  }

  try {
    await bot.craft(chosen, count, table)
    return { success: true, item: itemName, count }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

function checkIngredients(bot, recipe, craftCount) {
  // recipe.delta 中负值 = 消耗的材料，正值 = 产出的物品
  const delta = recipe.delta || []
  const result = []

  for (const d of delta) {
    if (d.count >= 0) continue // 跳过产出（结果物品、outShape）
    const needCount = Math.abs(d.count) * craftCount
    const name = bot.registry?.items?.[d.id]?.name
    if (!name) continue

    const have = bot.inventory.count(d.id, d.metadata)

    if (have < needCount) {
      result.push({ name, has: have, needs: needCount, shortfall: needCount - have })
    }
  }

  return result
}

// ===== 熔炉烧炼 =====

async function handleSmelt(bot, options) {
  const { input, fuel, position } = options
  if (!input) return { success: false, error: '未指定要烧炼的物品，请AI通过感知层获取物品名后传入' }
  if (!fuel) return { success: false, error: '未指定燃料，请AI通过感知层获取物品名后传入' }
  if (!position) return { success: false, error: '未指定熔炉位置，请AI通过感知层找到熔炉后传入坐标' }

  // AI 负责传入熔炉位置，skill 不再自己找
  const furnacePos = ensureVec3(position)
  if (!furnacePos) return { success: false, error: '熔炉坐标非法' }

  const furnaceBlock = bot.blockAt(furnacePos)
  if (!furnaceBlock || !['furnace', 'blast_furnace', 'smoker'].includes(furnaceBlock.name)) {
    return { success: false, error: '指定位置不是熔炉' }
  }

  const dist = bot.entity.position.distanceTo(furnaceBlock.position)
  if (dist > 4) {
    await bot.pathfinder.goto(new goals.GoalNear(
      furnaceBlock.position.x, furnaceBlock.position.y, furnaceBlock.position.z, 3
    ))
  }

  const furnace = await bot.openFurnace(furnaceBlock)

  try {
    const inputItem = findItem(bot, { name: input })
    if (!inputItem) { furnace.close(); return { success: false, error: `背包中没有: ${input}` } }
    await furnace.putInput(inputItem.type, null, 64)

    const fuelItem = findItem(bot, { name: fuel })
    if (!fuelItem) { furnace.close(); return { success: false, error: `背包中没有燃料: ${fuel}` } }
    await furnace.putFuel(fuelItem.type, null, 64)

    furnace.close()
    return { success: true, input, fuel }
  } catch (err) {
    furnace.close()
    return { success: false, error: err.message }
  }
}

// ===== 存入容器 =====

async function handleStore(bot, options) {
  const { item: itemName, count = 64, position } = options
  if (!itemName) return { success: false, error: '未指定要存放的物品，请AI通过感知层获取物品名后传入' }

  // AI 负责传入容器位置，skill 不再自己找
  if (!position) return { success: false, error: '未指定容器位置，请AI通过感知层找到容器后传入坐标' }

  const container = await findAndOpenContainer(bot, position)
  if (!container) return { success: false, error: '指定的位置没有可用的容器' }

  try {
    const item = findItem(bot, { name: itemName })
    if (!item) { container.close(); return { success: false, error: `背包中没有: ${itemName}` } }

    const storeCount = Math.min(count, item.count)
    await container.deposit(item.type, null, storeCount)
    container.close()
    return { success: true, item: itemName, count: storeCount }
  } catch (err) {
    container.close()
    return { success: false, error: err.message }
  }
}

// ===== 取出容器 =====

async function handleWithdraw(bot, options) {
  const { item: itemName, count = 1, position } = options
  if (!itemName) return { success: false, error: '未指定要取出的物品，请AI通过感知层获取物品名后传入' }
  if (!position) return { success: false, error: '未指定容器位置，请AI通过感知层找到容器后传入坐标' }

  const container = await findAndOpenContainer(bot, position)
  if (!container) return { success: false, error: '指定的位置没有可用的容器' }

  try {
    const itemId = bot.registry.itemsByName[itemName]?.id
    if (!itemId) { container.close(); return { success: false, error: `未知物品: ${itemName}` } }

    await container.withdraw(itemId, null, count)
    container.close()
    return { success: true, item: itemName, count }
  } catch (err) {
    container.close()
    return { success: false, error: err.message }
  }
}

// ===== 通用：找到容器并打开 =====

async function findAndOpenContainer(bot, position) {
  const pos = position.x !== undefined ? position : null
  if (!pos) return null

  const containerBlock = bot.blockAt(pos)
  if (!containerBlock || !['chest', 'trapped_chest', 'barrel', 'shulker_box'].includes(containerBlock.name)) {
    return null
  }

  const dist = bot.entity.position.distanceTo(containerBlock.position)
  if (dist > 4) {
    try {
      await bot.pathfinder.goto(new goals.GoalNear(
        containerBlock.position.x,
        containerBlock.position.y,
        containerBlock.position.z,
        3
      ))
    } catch (e) {
      return null
    }
  }

  return await bot.openChest(containerBlock)
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
blockInteract.metadata = {
  name: 'blockInteract',
  description: '方块交互（制作/熔炼/存取容器）。AI负责通过感知层获取工作台/熔炉/容器信息并传入参数。',
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['craft', 'smelt', 'store', 'withdraw'],
        description: '交互模式'
      },
      item: {
        type: 'string',
        description: '物品名称（制作/烧炼/存取的目标物品）'
      },
      input: {
        type: 'string',
        description: '熔炼模式：输入物品名'
      },
      fuel: {
        type: 'string',
        description: '熔炼模式：燃料物品名'
      },
      count: {
        type: 'number',
        description: '数量',
        default: 1
      },
      position: {
        type: 'object',
        description: '坐标（craft=工作台, smelt=熔炉, store/withdraw=容器，由AI通过感知层获取后传入）',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        }
      }
    },
    required: ['mode']
  }
}

module.exports = blockInteract
