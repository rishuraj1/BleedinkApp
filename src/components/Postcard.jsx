import { View, Text, Pressable, Share } from "react-native";
import React from "react";
import { UserButton, timeParser } from ".";
import { AntDesign, FontAwesome5, Feather } from '@expo/vector-icons';
import { heightPercentageToDP } from "react-native-responsive-screen";

const Postcard = ({ postData, navigation }) => {
  // console.log(postData?.title, "postdata");

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

  return (
    <View className="bg-white flex justify-center border-b-2 rounded-md border-slate-300 p-2">
      <Pressable onPress={() => navigation.navigate('Post', {
        endpoint: postData?.endpoint,
        header: postData?.title,
        userId: postData?.createdBy?._id,
      })}>
        <View className="flex-row flex gap-2 items-start justify-between">
          <View className="flex-row items-start justify-center">
            <UserButton
              user={postData?.createdBy}
              onPress={() => navigation.navigate('Profile', {
                userId: postData?.createdBy?._id,
                username: postData?.createdBy?.userName,
              })}
              width={heightPercentageToDP(6)}
              height={heightPercentageToDP(6)}
            />
            <Text className="text-xl font-semibold text-slate-900 mx-2">
              {postData?.createdBy?.userName}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-slate-600">
              {timeParser(postData?.createdAt)}
            </Text>
          </View>
        </View>
        <View className="flex-1 py-2">
          <Text className="text-lg font-semibold">{postData?.title}</Text>
          <Text className="text-sm font-semibold">{postData?.content?.slice(0, 30)}...</Text>
        </View>
      </Pressable>

      {/* likes comment share array */}
      <View className="flex flex-row justify-between p-2">
        <View className="flex flex-row items-center justify-center gap-1">
          <AntDesign name="hearto" size={heightPercentageToDP(2.8)} color="#404e5a" />
          <Text className="text-lg text-slate-600">{postData?.likes?.length}</Text>
        </View>

        <View className="flex flex-row items-center justify-center gap-1">
          <FontAwesome5 name="comment-dots" size={heightPercentageToDP(2.8)} color="#404e5a" />
          <Text className="text-lg text-slate-600">{postData?.comments?.length}</Text>
        </View>
        <Pressable onPress={handleShare}>
          <Feather name="share-2" size={heightPercentageToDP(2.8)} color="#404e5a" />
        </Pressable>
      </View>
    </View>
  );
};

export default Postcard;
