import React, { useEffect, useCallback } from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { Text, Button, AddIcon, Box } from "native-base";
import Card from "./Card";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicines, loadCachedMedicines } from "../../store/meds.slice";
import { TouchableOpacity } from "react-native-gesture-handler";

const MedsReminder = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { medicines, status } = useSelector((state) => state.meds);

  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(loadCachedMedicines());
      dispatch(fetchMedicines());
    };
    const unsubscribe = navigation.addListener("focus", fetchInitialData);
    return () => unsubscribe();
  }, [navigation, dispatch]);

  const onPressHandler = () => {
    navigation.navigate("MedsForm");
  };

  const sendAndShowMedDetails = (id, name, desc, dose, type, date, time) => {
    navigation.navigate("ShowMedDetails", {
      id,
      name,
      desc,
      dose,
      type,
      date,
      time,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card
        title="Medicine Reminder"
        description="Add an alarm for your medicine."
      >
        {medicines && medicines.length > 0 ? (
          medicines.map((med, index) => (
            <Box key={index} style={styles.card} bg={"#949dff"} rounded="md">
              <TouchableOpacity
                onPress={() =>
                  sendAndShowMedDetails(
                    med._id,
                    med.medName,
                    med.medDescription,
                    med.dose,
                    med.medType,
                    med.date,
                    med.time
                  )
                }
              >
                <Text style={styles.medName}>{med.medName}</Text>
                <Text style={styles.medDetails}>
                  {med.dose} {med.medType}
                </Text>
              </TouchableOpacity>
            </Box>
          ))
        ) : (
          <>
            <Image
              source={require("../images/meds.png")}
              style={styles.MedImage}
            />
            <Text style={styles.MedText}>Add Your Medicines Here</Text>
          </>
        )}
        <Button style={styles.ButtonStyle} onPress={onPressHandler}>
          <AddIcon color="#fff" />
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  ButtonStyle: {
    marginTop: 15,
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#949dff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  medName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  medDetails: {
    color: "#fff",
    fontSize: 14,
  },
  card: {
    marginVertical: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  MedImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  MedText: {
    fontWeight: "bold",
    color: "#8e97fd",
    textAlign: "center",
    marginTop: 10,
  },
});

export default MedsReminder;
