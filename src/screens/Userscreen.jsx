import { View, Text, SafeAreaView } from "react-native";
import { Button } from "../components";
import React, { useEffect, useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDataStore } from "../store/store";

const Userscreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const { userId, username } = route?.params;
  const currUser = { userId, username };
  useEffect(() => {
    const fetchUser = async () => {
      const user = JSON.parse(await AsyncStorage.getItem("userData"));
      setUser(user);
      if (!user) navigation.navigate("Login");
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    console.log("Logout");
    AsyncStorage.removeItem("userData");
    useDataStore.setState({ user: null });
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView className="flex-1 p-2 bg-slate-200 justify-center items-center">
      <Button
        onPress={handleLogout}
        width={widthPercentageToDP(30)}
        bgcolor="green"
      >
        Logout
      </Button>
      <Text className="text-black">
        Welcome {currUser?.userId}
      </Text>
    </SafeAreaView>
  );
};

export default Userscreen;
