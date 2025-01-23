import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Text, Button, AddIcon } from "native-base";
import Card from "./Card";

const AddPrescriptions = () => {
  const navigation = useNavigation();
  const presContentHandler = () => {
    navigation.navigate("PrescriptionContent");
  };
  const navButton = (
    <Button style={styles.ButtonStyle} onPress={presContentHandler}>
      <Text
        style={{
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        <AddIcon style={{ color: "#fff" }} />
      </Text>
    </Button>
  );
  return (
    <Card
      title="Add Prescription"
      description="Save your prescriptions here."
      maxW={980}
      maxH={160}
    >
      {navButton}
    </Card>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    textAlign: "center",
  },
  ButtonStyle: {
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#949dff",
    width: 40,
    height: 40,
    borderRadius: 100,
    // justifyContent: "space-between",
  },
  ButtonTextStyle: {
    color: "#949dff",
    fontWeight: "bold",
  },
});
export default AddPrescriptions;
