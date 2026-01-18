import { LicenseManager } from "dynamsoft-capture-vision-react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "../src/utils/gps/location";
import { isLocationAllowedAsync } from "../src/utils/permission";

declare global {
  var originalImage: any;
  var processedDocumentResult: any;
  var normalizedImage: any;
}

export default function Index() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [locationTrackingOn, setLocationTrackingOn] = useState(false);

  const initLicense = () =>
    LicenseManager.initLicense("").catch((e) => {
      console.log("Init license failed. Error: " + e.message);
      setError("Init license failed. \nError: " + e.message);
    });

  initLicense().then(/*no-op*/);

  useEffect(() => {
    (async () => {
      const hasStartedLocationUpdates = await hasStartedLocationUpdatesAsync();
      setLocationTrackingOn(hasStartedLocationUpdates);
    })();
  }, []);

  const runLocationTracking = async () => {
    const isLocationAllowed = await isLocationAllowedAsync();

    if (isLocationAllowed) {
      await startLocationUpdatesAsync();
      setLocationTrackingOn(true);
    }
  };

  const stopLocationTracking = async () => {
    const hasStartedLocationUpdates = await hasStartedLocationUpdatesAsync();
    if (hasStartedLocationUpdates) {
      await stopLocationUpdatesAsync();
      setLocationTrackingOn(false);
    }
  };

  return (
    <View style={styles.contentView}>
      <Button
        title={"Scan a Document"}
        onPress={() => router.push("/scanner" as any)}
      />
      <Button title={"Start Location Tracking"} onPress={runLocationTracking} />
      <Button title={"Stop Location Tracking"} onPress={stopLocationTracking} />
      <Text style={styles.errorText}>{error}</Text>
      <Text>{locationTrackingOn ? "TRACKING ON" : "TRACKING OFF"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: "red", margin: 20, fontSize: 16 },
});
