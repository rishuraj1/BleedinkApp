import { Image, Pressable } from "react-native";
import React from "react";
import { Usericon } from "../../assets";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const UserButton = ({ onPress, width, height }) => {
  return (
    <Pressable onPress={onPress} className="bg-indigo-500 rounded-full">
      <Image
        source={Usericon}
        style={{ width: width, height: height, borderRadius: 100 }}
      />
    </Pressable>
  );
};

export default UserButton;
