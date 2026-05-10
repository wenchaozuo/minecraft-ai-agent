const { findItem } = require('../utils/inventory')

const SLOT_MAP = {
  head: 'head',
  torso: 'torso',
  chest: 'torso',
  legs: 'legs',
  feet: 'feet',
  boots: 'feet',
  hand: 'hand',
  offhand: 'off-hand',
  'off-hand': 'off-hand'
}

/**
 * 装备技能 - 与感知层解耦版本
 * AI 负责：通过感知层获取物品信息 → 传入物品名和槽位
 * skill 负责：接收参数 → 执行装备
 */
async function equip(bot, options = {}) {
  const { item: itemName, slot } = options;
  if (!itemName) return { success: false, error: '未指定物品，请AI通过感知层获取物品信息后传入' };
  if (!slot) return { success: false, error: '未指定装备槽位' };

  const destination = SLOT_MAP[slot];
  if (!destination) return { success: false, error: `未知装备槽位: ${slot}` };

  const item = findItem(bot, { name: itemName });
  if (!item) return { success: false, error: `背包中没有: ${itemName}` };

  try {
    await bot.equip(item, destination);
    return { success: true, item: itemName, slot };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
equip.metadata = {
  name: 'equip',
  description: '装备物品到指定槽位。AI负责通过感知层获取物品信息并传入参数。',
  parameters: {
    type: 'object',
    properties: {
      item: {
        type: 'string',
        description: '物品名称（由AI通过perception.getSelfStatus()获取后传入）'
      },
      slot: {
        type: 'string',
        enum: ['head', 'torso', 'chest', 'legs', 'feet', 'boots', 'hand', 'offhand', 'off-hand'],
        description: '装备槽位'
      }
    },
    required: ['item', 'slot']
  }
};

module.exports = equip;
