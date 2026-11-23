const REQUIRED_FIELDS = [
  "providerId",
  "connectionId",
  "status",
  "confirmationSource",
  "confirmedAt"
];

function verifyConfirmation(response) {
  if (!response || typeof response !== "object") {
    return {
      success: false,
      connected: false,
      status: "awaiting_provider_confirmation",
      reason: "No provider confirmation received"
    };
  }

  const missingFields = REQUIRED_FIELDS.filter(
    field => !response[field]
  );

  if (missingFields.length > 0) {
    return {
      success: false,
      connected: false,
      status: "awaiting_provider_confirmation",
      reason: "Required confirmation fields are missing",
      missingFields
    };
  }

  if (response.simulation === true) {
    return {
      success: false,
      connected: false,
      status: "simulation_rejected",
      reason: "Simulation cannot confirm a real connection"
    };
  }

  if (response.confirmationSource !== "live_provider") {
    return {
      success: false,
      connected: false,
      status: "unverified_confirmation",
      reason: "Confirmation must come from a live provider"
    };
  }

  if (response.status !== "connected") {
    return {
      success: false,
      connected: false,
      status: "provider_not_connected",
      reason: "Provider has not confirmed an active connection"
    };
  }

  if (Number.isNaN(Date.parse(response.confirmedAt))) {
    return {
      success: false,
      connected: false,
      status: "invalid_confirmation",
      reason: "Invalid confirmation timestamp"
    };
  }

  return {
    success: true,
    connected: true,
    status: "provider_confirmed",
    providerId: response.providerId,
    connectionId: response.connectionId,
    confirmedAt: response.confirmedAt
  };
}

module.exports = {
  verifyConfirmation
};
