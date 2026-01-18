import * as Location from "expo-location";
import { askLocationPermission } from "../permission";
import { GPS_SERVICE_TASK_NAME, taskHandleForegroundAddPosition } from "./task";

export const GPS_MINIMUM_SPEED = __DEV__ ? 0 : 0.25;
export const GPS_DEFERRED_UPDATES_DISTANCE = 1000; // __DEV__ ? 0 : 10;
export const GPS_DEFERRED_UPDATES_INTERVAL = 300000; // 5 minutes interval in between updates
export const GPS_TIME_INTERVAL = 50000;
export const TEMP_GPS_MAX_BUFFER_SIZE = 10;

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

export async function hasStartedLocationUpdatesAsync() {
  return await Location.hasStartedLocationUpdatesAsync(GPS_SERVICE_TASK_NAME);
}

export async function startLocationUpdatesAsync() {
  await Location.startLocationUpdatesAsync(GPS_SERVICE_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    activityType: Location.ActivityType.AutomotiveNavigation,
    showsBackgroundLocationIndicator: true,
    pausesUpdatesAutomatically: true,

    // deferredUpdatesDistance: GPS_DEFERRED_UPDATES_DISTANCE,
    deferredUpdatesInterval: GPS_TIME_INTERVAL,
    timeInterval: GPS_TIME_INTERVAL,

    foregroundService: {
      notificationTitle: "DBR is running",
      notificationBody:
        "DBR is tracking your current location in the background",
    },
    // deferredUpdatesTimeout: GPS_DEFERRED_UPDATES_INTERVAL,
  });
}

export async function watchPositionAsync() {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      // activityType: Location.ActivityType.AutomotiveNavigation,
      // showsBackgroundLocationIndicator: true,
      // deferredUpdatesDistance: GPS_DEFERRED_UPDATES_DISTANCE,
      // deferredUpdatesInterval: GPS_DEFERRED_UPDATES_INTERVAL,
      // distanceInterval: 0,
      timeInterval: GPS_DEFERRED_UPDATES_INTERVAL,
      // foregroundService: {
      //   notificationTitle: 'Doc-Mate is running',
      //   notificationBody:
      //     'Doc-Mate is tracking your current location in the background',
      // },
    },
    taskHandleForegroundAddPosition,
  );
}

export async function getInitialLocationAsync() {
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
  });
}

export async function getLastKnownPositionAsync() {
  return await Location.getLastKnownPositionAsync({ requiredAccuracy: 1000 });
}
export async function stopLocationUpdatesAsync() {
  await Location.stopLocationUpdatesAsync(GPS_SERVICE_TASK_NAME);
}
