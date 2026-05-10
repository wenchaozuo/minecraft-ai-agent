const { setActionStatus, getActionStatus } = require('../status/actionStatus')

async function runAction(bot, actionFn, options = {}) {
  const status = getActionStatus()

  // ===== 1. 忙碌检查 =====
  if (status.isBusy) {
    return { success: false, error: 'bot 正忙' }
  }

  // ===== 2. 设置状态 =====
  setActionStatus({
    currentAction: actionFn.name,
    isBusy: true,
    error: null
  })

  try {
    // ===== 3. 执行真正动作 =====
    const result = await actionFn(bot, options)

    // ===== 4. 成功 =====
    setActionStatus({
      isBusy: false,
      lastResult: 'success'
    })

    return result

  } catch (err) {
    // ===== 5. 失败 =====
    setActionStatus({
      isBusy: false,
      lastResult: 'fail',
      error: err.message
    })

    return { success: false, error: err.message }
  }
}

module.exports = { runAction }