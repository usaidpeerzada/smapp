import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button, useToast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as EmailValidator from "email-validator";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/meds.slice";

const Register = (props) => {
  const PURPLE_SHADE = "#8e97fd";
  const LIGHT_GRAY = "#D3D3D3";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function signUpHandler(props) {
    if (!username || !password || !email) {
      toast.show({
        description: "All fields are mandatory!",
        status: "warning",
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
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          phone: "",
        }),
      });

      const data = await response.json();

      toast.show({
        description: data.message,
        status: "warning",
      });
      await AsyncStorage.multiSet([
        ["token", data.token],
        ["userName", data.username],
        ["idOfUser", data.userId],
      ]);

      dispatch(
        setUserData({
          userName: data.username,
          idOfUser: data.userId,
          token: data.token,
        })
      );

      props.navigation.replace("home");
    } catch (err) {
      console.log("sign up unsuccessful ->", err);
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text style={styles.headingStyle}>Create an account.</Text>
          <TextInput
            label="username"
            selectionColor={PURPLE_SHADE}
            underlineColorAndroid={focus ? PURPLE_SHADE : LIGHT_GRAY}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={styles.textInput}
            value={username}
            placeholder="Username"
            autoCapitalize="none"
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            label="password"
            selectionColor={PURPLE_SHADE}
            underlineColorAndroid={focus ? PURPLE_SHADE : LIGHT_GRAY}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={styles.textInput}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            label="email"
            textContentType="emailAddress"
            selectionColor={PURPLE_SHADE}
            underlineColorAndroid={focus ? PURPLE_SHADE : LIGHT_GRAY}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={email}
            style={styles.textInput}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <Button
            style={styles.ButtonStyle}
            block
            onPress={() => signUpHandler(props)}
          >
            <Text style={{ color: "#fff" }}>
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                "Sign Up"
              )}
            </Text>
          </Button>
          <TouchableOpacity>
            <Text
              style={styles.footerStyle}
              onPress={() => props.navigation.replace("Login")}
            >
              already have an account?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    margin: 18,
    padding: 10,
  },
  headingStyle: {
    color: "#8e97fd",
    fontSize: 20,
    fontWeight: "bold",
    margin: 18,
  },
  ButtonStyle: {
    marginLeft: 18,
    marginRight: 18,
    backgroundColor: "#8e97fd",
  },
  footerStyle: {
    color: "grey",
    fontSize: 18,
    margin: 20,
    fontWeight: "bold",
    color: "#8e97fd",
  },
});
export default Register;
