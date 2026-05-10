/**
 * 方块分类表 - 按用途对方块分组
 * 用于在感知层为每个方块标注语义类别，方便决策层快速筛选
 *
 * resource:   可采集的资源（木材、石头、矿物、沙土等）
 * dangerous:  对 bot 有危险的方块（岩浆、水、仙人掌、火等）
 * interactive: 可交互的方块（点击打开/使用，如箱子、工作台、门等）
 * building:   常用建筑材料（木板、石砖、楼梯、玻璃等）
 * plant:      植物类方块（树叶、花草、农作物等）
 * other:      未归入以上类别的方块（通过 classifyBlock 返回）
 */
const BLOCK_CATEGORIES = {
  resource: [
    // === 木材类（8种木材 x 基础类型）===
    // 原木
    'oak_log', 'spruce_log', 'birch_log', 'acacia_log', 'jungle_log',
    'dark_oak_log', 'mangrove_log', 'cherry_log', 'crimson_stem', 'warped_stem',
    // 去皮原木
    'stripped_oak_log', 'stripped_spruce_log', 'stripped_birch_log', 'stripped_acacia_log',
    'stripped_jungle_log', 'stripped_dark_oak_log', 'stripped_mangrove_log', 'stripped_cherry_log',
    'stripped_crimson_stem', 'stripped_warped_stem',
    // 木（带树皮的木）
    'oak_wood', 'spruce_wood', 'birch_wood', 'acacia_wood', 'jungle_wood',
    'dark_oak_wood', 'mangrove_wood', 'cherry_wood',
    // 去皮木
    'stripped_oak_wood', 'stripped_spruce_wood', 'stripped_birch_wood', 'stripped_acacia_wood',
    'stripped_jungle_wood', 'stripped_dark_oak_wood', 'stripped_mangrove_wood', 'stripped_cherry_wood',
    // 木板
    'oak_planks', 'spruce_planks', 'birch_planks', 'acacia_planks', 'jungle_planks',
    'dark_oak_planks', 'mangrove_planks', 'cherry_planks', 'crimson_planks', 'warped_planks',
    // 树苗
    'oak_sapling', 'spruce_sapling', 'birch_sapling', 'acacia_sapling', 'jungle_sapling',
    'dark_oak_sapling', 'mangrove_sapling', 'cherry_sapling',

    // === 石头类 ===
    'stone', 'cobblestone', 'granite', 'diorite', 'andesite',
    'deepslate', 'tuff', 'calcite', 'blackstone', 'basalt',
    'smooth_basalt', 'polished_basalt', 'polished_blackstone',
    'end_stone', 'end_stone_bricks', 'purpur_block', 'purpur_pillar',

    // === 矿物（原矿）===
    'iron_ore', 'coal_ore', 'gold_ore', 'diamond_ore', 'emerald_ore',
    'copper_ore', 'lapis_ore', 'redstone_ore',
    // 深板岩矿物
    'deepslate_iron_ore', 'deepslate_coal_ore', 'deepslate_gold_ore',
    'deepslate_diamond_ore', 'deepslate_emerald_ore', 'deepslate_copper_ore',
    'deepslate_lapis_ore', 'deepslate_redstone_ore',
    // 下界矿物
    'nether_gold_ore', 'nether_quartz_ore', 'ancient_debris',

    // === 矿物块（精炼后）===
    'iron_block', 'gold_block', 'diamond_block', 'emerald_block', 'copper_block',
    'lapis_block', 'redstone_block', 'netherite_block', 'coal_block',
    'raw_iron_block', 'raw_copper_block', 'raw_gold_block',

    // === 沙土类 ===
    'sand', 'red_sand', 'dirt', 'grass_block', 'coarse_dirt',
    'rooting_dirt', 'podzol', 'gravel', 'clay', 'sandstone', 'red_sandstone',
    'dirt_path', 'mud', 'packed_mud', 'mud_bricks', 'mycelium',

    // === 下界方块 ===
    'netherrack', 'soul_sand', 'soul_soil', 'gilded_blackstone',

    // === 末地方块 ===
    'end_stone', 'end_stone_bricks'
  ],

  dangerous: [
    // 液体/流体
    'lava', 'water', 'flowing_lava', 'flowing_water',
    // 伤害性方块
    'cactus', 'magma_block', 'fire', 'soul_fire',
    'sweet_berry_bush', 'wither_rose',
    // 热源
    'campfire', 'soul_campfire', 'lava_cauldron', 'lit_campfire', 'lit_soul_campfire',
    // 陷阱/其他
    'powder_snow', 'ice', 'blue_ice', 'packed_ice', 'frosted_ice',
    'cobweb', 'magma', 'fire_charge'
  ],

  interactive: [
    // === 存储/制作 ===
    'chest', 'trapped_chest', 'crafting_table', 'furnace', 'blast_furnace',
    'smoker', 'enchanting_table', 'anvil', 'chipped_anvil', 'damaged_anvil',
    'brewing_stand', 'beacon', 'smithing_table', 'grindstone', 'cartography_table',
    'loom', 'stonecutter', 'fletching_table', 'barrel', 'shulker_box', 'ender_chest',
    // === 红石/机械 ===
    'lever', 'stone_button', 'wooden_button', 'pressure_plate', 'stone_pressure_plate',
    'weighted_pressure_plate', 'tripwire_hook', 'repeater', 'comparator',
    'redstone_torch', 'redstone_lamp', 'piston', 'sticky_piston',
    'dispenser', 'dropper', 'observer', 'target', 'redstone_block',
    // === 门/栅栏/活板门 ===
    'oak_door', 'iron_door', 'spruce_door', 'birch_door', 'acacia_door',
    'jungle_door', 'dark_oak_door', 'mangrove_door', 'cherry_door',
    'trapdoor', 'iron_trapdoor', 'oak_trapdoor', 'spruce_trapdoor', 'birch_trapdoor',
    'acacia_trapdoor', 'jungle_trapdoor', 'dark_oak_trapdoor', 'mangrove_trapdoor',
    'fence_gate', 'oak_fence_gate', 'spruce_fence_gate', 'birch_fence_gate',
    'acacia_fence_gate', 'jungle_fence_gate', 'dark_oak_fence_gate',
    // === 其他交互方块 ===
    'note_block', 'jukebox', 'daylight_detector', 'hopper',
    'lodestone', 'respawn_anchor', 'chain',
    'lantern', 'soul_lantern', 'torch', 'soul_torch', 'end_rod',
    'bell', 'bed', 'white_bed', 'orange_bed', 'magenta_bed', 'light_blue_bed',
    'yellow_bed', 'lime_bed', 'pink_bed', 'gray_bed', 'light_gray_bed',
    'cyan_bed', 'purple_bed', 'blue_bed', 'brown_bed', 'green_bed', 'red_bed', 'black_bed'
  ],

  building: [
    // === 基础建材 ===
    'oak_planks', 'spruce_planks', 'birch_planks', 'acacia_planks', 'jungle_planks',
    'dark_oak_planks', 'mangrove_planks', 'cherry_planks', 'crimson_planks', 'warped_planks',
    'stone_bricks', 'bricks', 'deepslate_bricks', 'deepslate_tiles',
    'polished_blackstone', 'polished_blackstone_bricks',
    'cobblestone', 'mossy_cobblestone', 'chiseled_stone_bricks', 'cracked_stone_bricks',

    // === 混凝土（16色）===
    'white_concrete', 'orange_concrete', 'magenta_concrete', 'light_blue_concrete',
    'yellow_concrete', 'lime_concrete', 'pink_concrete', 'gray_concrete',
    'light_gray_concrete', 'cyan_concrete', 'purple_concrete', 'blue_concrete',
    'brown_concrete', 'green_concrete', 'red_concrete', 'black_concrete',

    // === 陶瓦（16色）===
    'white_terracotta', 'orange_terracotta', 'magenta_terracotta', 'light_blue_terracotta',
    'yellow_terracotta', 'lime_terracotta', 'pink_terracotta', 'gray_terracotta',
    'light_gray_terracotta', 'cyan_terracotta', 'purple_terracotta', 'blue_terracotta',
    'brown_terracotta', 'green_terracotta', 'red_terracotta', 'black_terracotta',

    // === 带釉陶瓦（16色）===
    'white_glazed_terracotta', 'orange_glazed_terracotta', 'magenta_glazed_terracotta',
    'light_blue_glazed_terracotta', 'yellow_glazed_terracotta', 'lime_glazed_terracotta',
    'pink_glazed_terracotta', 'gray_glazed_terracotta', 'light_gray_glazed_terracotta',
    'cyan_glazed_terracotta', 'purple_glazed_terracotta', 'blue_glazed_terracotta',
    'brown_glazed_terracotta', 'green_glazed_terracotta', 'red_glazed_terracotta',
    'black_glazed_terracotta',

    // === 羊毛（16色）===
    'white_wool', 'orange_wool', 'magenta_wool', 'light_blue_wool',
    'yellow_wool', 'lime_wool', 'pink_wool', 'gray_wool',
    'light_gray_wool', 'cyan_wool', 'purple_wool', 'blue_wool',
    'brown_wool', 'green_wool', 'red_wool', 'black_wool',

    // === 地毯（16色）===
    'white_carpet', 'orange_carpet', 'magenta_carpet', 'light_blue_carpet',
    'yellow_carpet', 'lime_carpet', 'pink_carpet', 'gray_carpet',
    'light_gray_carpet', 'cyan_carpet', 'purple_carpet', 'blue_carpet',
    'brown_carpet', 'green_carpet', 'red_carpet', 'black_carpet',

    // === 楼梯 ===
    'oak_stairs', 'stone_stairs', 'cobblestone_stairs', 'brick_stairs',
    'stone_brick_stairs', 'nether_brick_stairs', 'spruce_stairs', 'birch_stairs',
    'jungle_stairs', 'acacia_stairs', 'dark_oak_stairs', 'mangrove_stairs',
    'prismarine_stairs', 'dark_prismarine_stairs', 'prismarine_brick_stairs',

    // === 台阶 ===
    'oak_slab', 'stone_slab', 'cobblestone_slab', 'brick_slab',
    'stone_brick_slab', 'nether_brick_slab', 'spruce_slab', 'birch_slab',
    'jungle_slab', 'acacia_slab', 'dark_oak_slab', 'mangrove_slab',

    // === 墙 ===
    'cobblestone_wall', 'stone_brick_wall', 'mossy_cobblestone_wall',
    'mossy_stone_brick_wall', 'nether_brick_wall', 'red_nether_brick_wall',
    'blackstone_wall', 'polished_blackstone_wall', 'cobbled_deepslate_wall',
    'deepslate_brick_wall', 'deepslate_tile_wall',

    // === 栅栏 ===
    'oak_fence', 'spruce_fence', 'birch_fence', 'acacia_fence', 'jungle_fence',
    'dark_oak_fence', 'mangrove_fence', 'nether_brick_fence', 'blackstone_fence',
    'polished_blackstone_fence',

    // === 玻璃（16色）===
    'glass', 'white_stained_glass', 'orange_stained_glass', 'magenta_stained_glass',
    'light_blue_stained_glass', 'yellow_stained_glass', 'lime_stained_glass',
    'pink_stained_glass', 'gray_stained_glass', 'light_gray_stained_glass',
    'cyan_stained_glass', 'purple_stained_glass', 'blue_stained_glass',
    'brown_stained_glass', 'green_stained_glass', 'red_stained_glass', 'black_stained_glass',
    // 玻璃板
    'glass_pane', 'white_stained_glass_pane', 'orange_stained_glass_pane',
    'magenta_stained_glass_pane', 'light_blue_stained_glass_pane',
    'yellow_stained_glass_pane', 'lime_stained_glass_pane', 'pink_stained_glass_pane',
    'gray_stained_glass_pane', 'light_gray_stained_glass_pane',
    'cyan_stained_glass_pane', 'purple_stained_glass_pane', 'blue_stained_glass_pane',
    'brown_stained_glass_pane', 'green_stained_glass_pane', 'red_stained_glass_pane',
    'black_stained_glass_pane'
  ],

  plant: [
    // === 树叶（8种木材）===
    'oak_leaves', 'spruce_leaves', 'birch_leaves', 'acacia_leaves', 'jungle_leaves',
    'dark_oak_leaves', 'mangrove_leaves', 'cherry_leaves',
    'azalea_leaves', 'flowering_azalea_leaves',

    // === 草和蕨 ===
    'grass', 'tall_grass', 'fern', 'large_fern',
    'seagrass', 'sea_pickle', 'kelp', 'kelp_plant', 'glow_lichen', 'moss_carpet', 'moss_block',

    // === 花（常见）===
    'dandelion', 'poppy', 'blue_orchid', 'allium', 'azure_bluet',
    'red_tulip', 'orange_tulip', 'white_tulip', 'pink_tulip',
    'oxeye_daisy', 'cornflower', 'lily_of_the_valley', 'wither_rose',
    'sunflower', 'lilac', 'rose_bush', 'peony',
    'lily_pad', 'vine', 'glow_lichen',

    // === 农作物 ===
    'wheat', 'carrots', 'potatoes', 'beetroots', 'sugar_cane', 'bamboo',
    'pumpkin', 'melon', 'pumpkin_stem', 'melon_stem',
    'nether_wart', 'chorus_plant', 'chorus_flower',

    // === 下界植物 ===
    'crimson_roots', 'warped_roots', 'nether_sprouts',
    'weeping_vines', 'twisting_vines', 'crimson_fungi', 'warped_fungi',

    // === 其他植物 ===
    'sweet_berry_bush', 'cave_vines', 'glow_berries', 'spore_blossom',
    'big_dripleaf', 'small_dripleaf', 'hanging_roots', 'pointed_dripstone'
  ]
}

