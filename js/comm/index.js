const Perception = require('../perception/index')
const { handleAction } = require('../core/actionManager')

/**
 * 通信模块 - JS与Python大脑通信
 * 使用 stdio 进行简单高效的进程间通信
 * JS负责：采集感知数据 → 发送给Python → 接收指令 → 执行
 */

let bot = null
let perception = null
let initialized = false

/**
 * 初始化通信模块
 * @param {Bot} botInstance - mineflayer bot 实例
 */
function init(botInstance) {
  bot = botInstance
  perception = new Perception(bot)
  initialized = true

  // 监听 stdin，接收 Python 大脑的指令
  process.stdin.on('data', async (data) => {
    try {
      const msg = JSON.parse(data.toString().trim())
      await handleMessage(msg)
    } catch (err) {
      console.error('❌ 指令解析失败:', err.message)
    }
  })

  console.log('🧠 通信模块已初始化，等待大脑指令...')
}

/**
 * 处理来自 Python 的指令
 * @param {Object} msg - 指令消息 { type, data }
 */
async function handleMessage(msg) {
  if (!initialized) return

  const { type, data } = msg

  if (type === 'action') {
    // 执行动作
    const result = await handleAction(bot, data)
    sendToPython({ type: 'action_result', result })
  } else if (type === 'perception_request') {
    // 发送感知数据（支持按需：sections 指定需要的部分）
    // 支持两种格式：{ sections: [...] } 或 { data: { sections: [...] } }
    const sections = msg.sections || data?.sections || ['self', 'blocks', 'entities', 'environment']
    sendPerception(sections)
  } else if (type === 'stop') {
    // 停止所有动作
    await handleAction(bot, { type: 'stopAll' })
  }
}

/**
 * 发送感知数据给 Python 大脑（支持按需返回）
 * @param {Array} sections - 需要的部分：self/blocks/entities/environment
 */
function sendPerception(sections = ['self', 'blocks', 'entities', 'environment']) {
  if (!perception) return

  const result = { timestamp: Date.now() }

  if (sections.includes('self')) {
    result.self = perception.getSelfStatus()
  }
  if (sections.includes('blocks')) {
    result.blocks = perception.getNearbyBlocks()
  }
  if (sections.includes('entities')) {
    result.entities = perception.getNearbyEntities()
  }
  if (sections.includes('environment')) {
    result.environment = perception.getEnvironmentStatus()
  }

  sendToPython({
    type: 'perception',
    data: result
  })
}

/**
 * 发送消息给 Python（通过 stdout）
 * @param {Object} msg - 要发送的消息对象
 */
function sendToPython(msg) {
  const json = JSON.stringify(msg)
  process.stdout.write(json + '\n')
}

/**
 * 主动通知 Python（如事件触发）
 * @param {string} event - 事件名称
 * @param {Object} data - 事件数据
 */
function notify(event, data) {
  sendToPython({
    type: 'event',
    event: event,
    data: data,
    timestamp: Date.now()
  })
}

module.exports = {
  init,
  sendPerception,
  notify
}
