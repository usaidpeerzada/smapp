import React, { useRef, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Button, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PendingView = () => (
  <View style={styles.pendingContainer}>
    <Text>Waiting for permissions...</Text>
  </View>
);

export default function CameraComponent() {
  const navigation = useNavigation();
  const [type, setType] = useState(CameraType.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const window = Dimensions.get("window");

  useEffect(() => {
    const onChange = ({ window }) => {
      // Handle dimensions change if needed
    };

    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.remove();
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <PendingView />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <Button style={styles.permissionButton} onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      navigation.navigate("PreviewImage", { photo });
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <Button style={styles.captureButton} onPress={takePicture}>
            <Icon
              as={MaterialCommunityIcons}
              name="camera-outline"
              size={8}
              color="white"
            />
          </Button>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-end", // Align children to the bottom
    alignItems: "center", // Center children horizontally
  },
  camera: {
    flex: 1,
    width: "100%", // Ensure the camera view takes the full width of the screen
    height: "100%", // Ensure the camera view takes the full height of the screen
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end", // Ensure the button container is at the bottom
    alignItems: "center", // Center the button horizontally
    marginBottom: 20, // Margin from the bottom edge
  },
  captureButton: {
    backgroundColor: "#949dff",
    color: "#fff",
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#949dff",
    padding: 10,
    borderRadius: 5,
  },
  pendingContainer: {
    flex: 1,
    backgroundColor: "#8e97fd",
    justifyContent: "center",
    alignItems: "center",
  },
});
