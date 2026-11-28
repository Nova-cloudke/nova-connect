
const compatibility = require("./device-compatibility");
const policy = require("./connection-policy");
const selector = require("./provider-selector");
const connectionManager = require("./device-connection-manager");
const providerBridge = require("./provider-connection-bridge");

const stateManager = require("./connection-state-manager");
const healthMonitor = require("./connection-health-monitor");
const recoveryManager = require("./connection-recovery-manager");
const eventLog = require("./connection-event-log");

const MODE = "simulation";

const providerServiceLinks = new Map();

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

  let providerService = null;

  // Create a provider service when customer and package details exist.
  if (options.customer && options.packageCode) {
    try {
      const providerResult =
        providerBridge.requestProviderConnection({
          providerId: providerDecision.providerId,
          customer: options.customer,
          packageCode: options.packageCode
        });

      if (!providerResult.success) {
        throw new Error(
          "Provider service request was unsuccessful"
        );
      }

      providerService = providerResult.providerService;

      providerBridge.linkConnection(
        providerService.serviceId,
        connectionId
      );

      providerServiceLinks.set(
        connectionId,
        providerService.serviceId
      );

    } catch (error) {
      connectionManager.disconnect(connectionId);

      return {
        success: false,
        status: "provider_service_request_failed",
        mode: MODE,
        connectionId,
        providerId: providerDecision.providerId,
        internetAccess: false,
        reason: error.message
      };
    }
  }

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

  eventLog.recordEvent(
    connectionId,
    "connection_request_created",
    {
      providerId: providerDecision.providerId,
      providerServiceId: providerService
        ? providerService.serviceId
        : null,
      mode: MODE
    }
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

    providerServiceId: providerService
      ? providerService.serviceId
      : null,

    providerService,

    providerConfirmed: false,
    internetAccess: false,

    connection: connectionResult.connection,
    state,
    health,
    recovery,

    policy: policy.selectConnectionMethod(
      assessment,
      options
    ),

    message: providerService
      ? "Device connection and provider service requests recorded in simulation mode. No live internet connection has been established."
      : "Device connection recorded in simulation mode. Customer and package details are required for a provider service request."
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

  const serviceId = providerServiceLinks.get(connectionId);

  const providerService = serviceId
    ? providerBridge.getProviderConnection(serviceId)
    : null;

  return {
    success: true,
    mode: MODE,

    connection,

    providerService,

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

  const serviceId = providerServiceLinks.get(connectionId);

  let providerDisconnection = null;

  if (serviceId) {
    providerDisconnection =
      providerBridge.disconnectProviderConnection(serviceId);

    if (!providerDisconnection.success) {
      throw new Error(
        "Provider service disconnection failed: " +
        providerDisconnection.reason
      );
    }

    providerServiceLinks.delete(connectionId);
  }

  const disconnected = connectionManager.disconnect(connectionId);

  const state = stateManager.disconnect(connectionId);

  const health = healthMonitor.updateConnection(
    connectionId,
    "disconnected"
  );

  eventLog.recordEvent(
    connectionId,
    "connection_disconnected",
    {
      reason: "Orchestrator disconnect",
      providerServiceId: serviceId || null
    }
  );

  return {
    success: true,
    mode: MODE,
    status: "simulated_disconnected",
    internetAccess: false,

    connection: disconnected.connection,
    providerDisconnection,

    state,
    health,

    message:
      "Simulation connection and associated provider service disconnected. No live provider service was changed."
  };
}

module.exports = {
  MODE,
  requestConnection,
  getConnection,
  disconnect
};
    
