const confirmationGate = require("./provider-confirmation-gate");

const connections = new Map();

const STATES = {
  AWAITING: "awaiting_provider_confirmation",
  CONFIRMED: "provider_confirmed",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  FAILED: "failed"
};

function createConnection(connectionId, providerId) {
  if (!connectionId || !providerId) {
    throw new Error("Connection ID and provider ID are required");
  }

  if (connections.has(connectionId)) {
    throw new Error("Connection already exists");
  }

  const connection = {
    connectionId,
    providerId,
    state: STATES.AWAITING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  connections.set(connectionId, connection);

  return { ...connection };
}

function confirmConnection(connectionId, providerResponse) {
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  const result = confirmationGate.verifyConfirmation(providerResponse);

  if (!result.success || result.connectionId !== connectionId ||
      result.providerId !== connection.providerId) {
    connection.state = STATES.FAILED;
    connection.updatedAt = new Date().toISOString();

    return {
      success: false,
      connection: { ...connection },
      reason: result.reason || "Provider confirmation does not match"
    };
  }

  connection.state = STATES.CONFIRMED;
  connection.confirmedAt = result.confirmedAt;
  connection.updatedAt = new Date().toISOString();

  return {
    success: true,
    connection: { ...connection }
  };
}

function startConnecting(connectionId) {
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  if (connection.state !== STATES.CONFIRMED) {
    throw new Error("Provider confirmation required before connecting");
  }

  connection.state = STATES.CONNECTING;
  connection.updatedAt = new Date().toISOString();

  return { ...connection };
}

function markConnected(connectionId) {
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  if (connection.state !== STATES.CONNECTING) {
    throw new Error("Connection must be connecting first");
  }

  connection.state = STATES.CONNECTED;
  connection.updatedAt = new Date().toISOString();

  return { ...connection };
}

function disconnect(connectionId) {
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  connection.state = STATES.DISCONNECTED;
  connection.updatedAt = new Date().toISOString();

  return { ...connection };
}

function getConnection(connectionId) {
  const connection = connections.get(connectionId);
  return connection ? { ...connection } : null;
}

function getAllConnections() {
  return Array.from(connections.values()).map(connection => ({
    ...connection
  }));
}

module.exports = {
  STATES,
  createConnection,
  confirmConnection,
  startConnecting,
  markConnected,
  disconnect,
  getConnection,
  getAllConnections
};
