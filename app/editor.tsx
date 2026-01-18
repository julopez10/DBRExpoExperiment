import {
  EnumDrawingLayerId,
  ImageData,
  ImageEditorView,
  ImageManager,
} from "dynamsoft-capture-vision-react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

declare global {
  var originalImage: any;
  var processedDocumentResult: any;
  var normalizedImage: any;
}

export default function Editor() {
  const router = useRouter();
  let editorView = useRef<ImageEditorView>(null);

  useEffect(() => {
    editorView.current!.setOriginalImage(global.originalImage);
    editorView.current!.setQuads(
      global.processedDocumentResult.detectedQuadResultItems?.map(
        (item: any) => item.location,
      ),
      EnumDrawingLayerId.DDN_LAYER_ID,
    );

    return () => {
      if (
        global.originalImage &&
        typeof global.originalImage.release === "function"
      ) {
        global.originalImage.release();
      }
    };
  }, [editorView]);

  const getSelectedQuadAndNormalize = async (): Promise<
    ImageData | null | undefined
  > => {
    const quad = await editorView
      .current!.getSelectedQuad()
      .catch((e) => console.log(e));
    if (quad) {
      return new ImageManager().cropImage(global.originalImage, quad);
    } else {
      console.log("Please select an item");
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.fullScreen}>
      <ImageEditorView style={styles.fullScreen} ref={editorView}>
        <View style={styles.bottomView}>
          <Button
            title={"Normalize"}
            onPress={async () => {
              const normalizedImage = await getSelectedQuadAndNormalize();
              if (normalizedImage) {
                global.normalizedImage = normalizedImage;
                router.push("/normalized-image" as any);
              }
            }}
          />
        </View>
      </ImageEditorView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  bottomView: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
