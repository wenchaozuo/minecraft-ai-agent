const Vec3 = require('vec3')

/**
 * 计算两点之间的欧几里得距离
 * 用于判断 bot 与方块/实体之间的距离
 *
 * @param {Object} pos1 - 第一个坐标 {x, y, z}
 * @param {Object} pos2 - 第二个坐标 {x, y, z}
 * @returns {number} 两点之间的直线距离
 */
function calcDistance(pos1, pos2) {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  const dz = pos2.z - pos1.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * 判断 bot 是否在危险方块附近
 * 检查指定半径内是否存在 dangerous 类别的方块（岩浆、水、仙人掌等）
 *
 * @param {Bot} bot - mineflayer bot 实例
 * @param {Array} blocks - 已分类的方块数组（需包含 category 和 position 字段）
 * @param {number} radius - 危险检测半径，默认 3
 * @returns {boolean} true 表示 bot 在危险方块附近
 */
function isInDanger(bot, blocks, radius = 3) {
  const pos = bot.entity.position

  return blocks.some(b => {
    const dist = calcDistance(pos, b.position)
    return dist <= radius && b.category === 'dangerous'
  })
}

/**
 * 在实体列表中找最近的实体
 * 可选按类别过滤，返回距离最近的实体
 *
 * @param {Array} entities - 实体数组（需包含 position 字段，可选 distance 字段）
 * @param {Object} pos - 参考坐标 {x, y, z}
 * @param {Object} filter - 过滤条件
 * @param {string} [filter.category] - 只查找特定类别的实体（如 'hostile'）
 * @returns {Object|null} 最近的实体对象（新增 _dist 字段表示距离），无结果返回 null
 */
function findNearest(entities, pos, filter = {}) {
  let filtered = entities

  if (filter.category) {
    filtered = filtered.filter(e => e.category === filter.category)
  }

  if (filtered.length === 0) return null

  let nearest = null
  let minDist = Infinity

  for (const entity of filtered) {
    // 优先使用已有的 distance 字段，否则实时计算
    const dist = entity.distance !== undefined
      ? entity.distance
      : calcDistance(pos, entity.position)
    if (dist < minDist) {
      minDist = dist
      nearest = { ...entity, _dist: dist }
    }
  }

  return nearest
}

module.exports = { calcDistance, isInDanger, findNearest }
