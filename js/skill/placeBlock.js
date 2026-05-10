const { findItem } = require('../utils/inventory')
const { findReferenceBlock } = require('../utils/blockPlacement')
const { ensureVec3 } = require('../utils/vec3')
const { GoalNear } = require('mineflayer-pathfinder').goals

/**
 * 放置方块技能 - 与感知层解耦版本
 * AI 负责：通过 perception.getNearbyBlocks() 获取方块 → 选择目标位置 → 构造参数
 * skill 负责：接收已选好的位置和物品 → 执行放置（一次一个）
 */
async function placeBlock(bot, options = {}) {
  try {
    const {
      position,
      item: itemName
    } = options;

    // ===== 1. 参数检查 & Vec3 转换 =====
    const targetPos = ensureVec3(position);
    if (!targetPos) return { success: false, error: 'position 非法，请AI通过感知层获取后传入' };

    // ===== 2. 找物品（AI 通过感知层获取物品名后传入）=====
    if (!itemName) {
      return { success: false, error: '未指定物品，请AI通过感知层获取物品名后传入' };
    }

    const item = bot.inventory.items().find(i => i.name === itemName);
    if (!item) {
      return { success: false, error: `背包中没有: ${itemName}` };
    }

    // ===== 3. 距离判断（只用 position）=====
    const dist = bot.entity.position.distanceTo(targetPos);

    if (dist > 4) {
      console.log('📍 目标太远，先移动过去');

      await bot.pathfinder.goto(new GoalNear(
        targetPos.x,
        targetPos.y,
        targetPos.z,
        3
      ));
    }

    // ===== 4. 装备 =====
    await bot.equip(item, 'hand');

    // ===== 5. 找参考方块 =====
    const ref = findReferenceBlock(bot, targetPos);

    if (!ref) {
      return { success: false, error: '无法放置（无支撑），请AI选择一个有支撑的位置' };
    }

    const { referenceBlock, faceVector } = ref;

    // ===== 6. 对准 =====
    await bot.lookAt(targetPos.offset(0.5, 0.5, 0.5), true);

    // ===== 7. 放置 =====
    await bot.placeBlock(referenceBlock, faceVector);

    console.log('✅ 放置成功:', targetPos);

    return { success: true, position: { x: targetPos.x, y: targetPos.y, z: targetPos.z } };

  } catch (err) {
    console.log('❌ 放置失败:', err);
    return { success: false, error: err.message };
  }
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
placeBlock.metadata = {
  name: 'placeBlock',
  description: '放置方块。AI负责通过感知层获取可放置位置并传入position。',
  parameters: {
    type: 'object',
    properties: {
      position: {
        type: 'object',
        description: '目标位置坐标（由AI通过感知层获取后传入）',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        },
        required: ['x', 'y', 'z']
      },
      item: {
        type: 'string',
        description: '要放置的方块名称（由AI通过感知层获取后传入）'
      }
    },
    required: ['position']
  }
};

module.exports = placeBlock;
