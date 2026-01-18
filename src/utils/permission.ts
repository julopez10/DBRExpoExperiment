import * as Device from "expo-device";
import * as Location from "expo-location";

export async function isLocationAllowedAsync() {
  return await askLocationPermission();
}

export async function isForegroundLocationAllowedAsync() {
  const { status: locationStatus } =
    await Location.getForegroundPermissionsAsync();

  if (locationStatus === "granted") {
    return true;
  }

  return false;
}

export async function isBackgroundLocationAllowedAsync() {
  const { status: locationStatus } =
    await Location.getBackgroundPermissionsAsync();

  if (locationStatus === "granted") {
    return true;
  }

  return false;
}

export const askLocationPermission = async (
  onSuccess?: () => void,
  onFailure?: () => void,
) => {
  let finalStatus = "";
  // iOS Handling

  if (Device.osName === "iOS" || Device.osName === "iPadOS") {
    const { status: locationStatus } =
      await Location.getForegroundPermissionsAsync();
    if (locationStatus !== "granted") {
      const { status } = await Location.requestForegroundPermissionsAsync();
    }
  }

  // Android Handling
  const { status: locationStatus } =
    await Location.getBackgroundPermissionsAsync();
  finalStatus = locationStatus;
  if (locationStatus !== "granted") {
    await Location.requestForegroundPermissionsAsync();

    const { status: locationStatus } =
      await Location.getBackgroundPermissionsAsync();
    if (locationStatus !== "granted") {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      // const { status } = await Location.requestForegroundPermissionsAsync();
      finalStatus = status;
    }
  }

  if (finalStatus !== "granted") {
    const { status: foregroundLocationStatus } =
      await Location.getForegroundPermissionsAsync();
    if (foregroundLocationStatus !== "granted") {
      onFailure && onFailure();
      return false;
    }
  }

  onSuccess && onSuccess();
  return true;
};
