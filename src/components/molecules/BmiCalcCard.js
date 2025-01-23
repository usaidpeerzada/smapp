import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Button, Input } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Card from "./Card";
import { useToast } from "native-base";

const BmiCalcCard = (props) => {
  const navigation = useNavigation();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const toast = useToast();

  const getBmiResults = () => {
    if (!weight || !height) {
      toast.show({
        description: "Both fields are mandatory.",
      });
      return;
    }

    let userBmi = weight / (height * height);
    let roundedBmi = userBmi.toFixed(2);

    navigation.navigate("BmiResult", {
      roundedBmi,
    });
    setWeight("");
    setHeight("");
  };

  return (
    <Card
      title="BMI Calculator"
      description="Check your BMI by adding weight and height."
      addSpace={true}
    >
      <Input
        variant="outline"
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={(e) => setWeight(e)}
        keyboardType="numeric"
        selectionColor="#949dff"
        borderColor="#949dff"
        focusOutlineColor="#949dff"
        placeholderTextColor="#949dff"
      />
      <Input
        variant="outline"
        placeholder="Height (m)"
        value={height}
        onChangeText={(e) => setHeight(e)}
        keyboardType="numeric"
        selectionColor="#949dff"
        borderColor="#949dff"
        placeholderTextColor="#949dff"
      />
      <Button style={styles.ButtonStyle} onPress={getBmiResults}>
        <Text style={{ color: "#fff" }}>Calculate</Text>
      </Button>
    </Card>
  );
};

const styles = StyleSheet.create({
  ButtonStyle: {
    marginTop: 15,
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#949dff",
    borderRadius: 100,
    justifyContent: "space-between",
  },
});

export default BmiCalcCard;
