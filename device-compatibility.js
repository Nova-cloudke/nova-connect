const registry = require("./provider-registry");

const supportedDeviceTypes = [
  "smartphone",
  "laptop"
];

function assessDevice(device, providerId) {
  if (!device || !device.type || !device.model) {
    throw new Error("Complete device information is required");
  }

  if (!supportedDeviceTypes.includes(device.type)) {
    throw new Error("Unsupported device type: " + device.type);
  }

  const provider = registry.getProvider(providerId);

  if (!provider) {
    throw new Error("Unknown provider: " + providerId);
  }

  const isD2D = provider.providerType === "satellite_d2d";

  return {
    deviceType: device.type,
    deviceModel: device.model,
    providerId: provider.id,
    providerName: provider.name,

    directSatelliteCompatibility: isD2D
      ? "unknown"
      : "not_applicable",

    providerDeviceSupport: "unverified",

    connectionPriority: "direct_device_connectivity",

    mode: "simulation",
    verified: false
  };
}

module.exports = {
  assessDevice
};
