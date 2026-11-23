const MAX_RETRIES = 3;

const connections = new Map();

function registerRecovery(connectionId, providerId) {
  if (!connectionId || !providerId) {
    throw new Error("Connection ID and provider ID are required");
  }

  if (connections.has(connectionId)) {
    throw new Error("Recovery already registered");
  }

  const recovery = {
    connectionId,
    providerId,
    attempts: 0,
    maxRetries: MAX_RETRIES,
    status: "ready",
    nextRetryAt: null,
    lastFailureReason: null,
    phoneHotspotAllowed: false
  };

  connections.set(connectionId, recovery);

  return { ...recovery };
}

function requestRecovery(connectionId, failureReason) {
  const recovery = connections.get(connectionId);

  if (!recovery) {
    throw new Error("Recovery record not found");
  }

  if (recovery.attempts >= recovery.maxRetries) {
    recovery.status = "retry_limit_reached";

    return {
      success: false,
      recovery: { ...recovery },
      reason: "Maximum recovery attempts reached"
    };
  }

  recovery.attempts += 1;
  recovery.lastFailureReason = failureReason || "Connection interrupted";
  recovery.status = "retry_scheduled";

  const delaySeconds = Math.min(
    30 * Math.pow(2, recovery.attempts - 1),
    300
  );

  recovery.nextRetryAt = new Date(
    Date.now() + delaySeconds * 1000
  ).toISOString();

  return {
    success: true,
    recovery: { ...recovery },
    delaySeconds
  };
}

function completeRecovery(connectionId) {
  const recovery = connections.get(connectionId);

  if (!recovery) {
    throw new Error("Recovery record not found");
  }

  recovery.status = "recovered";
  recovery.nextRetryAt = null;
  recovery.attempts = 0;

  return { ...recovery };
}

function getRecovery(connectionId) {
  const recovery = connections.get(connectionId);
  return recovery ? { ...recovery } : null;
}

function removeRecovery(connectionId) {
  return connections.delete(connectionId);
}

module.exports = {
  MAX_RETRIES,
  registerRecovery,
  requestRecovery,
  completeRecovery,
  getRecovery,
  removeRecovery
};
