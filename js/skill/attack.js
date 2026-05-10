const { resolveEntity } = require('../utils/entity')
const { equipBestWeapon, isWeapon, tryEat, retreat, stopCombat } = require('../utils/combat')
const { GoalFollow, GoalNear } = require('mineflayer-pathfinder').goals
const { ensureVec3 } = require('../utils/vec3')

const EMERGENCY_HEALTH = 4 // 2❤️，低于此值不尝试进食直接撤退（进食会被攻击打断，不如先跑）

/**
 * 攻击技能 - 与感知层解耦版本（方案A）
 * AI 负责：通过感知层获取数据 → 构造参数 → 调用此函数
 * 此函数只杀一个目标，count 循环由上层 task 系统处理
 */
async function attack(bot, options = {}) {
  const { mode } = options;

  switch (mode) {
    case 'melee':   return handleMelee(bot, options)
    case 'ranged':  return handleRanged(bot, options)
    case 'guard':   return handleGuard(bot, options)
    default:        return { success: false, error: '未知攻击模式: ' + mode }
  }
}

// =====================================================================
//  近战 — 追击目标并用剑/斧持续攻击（只杀一个）
// =====================================================================
//  参数: targetEntity(由AI通过perception.getNearbyEnemies()获取并传入), autoEat, retreatHealth, timeout

async function handleMelee(bot, options) {
  const { targetEntity, autoEat = true, retreatHealth = 6, timeout: timeoutMs = 30000 } = options;

  if (bot.health <= EMERGENCY_HEALTH) return { success: false, error: '血量过低，无法战斗' }

  // 使用AI传入的targetEntity，不再自己findHostile()
  const target = targetEntity ? resolveEntity(bot, targetEntity) : null;
  if (!target) return { success: false, error: '没有攻击目标，请AI通过感知层获取敌人并传入' };

  const hasWeapon = await equipBestWeapon(bot, 'melee')
  if (!hasWeapon) console.log('[attack] 没有武器，空手战斗');

  const startTime = Date.now();

  // 只执行一次击杀，count循环由上层task系统处理
  const result = await doMeleeOnce(bot, target, startTime, { autoEat, retreatHealth, timeout: timeoutMs });

  stopCombat(bot);

  return {
    success: result.killed || false,
    killed: result.killed || false,
    reason: result.reason,
    // 告诉上层：需要继续杀？还是完了？
    needContinue: !result.done
  };
}

/** 单目标追击：mineflayer-pvp 负责自动追砍，这里每 100ms 轮询做决策 */
async function doMeleeOnce(bot, target, startTime, { autoEat, retreatHealth, timeout }) {
  // 委托给 mineflayer-pvp 插件：它会自动追击并持续攻击目标
  if (bot.pvp) bot.pvp.attack(target);

  // 轮询决策循环 — 条件优先级：超时 > 紧急血量 > 撤退血量 > 目标死亡
  // 注意：血量检查排在目标死亡之前，意味着即使目标已死，血量过低也会先触发撤退逻辑
  while (true) {
    await new Promise(r => setTimeout(r, 100));

    if (Date.now() - startTime > timeout) return { done: true, reason: 'timeout' };

    if (bot.health <= EMERGENCY_HEALTH) {
      await retreat(bot);
      return { done: true, reason: 'emergency' };
    }

    if (bot.health <= retreatHealth) {
      if (autoEat && await tryEat(bot)) continue;
      await retreat(bot);
      return { done: true, reason: 'retreat' };
    }

    // 实体被移除（死亡/消失）→ isValid 变 false 且 entities 中删除
    if (!target.isValid || !bot.entities[target.id]) return { killed: true, done: false };

    if (!isWeapon(bot.heldItem?.name)) await equipBestWeapon(bot, 'melee');
  }
}

// =====================================================================
//  远程 — 保持距离用弓/弩射击（只杀一个）
// =====================================================================
//  参数: targetEntity(由AI传入), timeout

async function handleRanged(bot, options) {
  const { targetEntity, timeout: timeoutMs = 30000 } = options;

  if (bot.health <= EMERGENCY_HEALTH) return { success: false, error: '血量过低，无法战斗' };

  const target = targetEntity ? resolveEntity(bot, targetEntity) : null;
  if (!target) return { success: false, error: '没有攻击目标，请AI通过感知层获取敌人并传入' };

  const hasWeapon = await equipBestWeapon(bot, 'ranged')
  if (!hasWeapon) return { success: false, error: '没有远程武器' };

  if (!require('../utils/inventory').findItem(bot, { keywords: ['arrow'] })) {
    return { success: false, error: '没有箭矢' };
  }

  const startTime = Date.now();
  const result = await doRangedOnce(bot, target, startTime, { timeout: timeoutMs });

  stopCombat(bot);
  if (bot._bowChargeAt) delete bot._bowChargeAt;

  return {
    success: result.killed || false,
    killed: result.killed || false,
    reason: result.reason
  };
}

