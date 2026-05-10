const { GoalNear } = require('mineflayer-pathfinder').goals
const { ensureVec3 } = require('../utils/vec3')
const { pickupNearbyItems } = require('../utils/pickup')

/**
 * 挖掘技能 - 与感知层解耦版本
 * AI 负责：通过感知层获取目标方块 → 传入 targetBlock
 * skill 负责：接收 targetBlock → 执行挖掘（一次一个，count 循环由上层 task 系统处理）
 * 注意：挖完方块后，Minecraft 会自动拾取脚边的掉落物，无需显式调用 pickup
 */
async function dig(bot, options = {}) {
  const { targetBlock, position, pickup = false } = options;

  // AI 已通过感知层选好目标方块
  if (targetBlock?.position) {
    return digSingle(bot, targetBlock, pickup);
  }

  // AI 传入坐标，先查方块再挖
  if (position) {
    return digByPos(bot, ensureVec3(position), pickup);
  }

  return { success: false, error: '无法确定挖掘目标，请AI通过感知层获取方块后传入 targetBlock 或 position' };
}

// ===== 按坐标挖掘 =====

async function digByPos(bot, pos, pickup = false) {
  if (!pos) return { success: false, error: 'position 非法' };

  const block = bot.blockAt(pos);
  if (!block || block.name === 'air') {
    return { success: false, error: '目标位置没有可挖掘的方块' };
  }

  return digSingle(bot, block, pickup);
}

// ===== 执行单次挖掘 =====

async function digSingle(bot, block, pickup = false) {
  const pos = block.position;

  // 用眼睛位置算距离，更接近游戏实际可触及范围
  const eyePos = bot.entity.position.offset(0, bot.entity.height || 1.6, 0);
  const blockCenter = pos.offset(0.5, 0.5, 0.5);
  const dist = eyePos.distanceTo(blockCenter);

  if (dist > 4.5) {
    try {
      await bot.pathfinder.goto(new GoalNear(pos.x, pos.y, pos.z, 1));
    } catch (err) {
      return { success: false, error: '无法到达: ' + err.message };
    }
  }

  // 先换工具，再一次性转头开始挖
  const tool = bot.pathfinder.bestHarvestTool(block);
  if (tool) {
    try {
      const currentItem = bot.heldItem;
      if (!currentItem || currentItem.name !== tool.name) {
        await bot.equip(tool, 'hand');
      }
    } catch (err) {
      return { success: false, error: '无法装备工具: ' + err.message };
    }
  }

  // bot.dig 内部会自己 lookAt 方块，无需手动转头
  try {
    await bot.dig(block);
    if (pickup) await pickupNearbyItems(bot);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 技能元数据 - 供AI了解技能功能
dig.metadata = {
  name: 'dig',
  description: '挖掘方块。AI负责通过感知层获取目标方块并传入，skill只执行挖掘（一次一个）。',
  parameters: {
    type: 'object',
    properties: {
      targetBlock: {
        type: 'object',
        description: '目标方块对象（由AI通过perception.getNearbyBlocks()获取后传入，需包含position）'
      },
      position: {
        type: 'object',
        description: '目标坐标（由AI通过感知层获取后传入）',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        }
      },
      count: {
        type: 'number',
        description: '挖掘数量（由上层task系统循环调用实现）'
      },
      pickup: {
        type: 'boolean',
        description: '是否捡起掉落物（当掉落物离bot较远时，需设为true）',
        default: false
      }
    },
    required: []
  }
};

module.exports = dig;
