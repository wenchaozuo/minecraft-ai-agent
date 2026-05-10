const { Vec3 } = require('vec3')

function findReferenceBlock(bot, targetPos) {
  const directions = [
    new Vec3(1, 0, 0),
    new Vec3(-1, 0, 0),
    new Vec3(0, 1, 0),
    new Vec3(0, -1, 0),
    new Vec3(0, 0, 1),
    new Vec3(0, 0, -1)
  ]

  for (const dir of directions) {
    const neighborPos = targetPos.plus(dir)
    const block = bot.blockAt(neighborPos)

    if (block && block.boundingBox === 'block') {
      return {
        referenceBlock: block,
        faceVector: new Vec3(-dir.x, -dir.y, -dir.z)
      }
    }
  }

  return null
}

/** 根据玩家位置与目标方块，计算点击的面 (0-5) */
function getFaceFromPosition(eyePos, blockPos) {
  const dx = eyePos.x - (blockPos.x + 0.5)
  const dy = eyePos.y - (blockPos.y + 0.5)
  const dz = eyePos.z - (blockPos.z + 0.5)
  const ax = Math.abs(dx), ay = Math.abs(dy), az = Math.abs(dz)
  if (ax >= ay && ax >= az) return dx > 0 ? 5 : 4  // east / west
  if (ay >= ax && ay >= az) return dy > 0 ? 1 : 0  // top / bottom
  return dz > 0 ? 3 : 2                             // south / north
}

module.exports = {
  findReferenceBlock,
  getFaceFromPosition
}