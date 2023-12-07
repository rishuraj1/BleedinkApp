import { View, Text, SafeAreaView, Image } from "react-native";
import { Button, UserButton } from "../components";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDataStore } from "../store/store";
import axios from "axios";
import { Usericon } from "../../assets";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Userscreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { userId, username } = route?.params;
  const thisUser = useDataStore((state) => state.user);
  const isThisUser = userId === thisUser?._id;
  // console.log(thisUser, "this user");
  // console.log(isThisUser, "is this user");

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const user = JSON.parse(userData);
      try {
        const res = await axios.get(`${baseUrl}/user/getUser?id=${userId}`, {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        });
        const data = res?.data;
        setUser(data);
        console.log(data, "user");
      } catch (err) {
        console.log(err);
      }
    };

    const getPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/post?userId=${userId || thisUser?._id || user?._id}`);
        const data = response?.data?.data;
        setPosts(data);
        console.log(posts, "posts");
      } catch (err) {
        console.log(err);
      }
    }

    getUser();
    getPosts();
  }, []);


  const handleLogout = () => {
    console.log("Logout");
    AsyncStorage.removeItem("userData");
    useDataStore.setState({ user: null });
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView className="flex-1 p-2 bg-slate-200 justify-center items-center">
      <View>
        <Image
          src={user?.imageUrl || thisUser?.imageUrl || Usericon}
          alt="user"
          width={widthPercentageToDP("20%")}
          height={heightPercentageToDP("20%")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Userscreen;
