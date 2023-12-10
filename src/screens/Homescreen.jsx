import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TouchableHighlight,
  FlatList
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, PostcardSkeleton, Postlist, UserButton } from "../components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import Postcard from "../components/Postcard";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDataStore, usePostStore } from "../store/store";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Homescreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [searchedPosts, setSearchedPosts] = useState([])

  const user = useDataStore((state) => state.user);
  console.log(user, "fetched user");

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const getSearchedPosts = async () => {
    console.log(search, "searched posts");
    try {
      const res = await axios.get(`${baseUrl}/post?search=${search}`)
      const data = res?.data?.data
      setSearchedPosts(data)
      // console.log(searchedPosts, "searched posts");
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView className="bg-slate-200 flex-1">
      <View className="py-5 px-2 flex-row flex justify-between items-center">
        <Text className="text-2xl font-semibold text-slate-900">
          Hello <Text className="text-indigo-500">{user?.userName}</Text>
        </Text>
        <UserButton
          onPress={() => setModalVisible(true)}
          width={widthPercentageToDP(13)}
          height={heightPercentageToDP(6)}
          userImage={userData?.imageUrl}
        />
      </View>
      <Modal
        animationType="fade"
        statusBarTranslucent={true}
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-md p-2 w-4/5">
            <View className="flex-row flex justify-between items-center">
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
              >
                <View className="rounded-md p-2">
                  <FontAwesome name="close" size={30} color="red" />
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex justify-between items-center py-8">
              <View className="py-2">
                <Button
                  onPress={() => {
                    navigation.navigate("Profile", {
                      userId: user?._id,
                      username: "Your Profile"
                    })
                    setModalVisible(!modalVisible)
                  }}
                  bgcolor={"blue"}
                  width={widthPercentageToDP(70)}
                >
                  My Profile
                </Button>
              </View>
              <View className="py-2">
                <Button
                  bgcolor={"red"}
                  width={widthPercentageToDP(70)}
                  onPress={() => {
                    useDataStore.setState({ user: null });
                    usePostStore.setState({ postData: [] });
                    AsyncStorage.removeItem("userData");
                    navigation.navigate("Login");
                  }}
                >
                  Log out
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <SafeAreaView
        className="px-2 bg-slate-200 flex-1"
      >
        <SafeAreaView className="flex-row flex justify-between">
          <TextInput
            className="rounded-md p-2 w-full text-slate-900 bg-slate-300 border-2 border-slate-300 mr-2"
            placeholder="Search Posts"
            value={search}
            onChangeText={setSearch}
            style={{
              fontSize: 18,
              fontWeight: "500",
            }}
          />
          <TouchableOpacity
            className="absolute right-2 items-center top-1"
            onPress={getSearchedPosts}
          >
            <View className="rounded-md p-2">
              <FontAwesome name="search" size={24} color="#3F51B5" />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
        {
          searchedPosts?.length > 0 && (
            <View style={{ flex: 1 }} className="h-full">
              <View className="flex-row flex justify-between items-center">
                <Text className="text-2xl font-semibold my-3 text-indigo-500">
                  Searched Posts
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchedPosts([])
                    setSearch("")
                  }}
                >
                  <Text className="text-2xl font-semibold my-3 text-indigo-500">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <FlatList
                  style={{ flex: 1, marginBottom: 1, height: "100%" }}
                  data={searchedPosts}
                  keyExtractor={(item) => item?._id}
                  renderItem={({ item }) => <Postcard postData={item} navigation={navigation} />}
                />
              </View>
            </View>
          )
        }
        <Text className="text-2xl font-semibold my-3 text-indigo-500">
          Recent Posts
        </Text>
        <Postlist navigattion={navigation} />
      </SafeAreaView >
    </SafeAreaView >
  );
};

export default Homescreen;
