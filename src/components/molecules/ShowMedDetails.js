import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Flex, Box, Center, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { removeCachedMedicine } from "../../store/meds.slice";

const ShowMedDetails = ({ route }) => {
  const navigation = useNavigation();
  const { id, name, desc, dose, type, date, time } = route.params;
  const toast = useToast();
  const dispatch = useDispatch();
  const deleteMedicineHandler = (key) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    axios
      .delete(`${apiUrl}/delete-meds`, {
        headers: {
          "content-type": "application/json",
        },
        data: { id: id },
      })
      .then(() => {
        dispatch(removeCachedMedicine(id));
        if (key === "1") {
          toast.show({
            description: "Great! You have taken your medicine.",
          });
          navigation.navigate("home");
        } else if (key === "2") {
          toast.show({
            description: "Medicine deleted successfully.",
          });
          navigation.navigate("home");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Box style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
      </Box>
      <Box style={styles.detailsContainer}>
        <DetailCard title="Description" content={desc} />
        <DetailCard title="Dose" content={dose} />
        <DetailCard title="Unit" content={type.toUpperCase()} />
        <DetailCard title="Date" content={date} />
        <DetailCard title="Time" content={time} />
      </Box>
      <Center style={styles.actionContainer}>
        <Flex direction="row" alignItems="center">
          <Button
            style={[styles.actionButton, styles.checkButton]}
            onPress={() => deleteMedicineHandler("1")}
            leftIcon={<Feather name="check-circle" size={24} color="white" />}
          >
            <Text style={styles.buttonText}>Mark as Taken</Text>
          </Button>
          <Button
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteMedicineHandler("2")}
            leftIcon={<Feather name="x-circle" size={24} color="white" />}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </Button>
        </Flex>
      </Center>
    </View>
  );
};

const DetailCard = ({ title, content }) => (
  <Box style={styles.detailCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardContent}>{content}</Text>
  </Box>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    backgroundColor: "#949dff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 4,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    color: "#949dff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardContent: {
    color: "#333",
    fontSize: 16,
  },
  actionContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  checkButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ShowMedDetails;
