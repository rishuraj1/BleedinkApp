import { View, Text, SafeAreaView, Image, Pressable, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import { Button, Postcard, PostcardSkeleton, UserButton } from "../components";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDataStore } from "../store/store";
import axios from "axios";
import { Usericon } from "../../assets";
import { Form, ScrollView, TextArea } from "tamagui";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SwipeListView } from 'react-native-swipe-list-view';

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
  const [editModal, setEditModal] = useState(false);
  const [postData, setPostData] = useState(null);
  const [title, setTitle] = useState(postData?.title);
  const [content, setContent] = useState(postData?.content);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  // console.log(thisUser, "this user");
  // console.log(isThisUser, "is this user");

  const getPosts = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${baseUrl}/post?userId=${userId || thisUser?._id || user?._id}`);
      const data = await response?.data?.data;
      setPosts(data);
      console.log(posts, "posts");
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  }

  const getUser = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const thisUser = JSON.parse(userData);
    // console.log(user, "user");
    try {
      const res = await axios.get(`${baseUrl}/user/getUser?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`,
        },
      });
      setUser(res?.data);
      // console.log(user, "user data from profile");
    } catch (err) {
      console.log(err, "error");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

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

  const editPost = (data) => {
    setPostData(data);
    console.log(typeof (data?._id), "data");
    setTitle(data?.title);
    setContent(data?.content);
    setEditModal(true);
  }

  const deletePost = (item) => {
    setPostData(item);
    // console.log(item?._id, "item");
    setDeleteModal(true);
  }

  const HiddenItemWithActions = ({ data, onEdit, onDelete }) => {
    return (
      <View style={{
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 5,
      }}>
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 75,
            paddingRight: 17,
            backgroundColor: 'indigo',
            right: 75,
          }}
          onPress={onEdit}>
          <Text className="font-semibold text-white text-base">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 75,
            paddingRight: 17,
            backgroundColor: 'red',
            right: 0,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}
          onPress={onDelete}>
          <Text className="font-semibold text-white text-base">Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderHiddenItems = (item, onEdit, onDelete) => {
    return (
      <HiddenItemWithActions
        data={item}
        onEdit={() => editPost(item)}
        onDelete={() => deletePost(item)}
      />
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(postData, "post data");
    if (!title || !content) {
      setIsError("Please fill all the fields!");
      return setTimeout(() => setIsError(false), 3000);
    }
    if (title === postData?.title && content === postData?.content) {
      setIsError("No changes made! Please edit the post");
      return setTimeout(() => setIsError(false), 3000);
    }
    try {
      setIsSubmitted(true);
      const userData = await AsyncStorage.getItem("userData");
      const thisUser = JSON.parse(userData);
      const data = {
        id: postData?._id,
        title,
        content,
      }
      const options = {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`,
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.patch(`${baseUrl}/post/update`, data, options);
      console.log(response?.config?.data, "response");
      getPosts();
    } catch (err) {
      console.log(err, "error");
    } finally {
      setIsSubmitted(false);
      setEditModal(false);
    }
  }

  const handleDeletePost = async ({ postId }) => {
    const userData = await AsyncStorage.getItem("userData");
    const thisUser = JSON.parse(userData);
    console.log(thisUser?.access_token, "access");
    try {
      const options = {
        headers: {
          'Authorization': `Bearer ${thisUser?.access_token}`,
        },
      }
      const response = await axios.delete(`${baseUrl}/post/delete/${postId}`, options);
      console.log(response, "response");
      getPosts();
    } catch (err) {
      console.log(JSON.stringify(err?.response), "error");
    } finally {
      setDeleteModal(false);
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
      <View className="flex-1 items-center justify-center">
        {
          isThisUser ? (
            <SwipeListView
              style={{ flex: 1, marginBottom: 1 }}
              data={posts} keyExtractor={(item) => item?._id}
              renderItem={({ item }) => <Postcard postData={item} navigation={navigation} />}
              renderHiddenItem={({ item }) => (
                <HiddenItemWithActions
                  data={item}
                  onEdit={() => editPost(item)}
                  onDelete={() => deletePost(item)}
                />
              )}
              ListEmptyComponent={({ item }) => {
                return refreshing ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <View className="flex-row items-center justify-between p-2">
                      <PostcardSkeleton />
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: heightPercentageToDP('10%'),
                    }}
                  >
                    <Text>No posts to show</Text>
                  </View>
                )
              }}
              leftOpenValue={75}
              rightOpenValue={-150}
              extraData={posts}
              onRefresh={getPosts}
              refreshing={refreshing}
            />
          ) : (
            <FlatList
              style={{ flex: 1, marginBottom: 1 }}
              data={posts}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <Postcard
                  postData={item}
                  setPosts={setPosts}
                  navigation={navigation}
                  posts={posts}
                />
              )}
              ListEmptyComponent={({ item }) => {
                return refreshing ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <View className="flex-row items-center justify-between p-2">
                      <PostcardSkeleton />
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: heightPercentageToDP('10%'),
                    }}
                  >
                    <Text>No posts to show</Text>
                  </View>
                )
              }}
              extraData={posts}
            />
          )
        }
      </View>
      {
        editModal &&
        (
          <Modal
            visible={editModal}
            animationType="fade"
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View className="flex-row items-center justify-between p-2">
              <Text className="text-2xl font-semibold text-slate-700 mt-2">Edit Post</Text>
              <TouchableOpacity onPress={() => setEditModal(false)} className="rounded-sm my-3 items-center">
                <Ionicons name="close-sharp" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <View className="flex-1 items-start justify-start p-2">
              <View className="flex items-start justify-start">
                <Text className="text-xl font-semibold text-slate-700 mt-2">Post Title</Text>
                <TextInput
                  onChangeText={setTitle}
                  value={title}
                  placeholder='Enter blog title...'
                  style={{
                    height: heightPercentageToDP('5%'),
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 20,
                    padding: 10,
                    backgroundColor: 'white',
                    fontSize: heightPercentageToDP('2.5%'),
                    borderRadius: 5,
                    width: widthPercentageToDP('95%')

                  }}
                />
              </View>
              <View className="flex items-start justify-start">
                <Text className="text-xl font-semibold text-slate-700 mt-2">Post Content</Text>
                <TextArea
                  onChangeText={setContent}
                  value={content}
                  height={heightPercentageToDP('30%')}
                  textAlign='left'
                  alignItems='flex-start'
                  marginBottom={20}
                  style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 10,
                    backgroundColor: 'white',
                    fontSize: heightPercentageToDP('2.5%'),
                    borderRadius: 5,
                    width: widthPercentageToDP('95%')
                  }}
                />
              </View>
              {
                isError && (
                  <Text className="text-red-500 text-md font-semibold text-center">{isError}</Text>
                )
              }
              <Button
                type="submit"
                bgcolor="indigo"
                width={"100%"}
                onPress={handleSubmit}
              >
                {`${isSubmitted ? 'Updating...' : 'Update blog'}`}
              </Button>
            </View>
          </Modal>
        )
      }

      {
        deleteModal &&
        <Modal transparent={true} visible={deleteModal} animationType="fade">
          <View style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View style={{
              backgroundColor: "white",
              width: "90%",
              padding: 20,
              borderRadius: 10
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Delete Comment</Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>You are about to delete this post. Are you sure ?</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Pressable onPress={() => setDeleteModal(false)}>
                  <Text style={{ fontSize: 16, color: "red", fontWeight: "bold" }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={() => {
                  console.log(postData?._id, "delete post id");
                  handleDeletePost({ postId: postData?._id });
                  setDeleteModal(false);
                }}>
                  <Text style={{ fontSize: 16, color: "green", fontWeight: "bold" }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      }
    </SafeAreaView>
  );
};

export default Userscreen;
