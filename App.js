import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { NativeBaseProvider, Box } from "native-base";
import SplashScreen from "react-native-splash-screen";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Register from "./src/components/templates/RegisterScreen";
import LoadingScreen from "./src/components/templates/LoadingScreen";
import LoginScreen from "./src/components/templates/LoginScreen";
import HomeScreen from "./src/components/templates/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MedsForm from "./src/components/molecules/MedsForm";
import ShowMedDetails from "./src/components/molecules/ShowMedDetails";
import CovidSafetyContent from "./src/components/molecules/CovidSafetyContent";
import PrescriptionContent from "./src/components/molecules/PrescriptionContent";
import CameraComponent from "./src/components/atoms/CameraComponent";
import PreviewImage from "./src/components/atoms/PreviewImage";
import BmiResult from "./src/components/molecules/BmiResult";
import OfflinePage from "./src/components/atoms/OfflinePage";
import store from "./src/store/store";
import { Provider } from "react-redux";

const Stack = createStackNavigator();

const App = () => {
  const [isSignedIn, setSignedIn] = useState(false);
  const scheme = useColorScheme();
  const detectLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  };
  useEffect(() => {
    detectLogin();
    SplashScreen?.hide();
  }, []);
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer theme={DefaultTheme}>
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="loading" component={LoadingScreen} />
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{
                title: "",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
                headerStyle: {
                  backgroundColor: "#F2F2F2",
                },
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: "Login",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={Register}
              options={{
                title: "Sign up",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="MedsForm"
              component={MedsForm}
              options={{
                title: "Add a reminder",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="ShowMedDetails"
              component={ShowMedDetails}
              options={{
                title: "Medicine Details",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="CovidSafetyContent"
              component={CovidSafetyContent}
              options={{
                title: "Covid Safety",
                headerTintColor: "#ff6347",
                headerTitleStyle: { color: "#ff6347" },
              }}
            />
            <Stack.Screen
              name="PrescriptionContent"
              component={PrescriptionContent}
              options={{
                title: "Prescriptions",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="CameraComponent"
              component={CameraComponent}
              options={{
                title: "Camera",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="PreviewImage"
              component={PreviewImage}
              options={{
                title: "Image Preview",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="BmiResult"
              component={BmiResult}
              options={{
                title: "BMI Result",
                headerTintColor: "#8e97fd",
                headerTitleStyle: { color: "#8e97fd" },
              }}
            />
            <Stack.Screen
              name="OfflinePage"
              component={OfflinePage}
              options={{
                title: "",
                headerTintColor: "#8e97fd",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 40,
    marginBottom: 40,
    textAlign: "center",
  },
});

export default App;
