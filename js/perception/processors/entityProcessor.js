/**
 * 实体分类表 - 按行为对实体分组
 * 用于在感知层为每个实体标注语义类别，方便决策层快速筛选
 *
 * hostile:    敌对生物，会主动攻击 bot（僵尸、骷髅、苦力怕等）
 * friendly:   友好生物，可被击杀获取资源或驯服（村民、动物等）
 * player:     玩家实体
 * item:       掉落物（被击杀的生物掉落的物品、玩家丢弃的物品等）
 * projectile: 弹射物（箭、雪球、鸡蛋、火焰弹等）
 * vehicle:    载具（船、矿车等）
 * other:      未归入以上类别的实体（通过 classifyEntity 返回）
 */
const ENTITY_CATEGORIES = {
  hostile: [
    // 亡灵系
    'zombie', 'skeleton', 'stray', 'wither_skeleton', 'drowned',
    'zombie_pigman', 'zombified_piglin', 'husk', 'phantom',
    // 爆炸/爬行系
    'creeper', 'spider', 'cave_spider', 'enderman', 'witch',
    'slime', 'magma_cube',
    // 下界系
    'ghast', 'blaze', 'piglin', 'piglin_brute', 'hoglin', 'zoglin', 'strider',
    // 灾厄村民系
    'pillager', 'ravager', 'vex', 'evoker', 'vindicator', 'illusioner',
    // 末地系
    'shulker', 'endermite', 'guardian', 'elder_guardian',
    // 其他
    'silverfish', 'warden'
  ],
  friendly: [
    // NPC
    'villager', 'wandering_trader',
    // 被动动物（提供食物/材料）
    'cow', 'sheep', 'pig', 'chicken', 'rabbit', 'fox', 'wolf', 'cat',
    'horse', 'donkey', 'mule', 'llama', 'trader_llama', 'panda', 'turtle',
    'bee', 'parrot', 'bat', 'squid', 'glow_squid', 'axolotl',
    'mooshroom', 'goat', 'frog', 'tadpole', 'camel', 'sniffer'
  ],
  player: ['player'],
  item: ['item'],
  projectile: [
    'arrow', 'spectral_arrow', 'tipped_arrow',
    'snowball', 'egg', 'fireball', 'small_fireball',
    'firework_rocket', 'trident', 'fishing_bobber'
  ],
  vehicle: [
    'boat', 'minecart', 'chest_minecart', 'furnace_minecart',
    'tnt_minecart', 'hopper_minecart'
  ]
}

/**
 * 判断实体属于哪个类别
 * 优先按实体类型（type）快速分流，再按名称匹配分类表
 *
 * @param {string} entityName - 实体内部名称（如 'zombie'、'player'、'cow'）
 * @param {string} entityType - 实体类型（'player' / 'mob' / 'object'）
 * @returns {string} 类别名称：'hostile' | 'friendly' | 'player' | 'item' | 'projectile' | 'vehicle' | 'other'
 */
function classifyEntity(entityName, entityType) {
  // 按类型快速判断（不需要查表）
  if (entityType === 'player') return 'player'
  if (entityType === 'object' && entityName === 'item') return 'item'
  if (entityType === 'object') return 'vehicle'

  // 按名称匹配分类表
  for (const [category, names] of Object.entries(ENTITY_CATEGORIES)) {
    if (names.includes(entityName)) return category
  }
  return 'other'  // 未匹配到任何分类时返回 'other'
}

/**
 * 过滤实体数组
 * 根据过滤条件筛选实体，支持按类别、类型、名称、距离过滤
 *
 * @param {Array} entities - 已分类的实体数组（需包含 category、type、name、distance 字段）
 * @param {Object} filter - 过滤条件
 * @param {string} [filter.category] - 按类别过滤（如 'hostile'、'friendly'）
 * @param {string} [filter.type] - 按实体类型过滤（如 'mob'、'object'）
 * @param {string} [filter.name] - 按实体名称精确匹配（如 'zombie'）
 * @param {number} [filter.maxDistance] - 最大距离过滤，只保留距离 <= maxDistance 的实体
 * @returns {Array} 过滤后的实体数组（不改变原数组）
 */
function filterEntities(entities, filter = {}) {
  let result = [...entities]  // 浅拷贝，避免修改原数组

  if (filter.category) {
    result = result.filter(e => e.category === filter.category)
  }
  if (filter.type) {
    result = result.filter(e => e.type === filter.type)
  }
  if (filter.name) {
    result = result.filter(e => e.name === filter.name)
  }
  if (filter.maxDistance !== undefined) {
    result = result.filter(e => e.distance <= filter.maxDistance)
  }

  return result
}

/**
 * 处理原始实体数据（主函数）
 * 1. 为每个实体添加 category 字段（调用 classifyEntity）
 * 2. 应用过滤条件，返回筛选后的结果
 *
 * @param {Array} rawEntities - collectEntities() 返回的原始实体数组
 *                              每个元素包含: { id, name, type, position, distance, health, maxHealth }
 * @param {Object} filter - 过滤条件（同 filterEntities 的 filter 参数）
 * @param {string} [filter.category] - 按类别过滤
 * @param {string} [filter.type] - 按类型过滤
 * @param {string} [filter.name] - 按名称过滤
 * @param {number} [filter.maxDistance] - 最大距离过滤
 * @returns {Array} 处理后的实体数组，每个元素新增字段:
 *   - category: 实体类别（'hostile' | 'friendly' | 'player' | 'item' | 'projectile' | 'vehicle' | 'other'）
 */
function processEntities(rawEntities, filter = {}) {
  // 为每个实体添加分类信息
  let entities = rawEntities.map(e => ({
    ...e,
    category: classifyEntity(e.name, e.type)  // 新增 category 字段
  }))

  // 应用过滤条件
  return filterEntities(entities, filter)
}

module.exports = { processEntities, classifyEntity, filterEntities, ENTITY_CATEGORIES }
