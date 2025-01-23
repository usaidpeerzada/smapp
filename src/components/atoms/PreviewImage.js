import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Button, View, Input, Box, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as MediaLibrary from "expo-media-library";

const PreviewImage = ({ route }) => {
  const { imgId } = route.params;
  const navigation = useNavigation();
  const [getImage] = useState(route.params.photo);
  const [imageFromPresSection] = useState(route?.params?.uri);
  const [incomingImg, setIncomingImg] = useState();
  const [imageName, setImageName] = useState(route.params.imgName);
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const toast = useToast();
  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      // saveImageLocally();
      getUserId();
    }
    return () => {
      isSubscribed = false;
    };
  }, [incomingImg]);
  const getUserId = async () => {
    const idUser = await AsyncStorage.getItem("idOfUser");
    try {
      if (idUser !== null) {
        setUserId(idUser);
      }
    } catch (err) {
      console.log("Did not get userId at PreviewImage: ", err);
    }
  };
  const handleImageName = (name) => {
    setImageName(name);
  };
  const saveImageLocally = async () => {
    try {
      setLoading(true);
      axios
        .post(
          `${apiUrl}/save-pres-image`,
          { userId: userId, uri: getImage?.uri, imageName: imageName },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((res) => {
          setIncomingImg(res.data.image);
          setLoading(false);
          toast.show({
            description: "Prescription has been uploaded.",
          });
          navigation.navigate("PrescriptionContent", {
            incomingImg,
          });
          navigation.navigate("home");
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log("pres not saved: ", err);
    }
  };

  const handleImageDownloadAndroid = async () => {
    try {
      let { status } = await MediaLibrary.requestPermissionsAsync();
      if (status) {
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //   {
        //     title: "SmappCare Storage Permission",
        //     message:
        //       "SmappCare needs access to your storage " +
        //       "so you can download your prescriptions.",
        //     buttonNeutral: "Ask Me Later",
        //     buttonNegative: "Cancel",
        //     buttonPositive: "OK",
        //   }
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const asset = await MediaLibrary.createAssetAsync(imageFromPresSection);
        if (asset) {
          toast.show({
            description: "The prescription has been saved in your camera roll.",
          });
          navigation.navigate("home");
        } else {
          toast.show({
            description: "Prescription not saved, try again.",
          });
        }
      } else {
        Alert.alert(
          "Permission denied",
          "In order to save the image you need to allow the permissions.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.error("save to local error", err);
    }
  };
  const handleImageDownloadIOS = async () => {
    CameraRoll.save(imageFromPresSection).then(
      Alert.alert(
        "Saved.",
        "The prescription has been saved in your camera roll.",
        [{ text: "OK", onPress: () => navigation.navigate("home") }],
        { cancelable: false }
      )
    );
  };
  const handleImageDelete = () => {
    axios
      .delete(`${apiUrl}/delete-pres`, {
        headers: {
          "content-type": "application/json",
        },
        data: {
          id: imgId,
        },
      })
      .then(() => {
        toast.show({
          description: "Prescription has been deleted.",
        });
        navigation.navigate("home");
      })
      .catch((err) => {
        toast.show({
          description: "Cound not delete, try again.",
        });
        __DEV__ && console.log("error deleting prescription: ", err);
      });
  };
  return (
    <Box>
      {getImage ? (
        <Image style={styles.ImageStyle} source={{ uri: getImage?.uri }} />
      ) : imageFromPresSection ? (
        <Image
          style={styles.ImageStyle}
          source={{ uri: imageFromPresSection }}
        />
      ) : route === undefined ? (
        <ActivityIndicator size="large" color="#8e97fd" />
      ) : (
        <ActivityIndicator size="large" color="#8e97fd" />
      )}
      <View floatingLabel style={styles.NameViewStyle}>
        <Text>Name</Text>
        <Input
          placeholder="Name"
          value={imageName}
          onChangeText={(text) => handleImageName(text)}
          selectionColor="#8e97fd"
        />
      </View>
      <View style={styles.ViewStyle}>
        {getImage ? (
          <>
            <Button
              style={styles.ButtonStyle}
              isLoading={loading}
              onPress={saveImageLocally}
            >
              <Text style={styles.TextStyle}>Upload</Text>
            </Button>
            {/* <Button style={styles.ButtonStyle} onPress={handleImageDownload}>
                <Text style={styles.TextStyle}>Download</Text>
              </Button> */}
          </>
        ) : (
          <>
            {Platform.OS === "ios" ? (
              <Button
                style={styles.ButtonStyle}
                onPress={handleImageDownloadIOS}
              >
                <Text style={styles.TextStyle}>Download</Text>
              </Button>
            ) : (
              <Button
                style={styles.ButtonStyle}
                onPress={handleImageDownloadAndroid}
              >
                <Text style={styles.TextStyle}>Download</Text>
              </Button>
            )}
            <Button
              danger
              style={styles.DeleteButtonStyle}
              onPress={handleImageDelete}
            >
              <Text style={styles.TextStyle}>Delete</Text>
            </Button>
          </>
        )}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  ImageStyle: {
    height: 350,
    width: 350,
    marginLeft: 18,
    marginTop: 8,
    marginRight: 18,
    alignSelf: "center",
    borderRadius: 5,
  },
  ButtonStyle: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 0,
    padding: 16,
    backgroundColor: "#8e97fd",
  },
  DeleteButtonStyle: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 0,
    padding: 18,
    backgroundColor: "red",
  },
  ViewStyle: {
    borderColor: "transparent",
    marginTop: 25,
  },
  NameViewStyle: {
    marginTop: 18,
    marginLeft: 18,
    marginRight: 18,
  },
  TextStyle: {
    color: "#fff",
    fontWeight: "bold",
  },
  IndicatorViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  IndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
});
export default PreviewImage;
