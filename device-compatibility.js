
const registry = require("./provider-registry");
const capabilities = require("./provider-capabilities");

function assessDevice(device, providerId) {
  if (!device || !device.type || !device.model) {
    throw new Error("Device type and model are required");
  }

  const provider = registry.getProvider(providerId);
  const details = capabilities.getCapabilities(providerId);

  if (!provider || !details) {
    throw new Error("Unknown provider");
  }

  const supportedTypes = ["smartphone", "laptop"];

  if (!supportedTypes.includes(device.type)) {
    throw new Error("Unsupported device type");
  }

  return {
    deviceType: device.type,
    deviceModel: device.model,
    providerId,
    providerName: provider.name,
    directSatelliteCompatibility: "unknown",
    providerDeviceSupport: "unverified",
    verificationRequired: true,
    connectionPriority: "direct_device_connectivity"
  };
}

module.exports = {
  assessDevice
};
