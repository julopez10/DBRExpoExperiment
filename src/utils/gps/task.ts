import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const GPS_SERVICE_TASK_NAME = "DBRGPS";
TaskManager.defineTask(
  GPS_SERVICE_TASK_NAME,
  ({ data, error, executionInfo }) => {
    if (error) {
      // check `error.message` for more details.
      console.error({ error });
      return Promise.resolve(false);
    }

    const { locations } = data as { locations: Location.LocationObject[] };

    console.log("BACKGROUND LOCATION", locations);
    return Promise.resolve(true);
  },
);

export async function taskHandleForegroundAddPosition(
  location: Location.LocationObject,
) {
  console.log("FOREGROUND", location);
}
