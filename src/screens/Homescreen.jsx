import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  Modal
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, PostcardSkeleton, UserButton } from "../components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import Postcard from "../components/Postcard";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Homescreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://bloggler-backend.vercel.app/api/post"
      );
      const data = await response?.data;
      // console.log(data);
      // {debugging purposes}
      data?.sort((a, b) => {
        return new Date(b?.createdAt) - new Date(a?.createdAt);
      });
      setPosts(data);
      // console.log(posts, "posts");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(search);
    setTimeout(() => setRefreshing(false), 2000);
  })

  const handleSearch = async (search) => {
    setLoading(true);
    // search data in posts in posts state
    setSearchedResults([]);
    if (search === "") {
      fetchPosts();
      return;
    }
    try {
      if (search === "") fetchPosts();
      const filteredPosts = posts.filter(
        (post) =>
          post?.title?.toLowerCase().includes(search.toLowerCase()) ||
          post?.content?.toLowerCase().includes(search.toLowerCase()) ||
          post?.createdBy?.userName
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
      const data = filteredPosts?.sort((a, b) => {
        return new Date(b?.createdAt) - new Date(a?.createdAt);
      });
      console.log(filteredPosts);
      setSearchedResults(data || []);
      console.log(searchedResults, "searchedResults");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  useEffect(() => {
    fetchPosts(search);
  }, [setLoading, setPosts]);

  // console.log(posts.length);
  // console.log(posts[0]?._id), "post1";

  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <View className="py-5 px-2 flex-row flex justify-between items-center">
        <Text className="text-2xl font-semibold text-slate-900">
          Hello <Text className="text-indigo-500">User</Text>
        </Text>
        <UserButton onPress={() => setModalVisible(true)} />
      </View>
      <Modal
        animationType="slide"
        statusBarTranslucent={true}
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-md p-2 w-4/5">
            <View className="flex-row flex justify-between items-center">
              <Text className="text-2xl font-semibold text-slate-900">
                Profile
              </Text>
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
                <Button bgcolor={"blue"} width={widthPercentageToDP(70)}>
                  Settings
                </Button>
              </View>
              <View className="py-2">
                <Button
                  onPress={() => {
                    navigation.navigate("Profile", {
                      userId: user?._id,
                      username: user?.userName,
                    })
                    setModalVisible(!modalVisible)
                  }}
                  bgcolor={"green"}
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
                    AsyncStorage.removeItem("token");
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
      <ScrollView
        className="px-2"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3F51B5", "black", "red"]}
            progressBackgroundColor={"#fff"}
          />
        }
      >
        <View className="flex-row flex justify-between">
          <TextInput
            className="rounded-md p-2 w-full text-slate-900 bg-slate-300 border-2 border-slate-300 mr-2"
            placeholder="Search Posts"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            className="absolute right-2 items-center top-1"
            onPress={() => handleSearch(search)}
          >
            <View className="rounded-md p-2">
              <FontAwesome name="search" size={24} color="#3F51B5" />
            </View>
          </TouchableOpacity>
        </View>

        {
          posts?.length === 0 ? (
            <View className="flex">
              <Text className="text-2xl font-semibold text-slate-800">
                No Posts Found
              </Text>
            </View>
          ) : (
            <>
              {
                search && searchedResults?.length > 0 && (
                  <View className="flex">
                    <View className="flex-row flex justify-between items-center my-3">
                      <Text className="text-2xl font-semibold text-slate-800">
                        Search Results for{" "}
                        <Text className="text-indigo-500">"{search}"</Text>
                      </Text>
                    </View>
                    {searchedResults?.map((post) => (
                      <>
                        {loading ? (
                          <View className="flex my-1" key={post?._id}>
                            <PostcardSkeleton key={post?._id} />
                          </View>
                        ) : (
                          <Pressable
                            key={post?._id}
                            className="my-1"
                          >
                            <Postcard key={post?._id} postData={post} navigation={navigation} />
                          </Pressable>
                        )}
                      </>
                    ))}
                  </View>
                )
              }
              <View className="flex">
                <View className="flex-row flex justify-between items-center my-3">
                  <Text className="text-2xl font-semibold text-indigo-500">
                    Recent Posts
                  </Text>
                </View>
                {posts?.map((post) => (
                  <>
                    {loading ? (
                      <View className="flex my-1" key={post?._id}>
                        <PostcardSkeleton key={post?._id} />
                      </View>
                    ) : (
                      <Pressable
                        key={post?._id}
                        className="my-1"
                      >
                        <Postcard key={post?._id} postData={post} navigation={navigation} />
                      </Pressable>
                    )}
                  </>
                ))}
              </View>
            </>
          )
        }
      </ScrollView >
    </SafeAreaView >
  );
};

export default Homescreen;