/** 单目标远程：使用 GoalFollow(target, 8) 保持距离射击，不走上去拼刀 */
async function doRangedOnce(bot, target, startTime, { timeout }) {
  bot.pathfinder.setGoal(new GoalFollow(target, 8), true);

  while (true) {
    await new Promise(r => setTimeout(r, 100));

    if (Date.now() - startTime > timeout) return { done: true, reason: '战斗超时' };

    if (bot.health <= EMERGENCY_HEALTH) {
      await retreat(bot);
      return { done: true, reason: '紧急撤离' };
    }

    if (!target.isValid || !bot.entities[target.id]) return { killed: true, done: false };

    await doBowTick(bot, target);
  }
}

/** 弓箭 tick：在 bot 上用 _bowChargeAt 记拉弓时间，跨多次调用维持状态机 */
async function doBowTick(bot, target) {
  // 超过 24 格不射（Minecraft 弓箭有效射程上限），doRangedOnce 的 GoalFollow 会负责拉近距离
  const dist = bot.entity.position.distanceTo(target.position);
  if (dist > 24) return;

  await bot.lookAt(target.position.offset(0, Math.min(target.height || 1, 1.5), 0), true);

  // 三段状态机：空闲 → 拉弓 → 蓄力满放箭 → 冷却 600ms → 回到空闲
  // bot.isUsingItem 区分"正在拉弓"和"空闲"，_bowChargeAt 记录开始拉弓的时刻
  if (bot.isUsingItem) {
    if (!bot._bowChargeAt) bot._bowChargeAt = Date.now();     // 刚拉满，开始计时
    else if (Date.now() - bot._bowChargeAt > 800) {           // 蓄力 ≥ 0.8s → 放箭
      bot.deactivateItem();
      delete bot._bowChargeAt;
      await new Promise(r => setTimeout(r, 600));               // 放箭硬直，等 0.6s 再拉下一发
    }
  } else {
    bot._bowChargeAt = null;
    bot.activateItem();                                          // 开始拉弓
  }
}

// =====================================================================
//  守护 — 在指定范围内巡逻，发现敌对生物自动清除（只杀一个）
// =====================================================================
//  参数:
//    position  - 守护中心坐标（由AI通过perception获取）
//    radius    - 警戒半径（默认 15）
//    targetEntity - 目标（由AI通过perception.getNearbyEnemies()获取并传入）

async function handleGuard(bot, options) {
  const { position, radius = 15, targetEntity, autoEat = true, retreatHealth = 6, timeout: timeoutMs = 300000 } = options;

  if (bot.health <= EMERGENCY_HEALTH) return { success: false, error: '血量过低' };

  const guardPos = ensureVec3(position);
  if (!guardPos) return { success: false, error: '缺少守护坐标 position' };

  await equipBestWeapon(bot, 'melee');
  const startTime = Date.now();

  // 先移动到守护位置
  await bot.pathfinder.goto(new GoalNear(guardPos.x, guardPos.y, guardPos.z, 2));

  // 如果AI传了目标，直接杀一个
  if (targetEntity) {
    const target = resolveEntity(bot, targetEntity);
    if (target) {
      const result = await doMeleeOnce(bot, target, startTime, { autoEat, retreatHealth, timeout: timeoutMs });
      stopCombat(bot);
      return {
        success: result.killed || false,
        killed: result.killed || false,
        reason: result.reason,
        needReturn: true // 告诉上层需要返回岗位
      };
    }
  }

  return { success: false, error: '守护模式需要AI提供目标', needTarget: true };
}

// 技能元数据 - 供AI了解技能功能（解耦后，AI负责构造参数）
attack.metadata = {
  name: 'attack',
  description: '攻击敌对生物，支持近战/远程/守护模式。AI负责通过感知层获取敌人信息并传入参数。技能只杀一个目标，count循环由上层task系统处理。',
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['melee', 'ranged', 'guard'],
        description: '攻击模式：melee=近战, ranged=远程, guard=守护'
      },
      targetEntity: {
        type: ['string', 'object'],
        description: '目标实体（由AI通过perception.getNearbyEnemies()获取后传入）'
      },
      count: {
        type: 'number',
        description: '击杀数量（由上层task系统循环调用实现）'
      },
      autoEat: {
        type: 'boolean',
        description: '血量低时自动进食',
        default: true
      },
      retreatHealth: {
        type: 'number',
        description: '低于此血量时撤退',
        default: 6
      },
      timeout: {
        type: 'number',
        description: '超时时间(ms)',
        default: 30000
      },
      position: {
        type: 'object',
        description: '守护模式的坐标（由AI通过perception获取）',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        }
      },
      radius: {
        type: 'number',
        description: '守护警戒半径',
        default: 15
      }
    },
    required: ['mode']
  }
};

module.exports = attack;