/**
 * 判断方块属于哪个类别
 * 遍历 BLOCK_CATEGORIES 分类表，匹配方块名称
 *
 * @param {string} blockName - 方块内部名称（如 'oak_log'、'lava'）
 * @returns {string} 类别名称：'resource' | 'dangerous' | 'interactive' | 'building' | 'plant' | 'other'
 */
function classifyBlock(blockName) {
  for (const [category, names] of Object.entries(BLOCK_CATEGORIES)) {
    if (names.includes(blockName)) return category
  }
  return 'other'  // 未匹配到任何分类时返回 'other'
}

/**
 * 过滤方块数组
 * 根据过滤条件筛选方块，支持按类别、名称过滤，默认排除空气方块
 *
 * @param {Array} blocks - 已分类的方块数组（需包含 category 字段）
 * @param {Object} filter - 过滤条件
 * @param {string} [filter.category] - 按类别过滤（如 'resource'、'dangerous'）
 * @param {string} [filter.name] - 按方块名称精确匹配（如 'oak_log'）
 * @param {boolean} [filter.excludeAir=true] - 是否排除空气方块
 * @returns {Array} 过滤后的方块数组（不改变原数组）
 */
function filterBlocks(blocks, filter = {}) {
  let result = [...blocks]  // 浅拷贝，避免修改原数组

  if (filter.category) {
    result = result.filter(b => b.category === filter.category)
  }
  if (filter.name) {
    result = result.filter(b => b.name === filter.name)
  }
  if (filter.excludeAir !== false) {
    result = result.filter(b => b.name !== 'air')
  }

  return result
}

/**
 * 处理原始方块数据（主函数）
 * 1. 为每个方块添加 category 字段（调用 classifyBlock）
 * 2. 应用过滤条件，返回筛选后的结果
 *
 * @param {Array} rawBlocks - collectBlocks() 返回的原始方块数组
 *                           每个元素包含: { name, position, boundingBox }
 * @param {Object} filter - 过滤条件（同 filterBlocks 的 filter 参数）
 * @param {string} [filter.category] - 按类别过滤
 * @param {string} [filter.name] - 按名称过滤
 * @returns {Array} 处理后的方块数组，每个元素包含:
 *   - name: 方块名称
 *   - position: Vec3 坐标对象
 *   - boundingBox: 碰撞箱类型
 *   - category: 方块类别（新增字段）
 */
function processBlocks(rawBlocks, filter = {}) {
  // 为每个方块添加分类信息
  let blocks = rawBlocks.map(b => ({
    ...b,
    category: classifyBlock(b.name)  // 新增 category 字段
  }))

  // 应用过滤条件
  return filterBlocks(blocks, filter)
}

module.exports = { processBlocks, classifyBlock, filterBlocks, BLOCK_CATEGORIES }
