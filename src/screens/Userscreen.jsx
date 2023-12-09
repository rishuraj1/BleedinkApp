import { View, Text, SafeAreaView, Image, Pressable, TouchableOpacity } from "react-native";
import { Button, UserButton } from "../components";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDataStore } from "../store/store";
import axios from "axios";
import { Usericon } from "../../assets";
import { ScrollView } from "tamagui";
import * as ImagePicker from 'expo-image-picker';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Userscreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { userId, username } = route?.params;
  const thisUser = useDataStore((state) => state.user);
  const isThisUser = userId === thisUser?._id;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  // console.log(thisUser, "this user");
  // console.log(isThisUser, "is this user");

  const getPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/post?userId=${userId || thisUser?._id || user?._id}`);
      const data = response?.data?.data;
      setPosts(data);
      // console.log(posts, "posts");
    } catch (err) {
      console.log(err);
    }
  }

  const getUser = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const thisUser = JSON.parse(userData);
    console.log(user, "user");
    try {
      const res = await axios.get(`${baseUrl}/user/getUser?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`,
        },
      });
      setUser(res?.data);
      console.log(user, "user data from profile");
    } catch (err) {
      console.log(err, "error");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    getUser();
  }, []);


  const handleLogout = () => {
    console.log("Logout");
    AsyncStorage.removeItem("userData");
    useDataStore.setState({ user: null });
    navigation.navigate("Login");
  };

  const handleImageUpload = async () => {
    try {
      setLoading(true)
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      })
      console.log(image?.assets[0], "image");
      if (!image.canceled)
        setImage(image?.assets[0]);
      else if (image.canceled) setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const uploadImage = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const thisUser = JSON.parse(userData);
    console.log(thisUser, "this user");
    try {
      let imageData = new FormData();
      console.log(image, "image");
      imageData.append('photo', {
        uri: image?.uri,
        type: image?.type,
        width: image?.width,
      });
      console.log(imageData, "image data");
      const response = await axios.post(`${baseUrl}/user/addPhoto`, {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      }, {
        data: imageData,
      })
      console.log(response, "response");
    } catch (err) {
      console.log(err, "error uploading image");
    }
  }

  return (
    <SafeAreaView className="flex-1 p-2 bg-slate-200 justify-center items-center">
      <ScrollView className="flex-1 w-full">
        <View className="flex-1 flex-col items-center justify-center">
          <View className="flex-1 flex-col items-center justify-center rounded-full bg-indigo-500 border-2 border-white">
            <Image
              source={image ? { uri: image?.uri } : user?.imageUrl ? { uri: user?.imageUrl } : Usericon}
              className="w-32 h-32 rounded-full bg-indigo-500"
              style={{
                objectFit: "contain",
              }}
            />
          </View>
          {
            isThisUser && (
              <>
                {
                  loading ? (
                    <View className="flex-row px-2">
                      <TouchableOpacity onPress={uploadImage} className="bg-indigo-500 rounded-sm p-1 my-2 mx-1">
                        <Text className="text-md font-semibold text-white">Save picture</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        setImage(null);
                        setLoading(false);
                      }} className="bg-indigo-500 rounded-sm p-1 my-2 mx-1">
                        <Text className="text-md font-semibold text-white">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={handleImageUpload} className="bg-indigo-500 rounded-sm p-1 my-2">
                      <Text className="text-md font-semibold text-white">Edit Picture</Text>
                    </TouchableOpacity>
                  )
                }
              </>
            )
          }
          <Text className="text-3xl font-bold text-indigo-500">{user?.userName}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Userscreen;
