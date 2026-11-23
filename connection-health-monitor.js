const connections = new Map();

function registerConnection(connectionId, providerId) {
  if (!connectionId || !providerId) {
    throw new Error("Connection ID and provider ID are required");
  }

  if (connections.has(connectionId)) {
    throw new Error("Connection already registered");
  }

  const record = {
    connectionId,
    providerId,
    status: "awaiting_provider_confirmation",
    lastConfirmedAt: null,
    lastStatusUpdate: new Date().toISOString(),
    failureCount: 0,
    reconnectRequired: false
  };

  connections.set(connectionId, record);

  return { ...record };
}

function updateConnection(connectionId, status) {
  const record = connections.get(connectionId);

  if (!record) {
    throw new Error("Connection not found");
  }

  const allowedStatuses = [
    "provider_confirmed",
    "connecting",
    "connected",
    "disconnected",
    "failed"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid connection health status");
  }

  record.status = status;
  record.lastStatusUpdate = new Date().toISOString();

  if (status === "provider_confirmed") {
    record.lastConfirmedAt = record.lastStatusUpdate;
  }

  if (status === "failed" || status === "disconnected") {
    record.failureCount += 1;
    record.reconnectRequired = true;
  }

  if (status === "connected") {
    record.reconnectRequired = false;
  }

  return { ...record };
}

function getConnectionHealth(connectionId) {
  const record = connections.get(connectionId);
  return record ? { ...record } : null;
}

function getAllConnectionHealth() {
  return Array.from(connections.values()).map(record => ({
    ...record
  }));
}

function removeConnection(connectionId) {
  return connections.delete(connectionId);
}

module.exports = {
  registerConnection,
  updateConnection,
  getConnectionHealth,
  getAllConnectionHealth,
  removeConnection
};
