
const compatibility = require("./device-compatibility");
const policy = require("./connection-policy");

const connections = new Map();

function requestConnection(device, providerId, options = {}) {
  const assessment = compatibility.assessDevice(
    device,
    providerId
  );

  const decision = policy.selectConnectionMethod(
    assessment,
    options
  );

  const connection = {
    id: "sim-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
    deviceType: assessment.deviceType,
    deviceModel: assessment.deviceModel,
    providerId,
    connectionMethod: decision.method,
    phoneHotspotRequired: decision.phoneHotspotRequired,
    batteryPolicy: decision.batteryPolicy,
    status: "awaiting_provider_verification",
    mode: "simulation"
  };

  connections.set(connection.id, connection);

  return {
    success: true,
    connection
  };
}

function getConnection(connectionId) {
  const connection = connections.get(connectionId);

  return connection ? { ...connection } : null;
}

function getAllConnections() {
  return Array.from(connections.values()).map(
    connection => ({ ...connection })
  );
}

function disconnect(connectionId) {
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  connection.status = "disconnected";

  return {
    success: true,
    connection: { ...connection }
  };
}

module.exports = {
  requestConnection,
  getConnection,
  getAllConnections,
  disconnect
};
    
