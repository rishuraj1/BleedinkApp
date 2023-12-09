import { View, Text, Pressable, Share, SafeAreaView, Touchable, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { UserButton, timeParser } from ".";
import { AntDesign, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP } from "react-native-responsive-screen";
import Animated, { BounceInUp } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useDataStore } from "../store/store";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Postcard = ({ postData, setPosts, posts }) => {
  const thisUser = useDataStore((state) => state.user);
  const [isLiked, setIsLiked] = useState(postData?.like?.includes(thisUser?._id));
  const [post, setPost] = useState(postData);
  const [author, setAuthor] = useState(post?.createdBy);

  const handleShare = async () => {
    console.log("share");
    try {
      const result = await Share.share({
        message: `Check out this post on BleedInk: ${post?.title}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with activity type of", result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLike = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const user = JSON.parse(userData);
    console.log(user?.access_token, post?._id, "this user");
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      }
      const response = await axios.patch(`${baseUrl}/post/like/${post?._id}`, {}, options)
      console.log(response?.data, "like response");
      const updatedPost = response?.data;
      setPosts([...posts, updatedPost])
      setPost(updatedPost);
      console.log(post?.like?.includes(thisUser?._id), thisUser?._id, "is liked");
    } catch (error) {
      console.log(error, "like error");
    }
  }

  useEffect(() => {
    setIsLiked(post?.like?.includes(thisUser?._id));
  }, [post, setPost, setIsLiked])


  const navigation = useNavigation();


  return (
    <Animated.View
      style={{
        backgroundColor: "#fff",
        padding: 7,
        marginVertical: 1,
        borderRadius: 5,
        elevation: 3,
      }}
    >
      <Pressable
        onPress={() => navigation.navigate('Post', {
          postId: post?._id,
          endpoint: post?.endpoint,
          title: post?.title,
          userId: post?.createdBy?._id,
          username: post?.createdBy?.userName,
          header: post?.title
        })}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <UserButton
              userImage={author?.imageUrl}
              onPress={() => navigation.navigate('Profile', {
                username: author?.userName === thisUser?.userName ? "Your Profile" : author?.userName,
                userId: author?._id,
              })}
              width={heightPercentageToDP(6)}
              height={heightPercentageToDP(6)}
            />
            <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(3) }} className="text-indigo-500">
              {author?.userName}
            </Text>
          </View>
          <Text style={{ marginLeft: 5 }}>
            {post?.createdAt}
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
          {post?.title}
        </Text>
        <Text style={{ fontSize: 16 }}>{post?.content?.slice(0, 100)}...Read More</Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleLike}>
            {
              isLiked ? (
                <Ionicons name="heart" size={24} color="indigo" />
              ) : (
                <Ionicons name="heart-outline" size={24} color="indigo" />
              )
            }
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>{post?.like?.length}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="message-circle" size={24} color="indigo" />
          <Text style={{ marginLeft: 5 }}>{post?.comment?.length}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleShare}>
            <AntDesign name="sharealt" size={24} color="indigo" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default memo(Postcard);