import React from "react";
import { SafeAreaView, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const ImgGridView = ({ pics }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      {pics &&
        pics?.map((pic, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              onPress={(e) => {
                navigation.navigate("PreviewImage", {
                  imgId: pic._id,
                  imgName: pic.imageName,
                  uri: pic?.uri,
                });
              }}
            >
              <Image source={{ uri: pic?.uri }} style={styles.ImageStyle} />
            </TouchableOpacity>
          );
        })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ImageStyle: {
    height: 250,
    marginVertical: 10,
    marginLeft: 18,
    marginRight: 18,
    borderRadius: 5,
  },
});

export default ImgGridView;
