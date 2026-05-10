const actionStatus = {
  currentAction: null,
  isBusy: false,
  lastActionResult: 'success',
  error: null,
}

function setActionStatus(newStatus) {
  Object.assign(actionStatus, newStatus)
}

function getActionStatus() {
  return actionStatus
}

module.exports = {
  actionStatus,
  setActionStatus,
  getActionStatus
}
