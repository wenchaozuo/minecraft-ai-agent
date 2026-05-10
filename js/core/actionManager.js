const { runAction } = require('./actionRunner')
const { attack } = require('../skill/attack')
const placeBlock = require('../skill/placeBlock')
const navigate = require('../skill/navigate')
const stopAll = require('../skill/stop')
const dig = require('../skill/dig')
const useItem = require('../skill/useItem')
const itemManage = require('../skill/itemManage')
const equip = require('../skill/equip')
const blockInteract = require('../skill/blockInteract')

const actions = {
  navigate: navigate,
  attack: attack,
  placeBlock: placeBlock,
  stopAll: stopAll,
  dig: dig,
  useItem: useItem,
  itemManage: itemManage,
  equip: equip,
  blockInteract: blockInteract
}

async function handleAction(bot, action) {
  if (!action) {
    return { success: false, error: 'action 为空' }
  }

  const actionName = action.type
  const options = action.data || {}

  const actionFn = actions[actionName]
  if (!actionFn) {
    return { success: false, error: '未知动作: ' + actionName }
  }

  return await runAction(bot, actionFn, options)
}

function getSkillsMetadata() {
  const metadata = {}

  for (const [name, fn] of Object.entries(actions)) {
    if (fn.metadata) {
      metadata[name] = fn.metadata
    } else {
      metadata[name] = {
        name: name,
        description: name + ' 技能（暂无详细描述）',
        parameters: { type: 'object', properties: {} }
      }
    }
  }

  return metadata
}

function getSkillMetadata(skillName) {
  const fn = actions[skillName]
  if (!fn) return null
  return fn.metadata || {
    name: skillName,
    description: skillName + ' 技能（暂无详细描述）',
    parameters: { type: 'object', properties: {} }
  }
}

module.exports = {
  handleAction: handleAction,
  getSkillsMetadata: getSkillsMetadata,
  getSkillMetadata: getSkillMetadata,
  actions: actions
}
