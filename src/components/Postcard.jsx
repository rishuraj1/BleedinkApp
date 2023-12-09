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

const Postcard = ({ postData, setPosts }) => {
  // console.log(postData, "postdata");

  const thisUser = useDataStore((state) => state.user);
  // console.log("this user", thisUser);
  const [isLiked, setIsLiked] = useState(postData?.like?.includes(thisUser?._id));
  const [post, setPost] = useState(postData);
  // console.log(post, "post");

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
    try {
      const userData = await AsyncStorage.getItem("userData");
      const thisUser = JSON.parse(userData);
      console.log(thisUser?.access_token, post?._id, "this user");
      const options = {
        headers: {
          Authorization: `Bearer ${thisUser?.access_token}`
        }
      }
      const response = await axios.patch(`${baseUrl}/post/like/${post?._id}`, {}, options)
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error, "like error");
    }
  }

  const navigation = useNavigation();

  useEffect(() => {
    setIsLiked(post?.like?.includes(thisUser?._id));
  }, [post?.like, thisUser?._id]);


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
              userImage={post?.createdBy?.imageUrl}
              onPress={() => navigation.navigate('Profile', {
                username: post?.createdBy?.userName,
                userId: post?.createdBy?._id,
              })}
              width={heightPercentageToDP(6)}
              height={heightPercentageToDP(6)}
            />
            <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(3) }} className="text-indigo-500">
              {post?.createdBy?.userName}
            </Text>
          </View>
          <Text style={{ marginLeft: 5 }}>
            {post?.createdAt}
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
          {post?.title}
        </Text>
        <Text style={{ fontSize: 16 }}>{post?.content}</Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Pressable onPress={handleLike} style={{ flexDirection: "row", alignItems: "center" }}>
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
        </Pressable>
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