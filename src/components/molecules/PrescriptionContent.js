import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Text,
  AddIcon,
  ScrollView,
  useToast,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ImgGridView from "../atoms/ImgGridView";

const PrescriptionContent = () => {
  const navigation = useNavigation();
  const [clickedImage, setClickedImage] = useState();
  const [userId, setUserId] = useState();
  const toast = useToast();
  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      getUserId();
      getSavedImages();
    }
    return () => {
      subscribed = false;
    };
  }, [userId]);
  const openCamera = () => {
    navigation.navigate("CameraComponent");
  };
  const getUserId = async () => {
    const idUser = await AsyncStorage.getItem("idOfUser");
    try {
      if (idUser !== null && idUser !== undefined) {
        setUserId(idUser);
      }
    } catch (error) {
      console.log("did not get userId in Img Grid: ", error);
    }
  };
  const getSavedImages = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    let url = `${apiUrl}/get-pres-images`;
    if (userId !== null && userId !== undefined) {
      await axios
        .get(url, {
          params: {
            userId: userId,
          },
        })
        .then((res) => {
          console.log(res.data);
          setClickedImage(res.data);
        })
        .catch((err) => {
          __DEV__ && console.log("error getting saved prescriptions: ", err);
          toast.show({
            description: "Error getting saved prescriptions.",
          });
        });
    }
  };
  return (
    <ScrollView>
      <Box
        style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth={1}
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={styles.ItemStyle}>
          <Button style={{ backgroundColor: "#8e97fd" }} onPress={openCamera}>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              <AddIcon style={{ color: "#fff" }} />
            </Text>
          </Button>
        </View>
        {clickedImage && clickedImage.length > 0 ? (
          <>
            <View style={styles.TextItemStyle}>
              <Text style={styles.TextStyle}>Your Saved Prescriptions:</Text>
            </View>
            <ImgGridView pics={clickedImage} />
          </>
        ) : clickedImage && clickedImage.length !== 1 ? (
          <>
            <Image
              source={require("../images/pres.png")}
              style={styles.NoSavedImg}
            />
            <Text style={styles.NoSavedHeading}>
              You don't have saved prescriptions.
            </Text>
          </>
        ) : (
          <View style={styles.IndicatorViewStyle}>
            <ActivityIndicator
              style={styles.IndicatorStyle}
              size="large"
              color="#8e97fd"
            />
          </View>
        )}
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ItemStyle: {
    marginTop: 20,
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
    borderColor: "transparent",
  },
  ImageCardStyle: {
    marginRight: 18,
    marginLeft: 18,
  },
  TextItemStyle: {
    borderColor: "transparent",
    marginBottom: 10,
    justifyContent: "center",
  },
  TextStyle: {
    marginLeft: 16,
    fontWeight: "bold",
    color: "#8e97fd",
  },
  NoPresMsg: {
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "bold",
    color: "#8e97fd",
  },
  IndicatorViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 70,
  },
  IndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  NoSavedHeading: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "bold",
    color: "#8e97fd",
  },
  NoSavedImg: {
    width: 250,
    height: 250,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 1,
  },
});

export default PrescriptionContent;
