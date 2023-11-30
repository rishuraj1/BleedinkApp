import { View, Text, StatusBar, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Logo } from "../../assets";
import { Button } from "../components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Welcomescreen = () => {
  const navigation = useNavigation();
  const ring1Padding = useSharedValue(0);
  const ring2Padding = useSharedValue(0);

  useEffect(() => {
    ring1Padding.value = 0;
    ring2Padding.value = 0;

    const checkUser = async () => {
      const user = await AsyncStorage.getItem("userData");
      if (user) {
        setTimeout(() => navigation.navigate("Home"), 2500);
      } else {
        setTimeout(() => navigation.navigate("Login"), 2500);
      }
    };
    checkUser();

    setTimeout(
      () => (ring1Padding.value = withSpring(ring1Padding.value + hp(5))),
      100
    );
    setTimeout(
      () => (ring2Padding.value = withSpring(ring2Padding.value + hp(5.5))),
      300
    );
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-indigo-800">
      <StatusBar barStyle="light-content" />

      <Animated.View
        className="bg-white/20 rounded-full"
        style={{ padding: ring2Padding }}
      >
        {/* Logo */}
        <Animated.View
          className="bg-white/20 rounded-full"
          style={{ padding: ring1Padding }}
        >
          <Image
            source={Logo}
            style={{ width: hp(20), height: hp(20), borderRadius: 100 }}
          />
        </Animated.View>
      </Animated.View>

      {/* Title and line */}
      <View className="flex gap-2">
        <Animated.Text
          className="text-white tracking-widest font-bold text-center"
          style={{ fontSize: hp(7) }}
        >
          BleedINK.
        </Animated.Text>
        <Animated.Text
          className="text-white font-semibold text-center"
          style={{ fontSize: hp(2.7) }}
        >
          Welcome.
        </Animated.Text>
      </View>
    </View>
  );
};

export default Welcomescreen;
