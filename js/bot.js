const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { setupAutoRespawn } = require('./feedback/death')
const { handleAction }  = require('./core/actionManager')
const pvp = require('mineflayer-pvp').plugin
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const path = require('path')
const fs = require('fs')
const CAPTURE_DIR = path.join(__dirname, '..', 'captures')
if (!fs.existsSync(CAPTURE_DIR)) fs.mkdirSync(CAPTURE_DIR, { recursive: true })

const bot = mineflayer.createBot({
  host: 'zwc123.dynv6.net',
  port: 25565,
  username: 'Ai_rbot',
  auth: 'microsoft',
  profilesFolder: './auth_cache'
})
const sleep = ms => new Promise(r => setTimeout(r, ms))
bot.loadPlugin(pvp)
bot.loadPlugin(pathfinder)
bot.once('spawn', async () => {
  const viewer = mineflayerViewer(bot, {
    port: 3007,
    firstPerson: true,
    viewDistance: 8
  })
  console.log('✅ Bot 已进入世界')
  const mcdata=require('minecraft-data')(bot.version)
  const movement = new Movements(bot,mcdata)
  movement.canDig = true//可以挖方块
  movement.allow1by1towers = true//是否允许"垫脚上升"
  movement.canOpenDoors = true//开门
  movement.maxDropDown = 4//最大下落高度
  movement.infiniteLiquidDropdownDistance = true//允许跳进水里（无限高度）
  movement.allowFreeMotion = false    // ❗ 保持寻路稳定
  /*
  movement.placeCost = 3//控制放置方块的参数
  movement.digCost = 1//控制挖方块的参数
  */
  movement.allowSprinting = true//冲刺
  movement.entityCost = 10//避开怪物
  movement.allowParkour = true// 可以跳跃跨格
  bot.movement = movement//挂载到全局变量
  bot.pathfinder.setMovements(movement)
  setupAutoRespawn(bot)
  await sleep(3000)  // 等 3 秒让实体加载
  console.log('✅ Bot 已就绪，等待指令...')
})

let isAutoEating = false

bot.on('physicsTick', () => {
  if (bot.food > 6 || isAutoEating || bot.isUsingItem) return

  isAutoEating = true
  bot.pathfinder.stop()
  if (bot.pvp) bot.pvp.stop()

  handleAction(bot, { type: 'useItem', data: { mode: 'eat' } }).finally(() => { isAutoEating = false })
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return

  if (message === 'come') {
    console.log(`${username} 叫我过去`)
    const player = bot.players[username]

    if (!player || !player.entity) {
      bot.chat('我看不到你，靠近一点！')
      return
    }

    // 执行跟随动作（通过 handleAction）
    handleAction(bot, { type: 'navigate', data: { mode: 'follow', target: username } })
    bot.chat('我来了！')
  }

})

 bot.on('kicked', (reason) => {
  console.log('被踢原因:', reason)
})

bot.on('error', (err) => {
  console.log('错误:', err)
})

bot.on('end', () => {
  console.log('连接结束')
})

bot.on('death', () => {
  console.log('我死了，准备复活...')
  setTimeout(() => {
    bot.respawn()
  }, 1000) // 延迟1秒更稳定
})

