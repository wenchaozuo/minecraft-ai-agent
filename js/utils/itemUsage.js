/** 轮询等待 bot.isUsingItem 变为 false */
function waitForItemConsume(bot, timeout = 10000) {
  return new Promise((resolve) => {
    const start = Date.now()
    const check = () => {
      if (!bot.isUsingItem) return resolve(true)
      if (Date.now() - start > timeout) {
        bot.clearItem()
        return resolve(false)
      }
      setTimeout(check, 50)
    }
    check()
  })
}

/** 等待 mineflayer 原生的 consume 事件（药水等） */
function waitForConsumeEvent(bot, timeout = 10000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeout)
    bot.once('consume', () => {
      clearTimeout(timer)
      resolve(true)
    })
  })
}

module.exports = {
  waitForItemConsume,
  waitForConsumeEvent
}
