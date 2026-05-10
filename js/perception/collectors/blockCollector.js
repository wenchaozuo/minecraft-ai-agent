const Vec3 = require('vec3')

/**
 * 扫描 bot 附近的方块，返回原始数据（不做分类处理）
 * @param {Bot} bot - mineflayer bot 实例
 * @param {number} radius - 水平扫描半径，默认 30
 * @returns {Array} 方块原始数据数组
 */
function collectBlocks(bot, radius = 30) {
  const blocks = []
  const pos = bot.entity.position                    // bot 当前坐标
  const verticalRadius = Math.floor(radius / 2)     // 垂直扫描半径，减半（天空/地底范围较小）

  for (let dx = -radius; dx <= radius; dx++) {      // x 轴偏移
    for (let dy = -verticalRadius; dy <= verticalRadius; dy++) {  // y 轴偏移
      for (let dz = -radius; dz <= radius; dz++) {  // z 轴偏移
        const x = Math.floor(pos.x + dx)            // 目标方块 x 坐标（取整）
        const y = Math.floor(pos.y + dy)            // 目标方块 y 坐标
        const z = Math.floor(pos.z + dz)            // 目标方块 z 坐标

        const block = bot.blockAt(new Vec3(x, y, z))  // 获取该坐标的方块对象
        if (!block || block.name === 'air') continue    // 跳过空气或无效方块

        blocks.push({
          name: block.name,                         // 方块内部名称 (oak_log/stone等)
          position: new Vec3(x, y, z),              // 方块坐标 Vec3 对象
          boundingBox: block.boundingBox             // 碰撞箱类型 ('block'/'empty')
        })
      }
    }
  }

  return blocks
}

module.exports = { collectBlocks }
