function findItem(bot, options = {}) {
  const { name, keywords } = options
  const items = bot.inventory.items()

  if (!items || items.length === 0) return null

  // ===== 精确匹配 =====
  if (name) {
    let item = items.find(i => i.name === name)
    if (item) return item
    // 没精确命中时降级为模糊匹配
    item = items.find(i => i.name.includes(name))
    if (item) return item
    return null
  }

  // ===== 关键词匹配 =====
  if (Array.isArray(keywords)) {
    for (const key of keywords) {

      // 优先完全匹配
      let item = items.find(i => i.name === key)
      if (item) return item

      // 再模糊匹配
      item = items.find(i => i.name.includes(key))
      if (item) return item
    }
  }

  return null
}

module.exports = {
  findItem
}