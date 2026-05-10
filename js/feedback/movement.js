const Vec3 = require('vec3')

function createMoveMonitor(bot, target) {
  return new Promise((resolve) => {

    const targetPos = new Vec3(target.x, target.y, target.z)
    let finished = false

    // ===== 成功1：pathfinder判定 =====
    function onGoalReached() {
      if (!finished) {
        finished = true
        cleanup()
        resolve('success')
        bot.chat("我已到达")
      }
    }

    bot.once('goal_reached', onGoalReached)

    // ===== 成功2：距离兜底 =====
    const checkInterval = setInterval(() => {
      const dist = bot.entity.position.distanceTo(targetPos)

      if (dist < 1.5 && !finished) {
        finished = true
        cleanup()
        resolve('success')
        bot.chat("我已到达")
      }
    }, 300)

    // ===== 路径失败 =====
    function onPathUpdate(r) {
      if (r.status === 'noPath' && !finished) {
        finished = true
        cleanup()
        resolve('failed')
      }
    }

    bot.on('path_update', onPathUpdate)

    // ===== 超时 =====
    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true
        cleanup()
        resolve('timeout')
      }
    }, 10000)

    function cleanup() {
      clearInterval(checkInterval)
      clearTimeout(timeout)
      bot.removeListener('path_update', onPathUpdate)
      bot.removeListener('goal_reached', onGoalReached)
    }
  })
}

module.exports = { createMoveMonitor }