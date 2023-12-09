import { View, Text, SafeAreaView, Image, Pressable, TouchableOpacity, FlatList } from "react-native";
import { Button, Postcard, UserButton } from "../components";
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
  const [updating, setUpdating] = useState(false);
  // console.log(thisUser, "this user");
  // console.log(isThisUser, "is this user");

  const getPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/post?userId=${userId || thisUser?._id || user?._id}`);
      const data = await response?.data?.data;
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
  }, [setUpdating, userId, user?.imageUrl]);

  useEffect(() => {
    getUser();
  }, [setUser, userId, user?.imageUrl]);


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
        setImage(prevState => image?.assets[0]);
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
      setUpdating(true)
      let imageData = new FormData();
      console.log(image, "image");
      imageData.append('photo', {
        uri: image?.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      console.log(imageData, "image data");
      const options = {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      }
      const response = await axios.post(`${baseUrl}/user/addPhoto`, imageData, options)
      console.log(response?._response, "response");
      setUser(prevState => ({ ...prevState, imageUrl: response?._response?.imageUrl }))
      const getUser = await axios.get(`${baseUrl}/user/getUser?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`,
        },
      });
      console.log(getUser, "get user");
      useDataStore.setState({ user: getUser?.data });
    } catch (err) {
      console.log(err, "error uploading image");
    } finally {
      setImage(null);
      setLoading(false);
      setUpdating(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 p-2 bg-slate-200 justify-start items-start">
      <View className="flex-row items-start justify-start w-full">
        <View className="flex-col items-center justify-center rounded-full bg-indigo-500 border-2 border-white">
          <Image
            source={image ? { uri: image?.uri } : user?.imageUrl ? { uri: user?.imageUrl } : Usericon}
            className="w-32 h-32 rounded-full bg-indigo-500"
            style={{
              objectFit: "contain",
            }}
          />
        </View>
        <View className="flex items-start justify-center w-full">
          <Text className="text-3xl font-bold text-indigo-500 mt-3">{user?.userName}</Text>
          {
            isThisUser && (
              <>
                {
                  loading ? (
                    <View className="flex-row px-2">
                      <TouchableOpacity onPress={uploadImage} className="bg-indigo-500 rounded-sm p-1 my-2 mx-1">
                        <Text className="text-md font-semibold text-white">
                          {updating ? "Updating..." : "Save Picture"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        setImage(null);
                        setLoading(false);
                      }} className="bg-indigo-500 rounded-sm p-1 my-2 mx-1">
                        <Text className="text-md font-semibold text-white">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={handleImageUpload} className="bg-indigo-500 rounded-sm mx-1 p-1 my-2">
                      <Text className="text-md font-semibold text-white">Edit Picture</Text>
                    </TouchableOpacity>
                  )
                }
              </>
            )
          }
          {
            isThisUser && (
              <TouchableOpacity onPress={handleLogout} className="bg-green-500 rounded-sm px-4 py-1 mx-1 my-2">
                <Text className="text-md font-semibold text-white">Logout</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
      {
        isThisUser ? (
          <Text className="text-2xl font-semibold text-slate-700 mt-2">Your Posts</Text>
        ) : (
          <Text className="text-2xl font-semibold text-slate-700 mt-2">{`${username}'s Posts`}</Text>
        )
      }
      <FlatList
        data={posts}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => <Postcard postData={item} navigation={navigation} />}
        CellRendererComponent={({ children, ...props }) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate("Post", { postData: props?.item });
              }}
              className="flex-1"
            >
              {children}
            </Pressable>
          );
        }}
        onRefresh={getPosts}
        refreshing={updating}
        extraData={posts}
      />
    </SafeAreaView>
  );
};

export default Userscreen;
