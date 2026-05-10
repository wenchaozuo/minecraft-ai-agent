/**
 * 扫描 bot 附近的实体，返回原始数据（不做分类处理）
 * @param {Bot} bot - mineflayer bot 实例
 * @param {number} radius - 扫描半径，默认 30
 * @returns {Array} 实体原始数据数组
 */
function collectEntities(bot, radius = 64) {
  const entities = []
  const pos = bot.entity.position

  for (const id in bot.entities) {
    const entity = bot.entities[id]

    // 跳过自己
    if (entity === bot.entity) continue

    const dx = entity.position.x - pos.x
    const dy = entity.position.y - pos.y
    const dz = entity.position.z - pos.z
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // 只保留半径内的实体
    if (distance > radius) continue

    entities.push({
      id: entity.id,                        // 实体唯一 ID（服务器分配）
      name: entity.name,                     // 实体内部名称 (zombie/player/cow等)
      type: entity.type,                     // 实体类型 (player/mob/object)
      position: entity.position,             // 实体坐标（Vec3 对象）
      distance: Math.round(distance * 100) / 100,  // 距离 bot 的距离（保留2位小数）
      health: entity.health || null,         // 当前血量（部分实体无血量）
      maxHealth: entity.maxHealth || null    // 最大血量
    })
  }

  return entities
}

module.exports = { collectEntities }
