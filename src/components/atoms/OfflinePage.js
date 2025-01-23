import React from "react";
import { Container, VStack, Text } from "native-base";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const OfflinePage = () => {
  const handleRefreshButton = () => {
    console.log("offline page");
  };

  return (
    <Container>
      <VStack>
        <Image
          style={styles.OfflineImageStyle}
          source={require("../images/offline.png")}
        />
        <Text style={styles.Heading}>Your device is offline.</Text>
        <Text style={styles.Desc}>
          Make sure your WiFi or mobile connection is on.
        </Text>
        <TouchableOpacity onPress={handleRefreshButton}>
          <Image
            style={styles.RefreshImageStyle}
            source={require("../images/refresh.png")}
          />
        </TouchableOpacity>
      </VStack>
    </Container>
  );
};

const styles = StyleSheet.create({
  OfflineImageStyle: {
    height: 350,
    width: 400,
    alignSelf: "center",
  },
  Heading: {
    fontSize: 20,
    marginTop: 25,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#8e97fd",
    textAlign: "center",
  },
  Desc: {
    color: "#5c5c5c",
    textAlign: "center",
  },
  ButtonStyle: {
    backgroundColor: "#8e97fd",
  },
  RefreshImageStyle: {
    width: 50,
    height: 50,
    marginTop: 16,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 5,
  },
});

export default OfflinePage;
