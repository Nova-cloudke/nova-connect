const compatibility = require("./device-compatibility");
const policy = require("./connection-policy");
const selector = require("./provider-selector");
const connectionManager = require("./device-connection-manager");
const stateManager = require("./connection-state-manager");
const healthMonitor = require("./connection-health-monitor");
const recoveryManager = require("./connection-recovery-manager");
const eventLog = require("./connection-event-log");

function requestConnection(device, options = {}) {
  if (!device || !device.type) {
    throw new Error("Device information is required");
  }

  const assessment = compatibility.assessDevice(
    device,
    options.providerId || "ast-spacemobile"
  );

  const providerDecision = selector.selectProvider(
    assessment,
    options
  );

  if (!providerDecision || !providerDecision.providerId) {
    return {
      success: false,
      status: "provider_unavailable",
      reason: "No verified provider is currently available"
    };
  }

  const connectionResult = connectionManager.requestConnection(
    device,
    providerDecision.providerId,
    options
  );

  const connectionId = connectionResult.connection.id;

  stateManager.createConnection(
    connectionId,
    providerDecision.providerId
  );

  healthMonitor.registerConnection(
    connectionId,
    providerDecision.providerId
  );

  recoveryManager.registerRecovery(
    connectionId,
    providerDecision.providerId
  );
  return {
    success: true,
    mode: "simulation",
    connectionId,
    providerId: providerDecision.providerId,
    connection: connectionResult.connection,
    state: stateManager.getConnection(connectionId),
    health: healthMonitor.getConnectionHealth(connectionId),
    recovery: recoveryManager.getRecovery(connectionId),
    policy: policy.selectConnectionMethod(assessment, options)
  };
}

function getConnection(connectionId) {
  return {
    connection: connectionManager.getConnection(connectionId),
    state: stateManager.getConnection(connectionId),
    health: healthMonitor.getConnectionHealth(connectionId),
    recovery: recoveryManager.getRecovery(connectionId),
    events: eventLog.getConnectionEvents(connectionId)
  };
}

function disconnect(connectionId) {
  const connection = connectionManager.getConnection(connectionId);

  if (!connection) {
    throw new Error("Connection not found");
  }

  const disconnected = connectionManager.disconnect(connectionId);
  const state = stateManager.disconnect(connectionId);
  const health = healthMonitor.updateConnection(
    connectionId,
    "disconnected"
  );

  eventLog.recordEvent(connectionId, "connection_disconnected", {
    reason: "Orchestrator disconnect"
  });

  return {
    success: true,
    connection: disconnected.connection,
    state,
    health
  };
}

module.exports = {
  requestConnection,
  getConnection,
  disconnect
};
