/**
 * 停止所有动作技能 - 与感知层解耦版本
 * AI 负责：在需要时调用此技能
 * skill 负责：停止所有正在进行的动作（寻路/攻击/挖掘/使用物品等）
 */
async function stopAll(bot) {

  // ===== 1. 停止寻路（move / follow） =====
  if (bot.pathfinder) {
    bot.pathfinder.setGoal(null)
  }

  // ===== 2. 停止PVP攻击 =====
  if (bot.pvp) {
    bot.pvp.stop()
  }

  // ===== 3. 停止挖掘 =====
  if (bot.digging) {
    try {
      bot.stopDigging()
    } catch (e) {}
  }
  // ===== 4. 停止使用物品（吃东西/拉弓） =====
  if (bot.usingHeldItem) {
    bot.deactivateItem()
  }
  // ===== 5. 停止所有控制状态（防止还在走） =====
  bot.clearControlStates()
  return {
    success: true
  }
}

// 技能元数据 - 供AI了解技能功能
stopAll.metadata = {
  name: 'stop',
  description: '停止所有正在进行的动作（寻路/攻击/挖掘/使用物品等）。AI在需要中断时调用。',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
}

module.exports = stopAll
