import {
  ImageManager,
  imageDataToBase64,
} from "dynamsoft-capture-vision-react-native";
import { Paths } from "expo-file-system";
import React, { useEffect } from "react";
import { Alert, Button, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NormalizedImage() {
  const base64Str = imageDataToBase64(global.normalizedImage);

  useEffect(() => {
    return () => {
      if (
        global.normalizedImage &&
        typeof global.normalizedImage.release === "function"
      ) {
        global.normalizedImage.release();
      }
    };
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={{ uri: "data:image/png;base64," + base64Str }}
        style={styles.fullScreen}
        resizeMode="contain"
      />
      <Button
        title={"Save to file"}
        onPress={() => {
          const imageManager = new ImageManager();
          let savedPath = Paths.cache.uri + "/normalize.png";
          imageManager.saveToFile(global.normalizedImage, savedPath, true);
          Alert.alert("Success", "Has been saved to " + savedPath);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 0.9 },
});
