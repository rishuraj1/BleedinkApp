import { View, Text, Pressable, Share, SafeAreaView } from "react-native";
import React, { memo, useEffect } from "react";
import { UserButton, timeParser } from ".";
import { AntDesign, FontAwesome5, Feather } from '@expo/vector-icons';
import { heightPercentageToDP } from "react-native-responsive-screen";
import Animated, { BounceInUp } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useDataStore } from "../store/store";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Postcard = ({ postData }) => {
  console.log(postData, "postdata");

  const thisUser = useDataStore((state) => state.user);
  const { userName, userId } = thisUser;
  // console.log("this user", thisUser);

  const handleShare = async () => {
    console.log("share");
    try {
      const result = await Share.share({
        message: `Check out this post on BleedInk: ${postData?.title}`,
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
    console.log(thisUser?.access_token, "this user");
    const response = await axios.patch(`${baseUrl}/post/like/${postData?._id}`, {
      headers: {
        Authorization: `Bearer ${thisUser?.access_token}`
      }
    })
    console.log(response, "like res");
  } catch (error) {
    console.log(error);
  }
}

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
        postId: postData?._id,
        endpoint: postData?.endpoint,
        title: postData?.title,
        userId: postData?.createdBy?._id,
        username: postData?.createdBy?.userName,
        header: postData?.title
      })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <UserButton
            userImage={postData?.createdBy?.imageUrl}
            onPress={() => navigation.navigate('Profile', {
              username: postData?.createdBy?.userName,
              userId: postData?.createdBy?._id,
            })}
            width={heightPercentageToDP(6)}
            height={heightPercentageToDP(6)}
          />
          <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(3) }} className="text-indigo-500">
            {postData?.createdBy?.userName}
          </Text>
        </View>
        <Text style={{ marginLeft: 5 }}>
          {postData?.createdAt}
        </Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
        {postData?.title}
      </Text>
      <Text style={{ fontSize: 16 }}>{postData?.content}</Text>
    </Pressable>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Pressable onPress={handleLike} style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="heart" size={24} color="black" />
        <Text style={{ marginLeft: 5 }}>{postData?.likes?.length || 0}</Text>
      </Pressable>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Feather name="message-circle" size={24} color="black" />
        <Text style={{ marginLeft: 5 }}>{postData?.comments?.length || 0}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable onPress={handleShare}>
          <AntDesign name="sharealt" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  </Animated.View>
);
};

export default memo(Postcard);