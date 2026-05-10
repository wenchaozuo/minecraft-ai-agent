
// ===== 工具函数：等待到达 =====

function waitForReach(bot, pos) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const dist = bot.entity.position.distanceTo(pos)
      if (dist < 3) {
        clearInterval(interval)
        resolve()
      }
    }, 200)
  })
}

module.exports ={waitForReach}