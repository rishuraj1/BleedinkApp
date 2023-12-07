import { View, Text, SafeAreaView, ScrollView, Pressable } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Blogform } from "../components";

const Createpostscreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <ScrollView style={{
        height: heightPercentageToDP('100%'),
        padding: 20,
        marginTop: heightPercentageToDP('2%'),
      }}>
        <Text className="text-2xl font-semibold text-slate-800">
          Create Post
        </Text>
        <View className="flex" style={{
          height: heightPercentageToDP('100%'),
          marginTop: heightPercentageToDP('6%'),
        }}>
          <Blogform navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Createpostscreen;
