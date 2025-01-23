import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Item } from "native-base";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

const WelcomeModal = (props) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(props.showModal);
  }, []);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Welcome to SmapCare</Text>
            <Text style={{ marginBottom: 10, color: "#6e6e6e" }}>
              Smapp helps you keep track of your medicines and health.
            </Text>
            <Text style={{ marginBottom: 10, color: "#6e6e6e" }}>
              You can save your prescriptions, add medicine reminders and much
              more.
            </Text>
            <Text style={{ marginBottom: 10, color: "#6e6e6e" }}>
              Remember to drink water, exercise and sleep on time. That is the
              key to a healthy body.
            </Text>
            <Item
              style={{
                borderColor: "transparent",
                marginTop: 10,
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("SignUp");
                }}
              >
                <Text style={styles.textStyle}>Sign up</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.login]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}> Login </Text>
              </Pressable>
            </Item>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#8e97fd",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#8e97fd",
    fontSize: 18,
  },
  login: {
    marginLeft: 30,
  },
});

export default WelcomeModal;
