
const compatibility = require("./device-compatibility");
const policy = require("./connection-policy");
const selector = require("./provider-selector");
const connectionManager = require("./device-connection-manager");
const stateManager = require("./connection-state-manager");
const healthMonitor = require("./connection-health-monitor");
const recoveryManager = require("./connection-recovery-manager");
const eventLog = require("./connection-event-log");

const MODE = "simulation";

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
      internetAccess: false,
      reason: "No verified provider is currently available"
    };
  }

  const connectionResult = connectionManager.requestConnection(
    device,
    providerDecision.providerId,
    options
  );

  if (
    !connectionResult ||
    !connectionResult.connection ||
    !connectionResult.connection.id
  ) {
    return {
      success: false,
      status: "connection_request_failed",
      internetAccess: false,
      reason: "Connection manager did not return a valid connection"
    };
  }

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

  const state = stateManager.getConnection(connectionId);
  const health = healthMonitor.getConnectionHealth(connectionId);
  const recovery = recoveryManager.getRecovery(connectionId);

  return {
    success: true,
    status: "simulated_pending",
    mode: MODE,

    connectionId,
    providerId: providerDecision.providerId,

    providerConfirmed: false,
    internetAccess: false,

    connection: connectionResult.connection,
    state,
    health,
    recovery,

    policy: policy.selectConnectionMethod(assessment, options),

    message:
      "Connection request recorded in simulation mode. No live internet connection has been established."
  };
}

function getConnection(connectionId) {
  const connection = connectionManager.getConnection(connectionId);

  if (!connection) {
    return {
      success: false,
      status: "connection_not_found",
      internetAccess: false
    };
  }

  return {
    success: true,
    mode: MODE,
    connection,
    state: stateManager.getConnection(connectionId),
    health: healthMonitor.getConnectionHealth(connectionId),
    recovery: recoveryManager.getRecovery(connectionId),
    events: eventLog.getConnectionEvents(connectionId),

    providerConfirmed: false,
    internetAccess: false,

    message: "Connection information is from simulation mode."
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
    mode: MODE,
    status: "simulated_disconnected",
    internetAccess: false,
    connection: disconnected.connection,
    state,
    health,
    message:
      "Simulation connection disconnected. No live provider service was changed."
  };
}

module.exports = {
  MODE,
  requestConnection,
  getConnection,
  disconnect
};
    
