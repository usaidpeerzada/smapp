"use strict";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Text, VStack, Flex, Button, HStack } from "native-base";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BmiCalcCard from "../molecules/BmiCalcCard";
import MedsReminder from "../molecules/MedsReminder";
import AddPrescriptions from "../molecules/AddPrescriptions";
import OfflinePage from "../atoms/OfflinePage";
import axios from "axios";
import { schedulePushNotification } from "../molecules/MedsForm";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { fetchDailyQuote, getMedicines } from "../../services/meds.service";
import ContactFormModal from "../molecules/ContactForm";
import Constants from "expo-constants";
import { fetchMedicines, loadCachedMedicines } from "../../store/meds.slice";
import { useDispatch, useSelector } from "react-redux";

const HomeScreen = (props) => {
  let NetInfoSubscription = null;
  const [dayTime, setDayTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState();
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { version } = Constants.expoConfig;
  const dispatch = useDispatch();
  useEffect(() => {
    timeOfTheDay();
    dispatch(fetchMedicines());
    NetInfoSubscription = NetInfo.addEventListener(handleConnectionChange);
    return () => {
      NetInfoSubscription();
    };
  }, []);

  const handleConnectionChange = (state) => {
    setConnectionStatus(state.isConnected);
  };

  const _getUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("userName");
      if (value !== null) {
        setUserName(value);
      }
    } catch (error) {
      console.log("error getting user name from async storage: ", error);
    }
  };

  useEffect(() => {
    _getUserName();
  }, []);

  async function timeOfTheDay() {
    const currentDate = new Date();
    const currentTime = currentDate.getHours();
    const currentDateNotif = Date.now();

    const scheduleNotification = async (
      title,
      subTitle,
      hours,
      minutes = 0
    ) => {
      const notificationTime = new Date(currentDate);
      notificationTime.setHours(hours, minutes, 0, 0);
      const timeToNotification = (notificationTime - currentDateNotif) / 1000;
      const data = { title, subTitle, time: timeToNotification };
      await schedulePushNotification(data);
    };
    const quote = await fetchDailyQuote();
    if (currentTime < 12) {
      setDayTime("Good Morning");
      await scheduleNotification(
        "Good morning, here's the quote of the day",
        quote,
        6
      );
    } else if (currentTime >= 12 && currentTime < 19) {
      setDayTime("Good Afternoon");
      await scheduleNotification(
        "Good Afternoon!",
        "Remember to stay hydrated and keep up the great work.",
        13
      );
    } else {
      setDayTime("Good Evening");
      if (currentTime > 19) {
        await scheduleNotification(
          "Good Night, Sleep Tight 😴",
          "Sleeping for 7 - 8 hours has been proven to have great health benefits.",
          20,
          47
        );
      }
    }
  }

  const logout = async () => {
    setLoading(true);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    try {
      const res = await axios.post(`${apiUrl}/auth/signout`);
      if (res.status === 200) {
        await AsyncStorage.setItem("token", "");
        props.navigation.replace("Login");
      } else {
        console.log("error logging out");
      }
    } catch (error) {
      console.log("error logging out: ", error);
    } finally {
      setLoading(false);
    }
  };
  const [refreshing, setRefreshing] = useState(false);
  const getUserId = async () => {
    const idUser = await AsyncStorage.getItem("idOfUser");
    return idUser;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(loadCachedMedicines());
    dispatch(fetchMedicines());
    setRefreshing(false);
  };
  useEffect(() => {
    dispatch(loadCachedMedicines());
    dispatch(fetchMedicines());
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {connectionStatus ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <VStack space={3} w="100%" px="3">
            {/* <Flex direction="row" align="center"> */}
            {/* {dayTime === "Good Morning" || dayTime === "Good Afternoon" ? (
                <Image
                  source={require("../images/day.png")}
                  style={styles.icon}
                />
              ) : (
                <Image
                  source={require("../images/night.png")}
                  style={styles.icon}
                />
              )} */}
            <Text style={styles.HeadingStyle}>{dayTime}</Text>
            {/* </Flex> */}
            <Text style={styles.UserNameStyle}>{userName ?? "User"}</Text>
            <AddPrescriptions />
            <MedsReminder />
            <BmiCalcCard />
            <HStack space={4} justifyContent="center" alignItems="center">
              <Button
                style={styles.contactButton}
                onPress={() => setModalVisible(true)}
                isLoading={loading}
              >
                <Text style={styles.buttonText}>Contact</Text>
              </Button>
              <Button
                style={styles.logoutButton}
                onPress={logout}
                isLoading={loading}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </Button>
            </HStack>
            <ContactFormModal
              isVisible={isModalVisible}
              onClose={() => setModalVisible(false)}
            />
            <Text
              style={{
                textAlign: "center",
                marginBottom: 8,
                color: "#949dff66",
              }}
            >
              App version: v{version}
            </Text>
          </VStack>
        </ScrollView>
      ) : (
        <OfflinePage />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  HeadingStyle: {
    fontWeight: "900",
    marginLeft: 18,
    paddingTop: 10,
    fontSize: 24,
    color: "#949dff",
  },
  UserNameStyle: {
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 20,
    paddingTop: 8,
    fontSize: 24,
    color: "#8e97fd",
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: 10,
    opacity: 0.7,
  },
  contactButton: {
    backgroundColor: "#8e97fd",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    width: 120,
  },
  logoutButton: {
    backgroundColor: "#E94F4F",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    width: 120,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default HomeScreen;
