import { View, Text } from "react-native";
import React from "react";

const PostcardSkeleton = () => {
  return (
    <View className="bg-white flex w-full justify-center border-b-2 rounded-md border-slate-300 p-2">
      <View className="flex-row flex gap-2 items-start justify-between">
        <View className="flex-row items-start justify-center">
          <View className="flex w-14 h-14 bg-slate-300 rounded-full"></View>
          <Text className="font-semibold w-20 bg-slate-300 mx-2 rounded-md mt-2">
          </Text>
        </View>
        <View>
          <Text className="bg-slate-300 w-16 mt-2 rounded-md">
          </Text>
        </View>
      </View>
      <View className="flex-1 py-2">
        <Text className="font-semibold rounded-sm bg-slate-300 w-full my-1"></Text>
        <Text className="font-semibold rounded-sm bg-slate-300 w-full my-1"></Text>
      </View>
      <View className="flex flex-row justify-between p-2">
        <Text className="font-semibold rounded-full bg-slate-300 w-7 h-7 my-1"></Text>
        <Text className="font-semibold rounded-full bg-slate-300 w-7 h-7 my-1"></Text>
        <Text className="font-semibold rounded-full bg-slate-300 w-7 h-7 my-1"></Text>
      </View>
    </View>
  );
};

export default PostcardSkeleton;
