const { Vec3 } = require('vec3')

/** 确保返回 Vec3 实例（兼容 {x,y,z} 对象） */
function ensureVec3(position) {
  if (!position) return null
  if (position instanceof Vec3) return position
  if (typeof position.x === 'number' && typeof position.y === 'number' && typeof position.z === 'number') {
    return new Vec3(position.x, position.y, position.z)
  }
  return null
}

module.exports = { ensureVec3 }
