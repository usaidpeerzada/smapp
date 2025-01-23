import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Box,
  View,
} from "native-base";
import Card from "./Card";

const BmiResult = ({ route }) => {
  const { roundedBmi } = route.params;
  const [bmiInterpretations, setBmiInterpretations] = useState("");
  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      bmiValueInterpretations(roundedBmi);
    }
    return () => {
      subscribed = false;
    };
  }, [roundedBmi]);
  const bmiValueInterpretations = (bmiVal) => {
    if (bmiVal >= 25) {
      setBmiInterpretations(
        "You have a higher than normal weight. Do some exercise."
      );
    } else if (bmiVal >= 18.5) {
      setBmiInterpretations("You have a normal body weight.");
    } else {
      setBmiInterpretations("You have a lower than normal weight! Eat more!");
    }
  };
  return (
    <Box
      style={{ margin: 15 }}
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
      <View style={styles.viewStyle}>
        {bmiInterpretations === "You have a normal body weight." ? (
          <Text
            style={{
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            NORMAL
          </Text>
        ) : bmiInterpretations ===
          "You have a higher than normal weight. Do some exercise." ? (
          <Text
            style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
          >
            OVERWEIGHT
          </Text>
        ) : bmiInterpretations ===
          "You have a lower than normal weight! Eat more!" ? (
          <Text
            style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
          >
            UNDERWEIGHT
          </Text>
        ) : (
          <Text></Text>
        )}
      </View>
      <Text style={styles.BmiNumberStyle} fontSize="4xl">
        {roundedBmi}
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          color: "#8e97fd",
          fontSize: 18,
          textAlign: "center",
          margin: 10,
        }}
      >
        Normal BMI range:
      </Text>
      <Text style={styles.RangeStyle}>18.5 - 25 kg/m2</Text>

      <Text style={styles.InterpretationStyle}>{bmiInterpretations}</Text>
      {/* <Button style={styles.ButtonStyle}>
          <Text>Save Result</Text>
        </Button> */}
    </Box>
  );
};

const styles = StyleSheet.create({
  MainCard: {
    marginTop: 0,
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 10,
  },
  HeadingTextStyle: {
    marginLeft: 18,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 32,
    color: "#8e97fd",
    fontWeight: "bold",
  },
  BmiNumberStyle: {
    fontWeight: "bold",
    color: "#8e97fd",
    marginTop: 0,
    marginBottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  RangeStyle: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    color: "#3b3b3b",
    textAlign: "center",
  },
  InterpretationStyle: {
    color: "#8e97fd",
    marginTop: 10,
    marginBottom: 10,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  ButtonStyle: {
    backgroundColor: "#8e97fd",
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 0,
  },
  viewStyle: {
    margin: 20,
  },
});

export default BmiResult;
