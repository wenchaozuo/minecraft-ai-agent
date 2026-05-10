const { resolveEntity } = require('../utils/entity')
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals
const { ensureVec3 } = require('../utils/vec3')

/**
 * 导航技能 - 与感知层解耦版本（方案A）
 * AI 负责：通过感知层获取目标 → 构造参数
 * skill 负责：接收参数 → 执行一次导航（moveTo / follow）
 */
async function navigate(bot, options = {}) {
  const { mode } = options;

  if (!mode) return { success: false, error: '未指定 mode（moveTo / follow）' };

  switch (mode) {
    case 'moveTo':
      return handleMoveTo(bot, options)
    case 'follow':
      return handleFollow(bot, options)
    default:
      return { success: false, error: `未知导航模式: ${mode}` }
  }
}

// ===== 移动到坐标（一次） =====

/**
 * 移动到指定坐标
 * AI 负责：通过感知层获取目标坐标并传入
 * skill 只执行一次导航，循环由上层 task 系统处理
 */
async function handleMoveTo(bot, options) {
  const { position } = options;
  if (!position) return { success: false, error: '缺少 position，请AI通过感知层获取后传入' };

  const pos = ensureVec3(position);
  if (!pos) return { success: false, error: 'position 非法，请AI确保传入有效的坐标对象' };

  const goal = new GoalNear(pos.x, pos.y, pos.z, 2)
  bot.pathfinder.setGoal(goal);

  // 等待到达（简化版，完整实现需要 movement monitor）
  return new Promise(resolve => {
    let finished = false;

    bot.once('goal_reached', () => {
      if (!finished) {
        finished = true;
        resolve({ success: true, position: { x: pos.x, y: pos.y, z: pos.z } });
      }
    });

    setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve({ success: false, error: '导航超时' });
      }
    }, 10000);
  });
}

// ===== 跟随实体（持续） =====

/**
 * 跟随实体
 * AI 负责：通过感知层获取目标实体并传入
 * skill 开始跟随，由上层决定是否停止
 */
async function handleFollow(bot, options) {
  const { target } = options;
  if (!target) return { success: false, error: '缺少 target，请AI通过感知层获取后传入' };

  const entity = resolveEntity(bot, target);
  if (!entity) return { success: false, error: '找不到目标实体，请AI通过感知层确认目标存在' };

  const goal = new GoalFollow(entity, 2)
  bot.pathfinder.setGoal(goal, true);

  return { success: true, following: entity.name || 'unknown' };
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
navigate.metadata = {
  name: 'navigate',
  description: '导航到坐标或跟随实体。AI负责通过感知层获取目标并传入参数。执行一次动作（task系统处理循环）。',
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['moveTo', 'follow'],
        description: '导航模式：moveTo=移动到坐标, follow=跟随实体'
      },
      position: {
        type: 'object',
        description: '目标坐标（由AI通过perception.getNearbyBlocks/getEnvironment等获取后传入）',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        }
      },
      target: {
        type: ['string', 'object'],
        description: '目标实体（由AI通过perception.getNearbyEntities()获取后传入）'
      }
    },
    required: ['mode']
  }
};

module.exports = navigate;
