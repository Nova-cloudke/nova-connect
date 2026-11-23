
const MINIMUM_BATTERY_PERCENT = 30;

function selectConnectionMethod(deviceAssessment, options = {}) {
  if (!deviceAssessment || !deviceAssessment.deviceType) {
    throw new Error("Valid device assessment is required");
  }

  const directCompatible =
    deviceAssessment.directSatelliteCompatibility === "confirmed" &&
    deviceAssessment.providerDeviceSupport === "confirmed";

  // Priority 1: Direct satellite connection
  if (directCompatible) {
    return {
      method: "direct_satellite",
      decision: "approved",
      phoneHotspotRequired: false,
      batteryPolicy: "avoid_phone_hotspot"
    };
  }

  // Priority 2: Hotspot only with explicit permission
  if (
    options.allowPhoneHotspot === true &&
    Number.isFinite(options.phoneBatteryPercent) &&
    options.phoneBatteryPercent >= MINIMUM_BATTERY_PERCENT
  ) {
    return {
      method: "phone_hotspot",
      decision: "user_authorized_fallback",
      phoneHotspotRequired: true,
      batteryPolicy: "monitor_phone_battery"
    };
  }

  // Priority 3: Do not automatically use a phone hotspot
  return {
    method: "alternative_connection_required",
    decision: "direct_support_unverified",
    phoneHotspotRequired: false,
    batteryPolicy: "protect_phone_battery"
  };
}

function getConnectionPriorities() {
  return [
    "direct_satellite",
    "other_direct_device_connection",
    "user_authorized_phone_hotspot"
  ];
}

module.exports = {
  selectConnectionMethod,
  getConnectionPriorities,
  MINIMUM_BATTERY_PERCENT
};
    
