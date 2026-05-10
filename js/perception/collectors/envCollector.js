/**
 * 采集环境属性信息，返回原始数据
 * @param {Bot} bot - mineflayer bot 实例
 * @returns {Object} 环境属性对象
 */
function collectEnvironment(bot) {
  const pos = bot.entity.position

  return {
    time: {
      timeOfDay: bot.time.timeOfDay,    // 游戏内时间 (0-24000, 0=日出, 6000=正午, 12000=日落, 18000=午夜)
      isDay: bot.time.timeOfDay > 0 && bot.time.timeOfDay < 13000  // 是否为白天
    },
    weather: {
      rain: bot.rainState || false,     // 是否下雨/下雪
      thunder: bot.thunderState || false, // 是否雷暴
      state: bot.rainState               // 综合天气状态: 'clear' / 'rain' / 'thunder'
        ? (bot.thunderState ? 'thunder' : 'rain')
        : 'clear'
    },
    biome: bot.world.getBiome(pos.x, pos.y, pos.z)?.name || 'unknown', // 当前生物群系 (forest/desert/plains等)
    light: {
      block: bot.world.getBlockLight(pos.x, pos.y, pos.z), // 方块光照等级 (0-15, 火把/熔岩等)
      sky: bot.world.getSkyLight(pos.x, pos.y, pos.z)      // 天空光照等级 (0-15, 受时间和遮挡影响)
    },
    difficulty: bot.game.difficulty // 游戏难度 (0=和平, 1=简单, 2=普通, 3=困难)
  }
}

module.exports = { collectEnvironment }
