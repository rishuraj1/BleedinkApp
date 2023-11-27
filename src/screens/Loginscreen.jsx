import { View, Text, Image, StatusBar, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  Easing,
} from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { loginbg } from "../../assets";
import { Button } from "../components";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Loginscreen = ({ navigation }) => {
  const custopacity = useSharedValue(0);
  const custdisplay = useSharedValue("hidden");
  const custW = useSharedValue(wp(0));
  const custH = useSharedValue(hp(0));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    custopacity.value = 0;
    custdisplay.value = "hidden";
    custW.value = wp(0);
    custH.value = hp(0);
    setTimeout(
      () => (custopacity.value = Easing.ease(custopacity.value + 1)),
      1200
    );
    setTimeout(() => (custW.value = Easing.linear(custW.value + wp(100))), 800);
    setTimeout(() => (custH.value = Easing.linear(custH.value + hp(100))), 800);

    setTimeout(() => (custdisplay.valueOf = "flex"), 800);
  }, []);

  const handleLogin = async () => {
    console.log("Login");
    if (!email || !password) {
      alert("Please enter all the fields");
      return;
    }
    try {
      const body = {
        email,
        password,
      };
      const url = "https://bloggler-backend.vercel.app/api/user/login";
      const response = await axios.post(url, body);
      // console.log(response?.data);
      // alert("Logged in successfully");
      const token = JSON.stringify(response?.data?.access_token);
      console.log(token, "token");
      await AsyncStorage.setItem("token", token);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  // demo78@demo.com demo78
  //demo79@demo.com demo79

  const goTo = () => {
    navigation.navigate("Signup");
  };

  return (
    <Animated.View
      className="flex-1 justify-center items-center"
      style={{
        display: custdisplay,
      }}
    >
      <StatusBar barStyle="light-content" />
      {/* Title and Form */}
      <Animated.Image source={loginbg} width={custW} height={custH} />

      <Animated.View
        style={{
          width: wp(93),
          height: hp(60),
          opacity: custopacity,
          position: "absolute",
          bottom: 18,
          backgroundColor: "white",
          justifyContent: "space-around",
          padding: 20,
          borderRadius: 8,
          flexDirection: "column",
          elevation: 10,
          alignItems: "center",
          gap: 20,
          shadowOffset: {
            width: 5,
            height: 10,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          shadowColor: "#000",
          elevation: 5,
        }}
      >
        <Text className="text-slate-800 font-bold" style={{ fontSize: hp(5) }}>
          Login
        </Text>
        <View className="flex-1" style={{ marginTop: hp(5), gap: hp(2) }}>
          <TextInput
            className="bg-slate-200 rounded-md px-4 py-2 mt-2"
            style={{ elevation: 2, width: wp(80) }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="bg-slate-200 rounded-md px-4 py-2 mt-2"
            style={{ elevation: 2, width: wp(80) }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button width={wp(80)} bgcolor="#3F51B5" onPress={handleLogin}>
          Login
        </Button>

        <View
          className="flex-1 justify-start"
          style={{ marginTop: hp(1), gap: hp(2) }}
        >
          <Text
            className="text-slate-600 font-bold"
            style={{ fontSize: hp(2) }}
          >
            Forgot Password?
          </Text>
          <Text
            className="text-slate-800 font-semibold"
            style={{ fontSize: hp(2.5) }}
          >
            Do not have an account yet ?
          </Text>
          <Button width={wp(80)} bgcolor="#4CAF50" onPress={goTo}>
            Sign up
          </Button>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default Loginscreen;
