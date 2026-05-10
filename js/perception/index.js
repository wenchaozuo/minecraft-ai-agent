const PerceptionCache = require('./cache/perceptionCache')
const { findNearest, isInDanger } = require('./processors/spatialProcessor')
const { classifyBlock } = require('./processors/blockProcessor')
const { classifyEntity } = require('./processors/entityProcessor')

/**
 * 感知层统一入口
 * 组合所有采集器、处理器、缓存，对外提供语义化接口
 * AI 分析器和其他模块通过此类获取感知数据
 */
class Perception {
  /**
   * @param {Bot} bot - mineflayer bot 实例
   * @param {Object} options - 配置选项（传递给 PerceptionCache）
   */
  constructor(bot, options = {}) {
    this.bot = bot
    this.cache = new PerceptionCache(bot, options)
    this._initEvents()
  }

  /**
   * 初始化事件监听
   * 不同事件只清理对应的缓存，避免不必要的全量刷新
   */
  _initEvents() {
    // 新实体出现 → 只清实体缓存
    this.bot.on('entitySpawned', (entity) => {
      if (entity.type === 'mob' || entity.type === 'player') {
        this.cache.invalidateEntities()
      }
    })

    // 实体消失 → 只清实体缓存
    this.bot.on('entityGone', () => {
      this.cache.invalidateEntities()
    })

    // 方块更新 → 只清方块缓存
    this.bot.on('blockUpdate', (oldBlock, newBlock) => {
      this.cache.invalidateBlocks()
    })

    // 自身血量变化 → 只清自身状态缓存
    this.bot.on('healthChanged', () => {
      this.cache.invalidateSelf()
    })
  }

  // ==================== 自身状态 ====================

  /**
   * 获取 bot 自身状态
   * @returns {Object} 自身状态对象（含 health, food, position, inventory 等）
   */
  getSelfStatus() {
    return this.cache.getSelf()
  }

  // ==================== 方块相关 ====================

  /**
   * 获取附近方块（支持过滤）
   * @param {Object} filter - 过滤条件
   * @param {string} [filter.category] - 按类别过滤（'resource'/'dangerous'/'building'等）
   * @param {string} [filter.name] - 按名称过滤（如 'oak_log'）
   * @param {number} [filter.maxDistance] - 只保留距离 <= maxDistance 的方块
   * @returns {Array} 处理后的方块数组（带 category 字段）
   */
  getNearbyBlocks(filter = {}) {
    let blocks = this.cache.getBlocks()

    if (filter.category) {
      blocks = blocks.filter(b => b.category === filter.category)
    }
    if (filter.name) {
      blocks = blocks.filter(b => b.name === filter.name)
    }
    if (filter.maxDistance !== undefined) {
      const pos = this.bot.entity.position
      blocks = blocks.filter(b => {
        const dx = b.position.x - pos.x
        const dy = b.position.y - pos.y
        const dz = b.position.z - pos.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        return dist <= filter.maxDistance
      })
    }

    return blocks
  }

  /**
   * 获取危险方块（快捷方法）
   * @returns {Array} category 为 'dangerous' 的方块
   */
  getDangerousBlocks() {
    return this.getNearbyBlocks({ category: 'dangerous' })
  }

  /**
   * 获取资源方块（快捷方法）
   * @returns {Array} category 为 'resource' 的方块
   */
  getResourceBlocks() {
    return this.getNearbyBlocks({ category: 'resource' })
  }

  /**
   * 分类一个方块名称（工具方法）
   * @param {string} blockName - 方块名称
   * @returns {string} 类别（'resource'/'dangerous'/等）
   */
  classifyBlock(blockName) {
    return classifyBlock(blockName)
  }

  // ==================== 实体相关 ====================

  /**
   * 获取附近实体（支持过滤）
   * @param {Object} filter - 过滤条件
   * @param {string} [filter.category] - 按类别过滤（'hostile'/'friendly'/'player'等）
   * @param {string} [filter.type] - 按实体类型过滤（'mob'/'object'/'player'）
   * @param {string} [filter.name] - 按名称过滤
   * @param {number} [filter.maxDistance] - 只保留距离 <= maxDistance 的实体
   * @returns {Array} 处理后的实体数组（带 category 字段）
   */
  getNearbyEntities(filter = {}) {
    let entities = this.cache.getEntities()

    if (filter.category) {
      entities = entities.filter(e => e.category === filter.category)
    }
    if (filter.type) {
      entities = entities.filter(e => e.type === filter.type)
    }
    if (filter.name) {
      entities = entities.filter(e => e.name === filter.name)
    }
    if (filter.maxDistance !== undefined) {
      entities = entities.filter(e => e.distance <= filter.maxDistance)
    }

    return entities
  }

  /**
   * 获取附近敌对生物（快捷方法）
   * @returns {Array} category 为 'hostile' 的实体
   */
  getNearbyEnemies() {
    return this.getNearbyEntities({ category: 'hostile' })
  }

  /**
   * 获取附近友好生物（快捷方法）
   * @returns {Array} category 为 'friendly' 的实体
   */
  getNearbyFriends() {
    return this.getNearbyEntities({ category: 'friendly' })
  }

  /**
   * 获取附近玩家（快捷方法）
   * @returns {Array} category 为 'player' 的实体
   */
  getNearbyPlayers() {
    return this.getNearbyEntities({ category: 'player' })
  }

  /**
   * 分类一个实体（工具方法）
   * @param {string} entityName - 实体名称
   * @param {string} entityType - 实体类型
   * @returns {string} 类别（'hostile'/'friendly'/等）
   */
  classifyEntity(entityName, entityType) {
    return classifyEntity(entityName, entityType)
  }

  // ==================== 环境相关 ====================

  /**
   * 获取环境属性
   * @returns {Object} 环境对象（time, weather, biome, light, difficulty）
   */
  getEnvironmentStatus() {
    return this.cache.getEnvironment()
  }

  // ==================== 空间计算 ====================

  /**
   * 判断 bot 是否在危险方块附近
   * @param {number} radius - 检测半径，默认 3
   * @returns {boolean} true 表示附近有危险方块
   */
  isInDanger(radius = 3) {
    const blocks = this.cache.getBlocks()
    return isInDanger(this.bot, blocks, radius)
  }

  /**
   * 在实体列表中找最近的实体
   * @param {Object} filter - 过滤条件（同 getNearbyEntities）
   * @returns {Object|null} 最近的实体，无结果返回 null
   */
  findNearestEntity(filter = {}) {
    const entities = this.getNearbyEntities(filter)
    const pos = this.bot.entity.position
    return findNearest(entities, pos, filter)
  }

  // ==================== 数据管理 ====================

  /**
   * 强制刷新所有感知数据
   * 下次访问时会重新采集
   */
  update() {
    this.cache.invalidate()
    this.cache.refreshAll()
  }

  /**
   * 兼容性方法：返回完整的扫描结果
   * 保持与原 scan.js 接口兼容
   * @returns {Object} { self, blocks, entities, environment }
   */
  scanEnvironment() {
    return {
      self: this.getSelfStatus(),
      blocks: this.getNearbyBlocks(),
      entities: this.getNearbyEntities(),
      environment: this.getEnvironmentStatus()
    }
  }
}

module.exports = { Perception }
