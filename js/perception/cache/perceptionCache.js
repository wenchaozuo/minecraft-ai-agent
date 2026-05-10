const { collectBlocks } = require('../collectors/blockCollector')
const { collectEntities } = require('../collectors/entityCollector')
const { collectSelf } = require('../collectors/selfCollector')
const { collectEnvironment } = require('../collectors/envCollector')
const { processBlocks } = require('../processors/blockProcessor')
const { processEntities } = require('../processors/entityProcessor')

/**
 * 缓存配置默认值
 * block/entity：扫描开销大，缓存时间长一点
 * self：变化频繁但数据量小，缓存时间短
 * environment：变化慢，缓存时间最长
 */
const DEFAULT_OPTIONS = {
  blockRadius: 32,       // 方块扫描半径
  entityRadius: 64,       // 实体扫描半径
  moveThreshold: 5,        // 移动多少格后更新（blocks/entities），bot移动无事件，保留
  timeThreshold: 3000,      // 时间间隔阈值（ms），事件驱动已处理大部分更新，3秒兜底
  selfTimeThreshold: 500,   // self 数据更新间隔（自身状态变化频繁，保持短缓存）
  envTimeThreshold: 5000     // environment 数据更新间隔（环境变化慢，5秒兜底）
}

/**
 * 感知缓存管理器
 * 负责管理所有感知数据的缓存和更新策略
 *
 * 更新策略：
 * 1. 移动距离超过 moveThreshold → 更新
 * 2. 距离上次更新超过 timeThreshold → 更新
 * 3. 手动调用 invalidate() → 强制下次重新采集
 */
class PerceptionCache {
  /**
   * @param {Bot} bot - mineflayer bot 实例
   * @param {Object} options - 配置选项（覆盖默认值）
   */
  constructor(bot, options = {}) {
    this.bot = bot
    this.options = { ...DEFAULT_OPTIONS, ...options }

    // 缓存存储结构
    // data: 缓存的数据（null 表示未初始化）
    // lastPos: 上次更新时的 bot 位置（用于计算移动距离）
    // lastUpdate: 上次更新时间戳（Date.now()）
    this.cache = {
      blocks: { data: null, lastPos: null, lastUpdate: 0 },
      entities: { data: null, lastPos: null, lastUpdate: 0 },
      self: { data: null, lastUpdate: 0 },
      environment: { data: null, lastUpdate: 0 }
    }
  }

  /**
   * 判断缓存是否应该更新
   * 条件：数据为空 OR 移动距离超阈值 OR 时间间隔超阈值
   *
   * @param {Object} cacheEntry - 缓存条目（包含 data, lastPos, lastUpdate）
   * @param {number} moveThreshold - 移动阈值
   * @param {number} timeThreshold - 时间阈值（ms）
   * @returns {boolean} true 表示需要更新
   */
  _shouldUpdate(cacheEntry, moveThreshold, timeThreshold) {
    const now = Date.now()

    // 数据为空，必须更新
    if (!cacheEntry.data) return true

    // 时间间隔超过阈值，需要更新
    if (now - cacheEntry.lastUpdate > timeThreshold) return true

    // 如果有位置信息，检查移动距离
    if (cacheEntry.lastPos) {
      const pos = this.bot.entity.position
      const dx = pos.x - cacheEntry.lastPos.x
      const dy = pos.y - cacheEntry.lastPos.y
      const dz = pos.z - cacheEntry.lastPos.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist > moveThreshold) return true
    }

    return false
  }

  /**
   * 获取方块数据（带缓存）
   * 如果缓存有效，直接返回；否则重新采集并处理
   *
   * @returns {Array} 处理后的方块数组（带 category 字段）
   */
  getBlocks() {
    const entry = this.cache.blocks

    if (this._shouldUpdate(entry, this.options.moveThreshold, this.options.timeThreshold)) {
      // 采集原始数据
      const raw = collectBlocks(this.bot, this.options.blockRadius)
      // 处理数据：添加 category，应用默认过滤
      entry.data = processBlocks(raw)
      // 记录更新信息
      entry.lastPos = this.bot.entity.position.clone()
      entry.lastUpdate = Date.now()
    }

    return entry.data
  }

  /**
   * 获取实体数据（带缓存）
   * 如果缓存有效，直接返回；否则重新采集并处理
   *
   * @returns {Array} 处理后的实体数组（带 category 字段）
   */
  getEntities() {
    const entry = this.cache.entities

    if (this._shouldUpdate(entry, this.options.moveThreshold, this.options.timeThreshold)) {
      // 采集原始数据
      const raw = collectEntities(this.bot, this.options.entityRadius)
      // 处理数据：添加 category
      entry.data = processEntities(raw)
      // 记录更新信息
      entry.lastPos = this.bot.entity.position.clone()
      entry.lastUpdate = Date.now()
    }

    return entry.data
  }

  /**
   * 获取自身状态（带缓存）
   * 自身状态变化频繁但数据量小，使用更短的缓存时间
   *
   * @returns {Object} 自身状态对象
   */
  getSelf() {
    const entry = this.cache.self
    const now = Date.now()

    if (!entry.data || now - entry.lastUpdate > this.options.selfTimeThreshold) {
      entry.data = collectSelf(this.bot)
      entry.lastUpdate = now
    }

    return entry.data
  }

  /**
   * 获取环境属性（带缓存）
   * 环境变化慢，使用更长的缓存时间
   *
   * @returns {Object} 环境属性对象
   */
  getEnvironment() {
    const entry = this.cache.environment
    const now = Date.now()

    if (!entry.data || now - entry.lastUpdate > this.options.envTimeThreshold) {
      entry.data = collectEnvironment(this.bot)
      entry.lastUpdate = now
    }

    return entry.data
  }

  /**
   * 清除所有缓存
   * 下次访问时会重新采集数据
   * 用于手动强制刷新或重大事件（如死亡、传送）
   */
  invalidate() {
    for (const key of Object.keys(this.cache)) {
      this.cache[key].data = null
      this.cache[key].lastPos = null
      this.cache[key].lastUpdate = 0
    }
  }

  /**
   * 只清除方块缓存
   * blockUpdate 事件触发时调用
   */
  invalidateBlocks() {
    this.cache.blocks.data = null
    this.cache.blocks.lastPos = null
    this.cache.blocks.lastUpdate = 0
  }

  /**
   * 只清除实体缓存
   * entitySpawned / entityGone 事件触发时调用
   */
  invalidateEntities() {
    this.cache.entities.data = null
    this.cache.entities.lastPos = null
    this.cache.entities.lastUpdate = 0
  }

  /**
   * 只清除自身状态缓存
   * healthChanged / inventoryChanged 等事件触发时调用
   */
  invalidateSelf() {
    this.cache.self.data = null
    this.cache.self.lastUpdate = 0
  }

  /**
   * 只清除环境缓存
   * 天气/时间变化事件触发时调用
   */
  invalidateEnvironment() {
    this.cache.environment.data = null
    this.cache.environment.lastUpdate = 0
  }

  /**
   * 强制刷新所有数据
   * 先清除缓存，然后重新采集所有数据
   */
  refreshAll() {
    this.invalidate()
    this.getBlocks()
    this.getEntities()
    this.getSelf()
    this.getEnvironment()
  }
}

module.exports = PerceptionCache
