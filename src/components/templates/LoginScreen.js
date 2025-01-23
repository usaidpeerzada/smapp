import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useToast, Button } from "native-base";
import WelcomeModal from "../atoms/WelcomeModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios from "axios";
import OfflinePage from "../atoms/OfflinePage";
import * as EmailValidator from "email-validator";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/meds.slice";

export default function LoginScreen(props) {
  let NetInfoSubscription = null;
  const toast = useToast();
  const PURPLE_SHADE = "#8e97fd";
  const LIGHT_GRAY = "#D3D3D3";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState();
  const [connectionStatus, setConnectionStatus] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    NetInfoSubscription = NetInfo.addEventListener(handleConnectionChange);
    return () => {
      NetInfoSubscription;
    };
  }, []);

  const handleConnectionChange = (state) => {
    setConnectionStatus(state?.isConnected);
  };

  async function sendCred() {
    if (!email || !password) {
      toast.show({
        description: "Both fields are mandatory.",
      });
      return;
    }
    if (!EmailValidator.validate(email)) {
      toast.show({
        description: "Please enter a valid email address.",
        status: "warning",
      });
      return;
    }
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    await axios
      .post(`${apiUrl}/auth/signin`, {
        email: email,
        password: password,
      })
      .then(async (data) => {
        if (data?.data?.id) {
          await AsyncStorage.setItem("userName", data?.data?.username);
          await AsyncStorage.setItem("idOfUser", data?.data?.id);
          await AsyncStorage.setItem("token", data?.data?.token);
          dispatch(
            setUserData({
              userName: data?.data?.username,
              idOfUser: data?.data?.id,
              token: data?.data?.token,
            })
          );
          props.navigation.replace("home");
        } else {
          toast.show({
            description: `${data?.data?.message}`,
          });
          return;
        }
        // await AsyncStorage.setItem('token', data.token);
      })
      .catch((err) => console.log("err", err));
  }
  async function handlePress() {
    setLoading(true);
    await sendCred();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }
  const handleFocus = (event) => {
    setFocus(true);
    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setFocus(false);
    if (props.onBlur) {
      props.onBlur(event);
    }
  };
  return (
    <>
      {connectionStatus ? (
        <KeyboardAvoidingView behavior="position">
          <StatusBar barStyle="light-content" />
          {/* <WelcomeModal showModal={true} /> */}
          <Image
            source={require("../images/login.png")}
            style={{ width: "auto", height: 200 }}
          />
          <Text
            style={{
              fontSize: 35,
              marginLeft: 18,
              marginTop: 10,
              color: "#3b3b3b",
            }}
          >
            welcome to
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginLeft: 18,
              color: "#8e97fd",
            }}
          >
            SmappCare
          </Text>
          <View />
          <Text
            style={{
              fontSize: 20,
              marginLeft: 18,
              marginTop: 20,
            }}
          >
            Login with email
          </Text>
          <TextInput
            selectionColor={PURPLE_SHADE}
            label="email"
            placeholder="Email"
            textContentType="emailAddress"
            underlineColorAndroid={focus ? PURPLE_SHADE : LIGHT_GRAY}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={email}
            autoCapitalize="none"
            style={{
              marginLeft: 18,
              marginRight: 18,
              marginTop: 18,
              color: "#4a4a4a",
              padding: 10,
            }}
            theme={{ colors: { primary: "blue" } }}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            selectionColor={PURPLE_SHADE}
            underlineColorAndroid={focus ? PURPLE_SHADE : LIGHT_GRAY}
            onFocus={handleFocus}
            onBlur={handleBlur}
            label="password"
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            style={{
              marginLeft: 18,
              marginRight: 18,
              marginTop: 18,
              padding: 10,
            }}
            theme={{ colors: { primary: "blue" } }}
          />
          <View style={styles.ButtonStyle}>
            <Button
              style={{ backgroundColor: "#8e97fd" }}
              onPress={handlePress}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                "Login"
              )}
            </Button>
          </View>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 18,
                marginTop: 20,
                color: "#8e97fd",
                marginBottom: 16,
              }}
              onPress={() => props.navigation.replace("SignUp")}
            >
              Don't have an account?
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      ) : (
        <OfflinePage />
      )}
    </>
  );
}
const styles = StyleSheet.create({
  ButtonStyle: {
    marginLeft: 18,
    marginRight: 18,
    marginTop: 25,
  },
});
