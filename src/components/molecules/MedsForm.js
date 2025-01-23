import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Platform } from "react-native";
import {
  Input,
  Button,
  Text,
  Select,
  View,
  Box,
  useToast,
  VStack,
  HStack,
} from "native-base";
import DatePicker from "react-native-date-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { getMedicines } from "../../services/meds.service";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function schedulePushNotification(data) {
  try {
    const notificationData = {
      content: {
        title: data?.title,
        body: data.subTitle || "Click here to open the app.",
      },
      trigger: { seconds: data?.time },
    };
    await Notifications.scheduleNotificationAsync(notificationData);
  } catch (err) {
    console.error("Notification schedule err ->", err);
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use a physical device for Push Notifications");
  }

  return token;
}

const MedsForm = (props) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectDate, setSelectDate] = useState();
  const [selectTime, setSelectTime] = useState();
  const [medName, setMedName] = useState();
  const [medDescription, setMedDescription] = useState();
  const [dose, setDose] = useState();
  const [medType, setMedType] = useState();
  const [savedMed, setSavedMed] = useState();
  const [userId, setUserId] = useState();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const toast = useToast();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    async function handleSavedMed() {
      const userId = await getUserId();
      const meds = await getMedicines(apiUrl, userId);
      validateSavedMedicine(meds);
    }
    handleSavedMed();
  }, [savedMed]);

  const validateSavedMedicine = (meds) => {
    if (savedMed) {
      toast.show({
        description: "Medicine has been saved.",
      });
      props.navigation.navigate("home");
    }
  };

  const getUserId = async () => {
    const idUser = await AsyncStorage.getItem("idOfUser");
    try {
      if (idUser) {
        setUserId(idUser);
        return idUser;
      }
    } catch (e) {
      console.log("Error getting userId from medsform: ", e);
    }
  };

  const saveMedicine = async () => {
    if (medName && dose && medType && selectDate && selectTime) {
      const medObject = {
        userId: userId,
        medName: medName,
        medDescription: medDescription,
        dose: dose,
        medType: medType,
        date: selectDate,
        time: selectTime,
      };
      if (isNaN(dose)) {
        return toast.show({
          description: "Dose should be a number.",
        });
      }
      console.log("api url ", apiUrl);
      await axios
        .post(`${apiUrl}/save-meds`, medObject, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          const parsedObj = JSON.parse(res.config.data);
          setSavedMed(parsedObj);
        })
        .catch((err) => __DEV__ && console.log("Error saving medicine: ", err));

      let notiDescription = `Time to take ${medName}`;
      const currentDate = new Date(Date.now());
      const selectedDate = date;
      const timeToNotification = (selectedDate - currentDate) / 1000;
      const data = {
        title: notiDescription,
        time: Math.floor(timeToNotification),
      };
      await schedulePushNotification(data);
    } else {
      toast.show({
        description: "Please enter all the details.",
      });
    }
  };

  const onDateConfirm = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
    const formattedDate = selectedDate.toDateString();
    setSelectDate(formattedDate);
  };

  const onTimeConfirm = (selectedTime) => {
    setShowTimePicker(false);
    setDate(selectedTime);
    const formattedTime = selectedTime
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5);
    setSelectTime(formattedTime);
  };

  return (
    <Box safeArea p={4}>
      <VStack space={4}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Medicine Name</Text>
          <Input
            placeholder="Enter medicine name"
            value={medName}
            onChangeText={(text) => setMedName(text)}
            selectionColor="#8e97fd"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <Input
            placeholder="Add a description"
            value={medDescription}
            onChangeText={(text) => setMedDescription(text)}
            selectionColor="#8e97fd"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dose</Text>
          <Input
            keyboardType="numeric"
            placeholder="Enter dose"
            value={dose}
            onChangeText={(text) => setDose(text)}
            selectionColor="#8e97fd"
            style={styles.input}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Units</Text>
          <Select
            placeholder="Select unit"
            minWidth="200"
            selectedValue={medType}
            onValueChange={(value) => setMedType(value)}
            style={styles.select}
          >
            <Select.Item label="Capsule(s)" value="capsule" />
            <Select.Item label="Drop(s)" value="drop" />
            <Select.Item label="Gram(s)" value="gram" />
            <Select.Item label="Injection(s)" value="injection" />
            <Select.Item label="Milligram(s)" value="mg" />
            <Select.Item label="Millilitre(s)" value="ml" />
            <Select.Item label="Patch(es)" value="patch" />
            <Select.Item label="Packet(s)" value="packet" />
            <Select.Item label="Pill(s)" value="pill" />
            <Select.Item label="Pieces(s)" value="piece" />
            <Select.Item label="Puff(s)" value="puff" />
            <Select.Item label="Spray(s)" value="spray" />
            <Select.Item label="Tablespoon(s)" value="spoon1" />
            <Select.Item label="Teaspoon(s)" value="spoon2" />
            <Select.Item label="Unit(s)" value="unit" />
          </Select>
        </View>

        <HStack space={4} justifyContent="center">
          <Button
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            variant={"outline"}
          >
            <Text style={styles.dateButtonText}>
              {selectDate ? selectDate : "Select Date"}
            </Text>
          </Button>
          <Button
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
            variant={"outline"}
          >
            <Text style={styles.dateButtonText}>
              {selectTime ? selectTime : "Select Time"}
            </Text>
          </Button>
        </HStack>

        <DatePicker
          modal
          open={showDatePicker}
          date={date}
          mode="date"
          onConfirm={onDateConfirm}
          onCancel={() => setShowDatePicker(false)}
          minimumDate={new Date()}
          title="Select Date"
          confirmText="Confirm"
          cancelText="Cancel"
        />

        <DatePicker
          modal
          open={showTimePicker}
          date={date}
          mode="time"
          onConfirm={onTimeConfirm}
          onCancel={() => setShowTimePicker(false)}
          minimumDate={new Date()}
          title="Select Time"
          confirmText="Confirm"
          cancelText="Cancel"
        />

        <Button style={styles.submitButton} onPress={saveMedicine}>
          <Text style={styles.submitButtonText}>Set Alarm</Text>
        </Button>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    color: "#7c7c7c",
    marginBottom: 4,
  },
  input: {
    borderColor: "#e2e2e2",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  select: {
    borderColor: "#e2e2e2",
    borderWidth: 1,
    borderRadius: 4,
  },
  dateButton: {
    borderColor: "#8e97fd",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  dateButtonText: {
    color: "#8e97fd",
  },
  submitButton: {
    backgroundColor: "#8e97fd",
    marginVertical: 20,
    borderRadius: 4,
  },
  submitButtonText: {
    color: "#fff",
  },
});

export default MedsForm;
