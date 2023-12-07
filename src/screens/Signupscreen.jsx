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

const Signupscreen = ({ navigation }) => {
  const custopacity = useSharedValue(0);
  const custdisplay = useSharedValue("hidden");
  const custW = useSharedValue(wp(0));
  const custH = useSharedValue(hp(0));

  const [username, setUsername] = useState("");
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

  const handleSignup = async () => {
    console.log("Signup");
    if (!username || !email || !password) {
      alert("Please fill all the fields");
      return;
    }
    const url = "https://bloggler-backend.vercel.app/api/user/signup";
    try {
      const body = {
        userName: username,
        email: email,
        password: password,
      };
      const response = await axios.post(url, body);
      const userData = response?.data;
      // console.log(response.data);
      AsyncStorage.setItem("userData", JSON.stringify(userData));
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  const goTo = () => {
    navigation.navigate("Login");
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
          Sign up
        </Text>
        <View
          className="flex-1"
          style={{
            marginTop: hp(5),
            display: "flex",
            marginBottom: hp(2),
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextInput
            className="bg-slate-200 rounded-md px-4 py-2 my-2"
            style={{ elevation: 2, width: wp(80), fontSize: hp(2.5) }}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            className="bg-slate-200 rounded-md px-4 py-2 my-2"
            style={{ elevation: 2, width: wp(80), fontSize: hp(2.5) }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="bg-slate-200 rounded-md px-4 py-2 my-2"
            style={{ elevation: 2, width: wp(80), fontSize: hp(2.5) }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="flex-1 justify-start" style={{ gap: hp(2) }}>
          <Button width={wp(80)} bgcolor="#3F51B5" onPress={handleSignup}>
            Sign up
          </Button>
          <Text
            className="text-slate-800 font-semibold"
            style={{ fontSize: hp(2.5) }}
          >
            ALready have an account ?
          </Text>
          <Button width={wp(80)} bgcolor="#4CAF50" onPress={goTo}>
            Login
          </Button>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default Signupscreen;
