const { findItem } = require('../utils/inventory')
const { getFaceFromPosition } = require('../utils/blockPlacement')
const { waitForItemConsume, waitForConsumeEvent } = require('../utils/itemUsage')
const { resolveEntity } = require('../utils/entity')
const { ensureVec3 } = require('../utils/vec3')
const { GoalNear } = require('mineflayer-pathfinder').goals

let sequenceId = 0;

// ===== 物品使用时长映射（ms）=====
// skill 根据物品自动判断，AI 无需关心
const ITEM_USE_DURATION = {
  // 瞬间完成（点火、放生等）
  'flint_and_steel': 100,
  'bucket': 300,
  'water_bucket': 300,
  'lava_bucket': 300,
  'milk_bucket': 300,
  'powder_snow_bucket': 300,
  'carrot_on_a_stick': 100,
  'warped_fungus_on_a_stick': 100,
  // 需要持续一段时间（格挡、瞄准等）
  'shield': 500,
  'trident': 300,
  'spyglass': 1000
}

// ===== 动作处理器 =====

async function handleClear(bot) {
  if (bot.usingHeldItem) bot.deactivateItem();
  bot.clearItem();
  return { success: true };
}

async function handleEat(bot) {
  const prevFood = bot.food;
  bot.activateItem();

  const finished = await waitForItemConsume(bot);
  if (!finished) return { success: false, error: '进食超时' };

  if (bot.food > prevFood) {
    console.log(`✅ 吃了食物，饱食度: ${prevFood} → ${bot.food}`);
    return { success: true };
  }
  return { success: false, error: '进食被打断' };
}

async function handleDrink(bot) {
  bot.activateItem();
  const consumed = await waitForConsumeEvent(bot);
  if (!consumed) {
    if (bot.usingHeldItem) bot.deactivateItem();
    return { success: false, error: '饮用超时' };
  }
  return { success: true };
}

async function handleActivate(bot) {
  bot.activateItem();
  // 根据手持物品判断使用时长，AI 无需传入
  const itemName = bot.heldItem?.name;
  const duration = ITEM_USE_DURATION[itemName] || 100;
  await new Promise(r => setTimeout(r, duration));
  return { success: true };
}

async function handleBow(bot, release) {
  if (release) {
    if (bot.usingHeldItem) {
      bot.deactivateItem();
      return { success: true };
    }
    return { success: false, error: '弓未在拉弦状态' };
  }
  bot.activateItem();
  return { success: true };
}

async function handleUseOnEntity(bot, target) {
  if (!target) return { success: false, error: '未指定目标实体，请AI通过感知层获取后传入' };

  const entity = resolveEntity(bot, target);
  if (!entity) return { success: false, error: '找不到目标实体' };

  const dist = bot.entity.position.distanceTo(entity.position);
  if (dist > 4) {
    await bot.pathfinder.goto(new GoalNear(entity.position.x, entity.position.y, entity.position.z, 3));
  }

  await bot.lookAt(entity.position.offset(0, entity.height / 2, 0), true);
  bot.useOn(entity);
  return { success: true };
}

async function handleUseOnBlock(bot, target) {
  if (!target) return { success: false, error: '未指定目标方块，请AI通过感知层获取后传入' };

  const targetPos = ensureVec3(target);
  if (!targetPos) return { success: false, error: '目标位置非法' };

  const dist = bot.entity.position.distanceTo(targetPos);
  if (dist > 4.5) {
    await bot.pathfinder.goto(new GoalNear(targetPos.x, targetPos.y, targetPos.z, 3));
  }

  await bot.lookAt(targetPos.offset(0.5, 0.5, 0.5), true);
  const face = getFaceFromPosition(bot.entity.position, targetPos);

  bot._client.write('use_item_on', {
    hand: 0,
    location: targetPos,
    direction: face,
    cursorX: 0.5,
    cursorY: 0.5,
    cursorZ: 0.5,
    insideBlock: false,
    sequence: ++sequenceId
  });

  await new Promise(r => setTimeout(r, 300));
  return { success: true };
}

// ===== 主入口 =====

/**
 * 使用物品技能 - 与感知层解耦版本
 * AI 负责：通过感知层选择合适物品 → 传入参数
 * skill 负责：接收参数 → 执行使用
 */
async function useItem(bot, options = {}) {
  const { mode, item: itemName, target, release, offHand = false } = options;

  if (!mode) return { success: false, error: '未指定 mode' };

  // 不需要物品的动作
  if (mode === 'clear') return handleClear(bot);
  if (mode === 'bow' && release) return handleBow(bot, release);

  // eat 提前检查饱食度
  if (mode === 'eat') {
    if (bot.food >= 20) return { success: false, error: '不饿' };
  }

  // 找物品并装备（AI 通过感知层获取物品名后传入）
  const item = findItem(bot, { name: itemName, keywords });
  if (!item) {
    return { success: false, error: `找不到物品: ${itemName || (keywords || []).join(',')}` };
  }
  await bot.equip(item, offHand ? 'off-hand' : 'hand');

  // 分发
  switch (mode) {
    case 'eat':         return handleEat(bot);
    case 'drink':       return handleDrink(bot);
    case 'activate':    return handleActivate(bot);
    case 'bow':         return handleBow(bot, release);
    case 'useOnEntity': return handleUseOnEntity(bot, target);
    case 'useOnBlock':  return handleUseOnBlock(bot, target);
    default: return { success: false, error: `未知的物品使用类型: ${mode}` };
  }
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
useItem.metadata = {
  name: 'useItem',
  description: '使用手持物品（吃/喝/激活/弓/对实体或方块使用）。AI负责通过感知层选择合适物品并传入参数。',
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['eat', 'drink', 'activate', 'bow', 'useOnEntity', 'useOnBlock', 'clear'],
        description: '使用模式'
      },
      item: {
        type: 'string',
        description: '物品名称（由AI通过感知层获取后传入）'
      },
      target: {
        type: ['string', 'object'],
        description: '目标实体或方块坐标（由AI通过感知层获取后传入）'
      },
      release: {
        type: 'boolean',
        description: '是否释放弓箭',
        default: false
      },
      offHand: {
        type: 'boolean',
        description: '是否用副手',
        default: false
      }
    },
    required: ['mode']
  }
};

module.exports = useItem;
