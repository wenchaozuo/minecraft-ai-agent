function setupAutoRespawn(bot) {
  bot.on('death', () => {
    console.log('[反馈] Bot 死亡，准备复活...')

    setTimeout(() => {
      try {
        bot.respawn()
        console.log('[反馈] 已复活')
      } catch (err) {
        console.log('[错误] 复活失败:', err)
      }
    }, 1000) // 延迟更稳定
  })
}

module.exports = { setupAutoRespawn }