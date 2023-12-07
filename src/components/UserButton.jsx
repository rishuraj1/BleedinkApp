import { Image, Pressable } from "react-native";
import React from "react";
import { Usericon } from "../../assets";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const UserButton = ({ onPress, width, height, userImage }) => {
  return (
    <Pressable onPress={onPress} className="bg-indigo-500 rounded-full">
      <Image
        source={userImage ? { uri: userImage } : Usericon}
        style={{ width: width, height: height, borderRadius: 100, borderWidth: 2, borderColor: 'white', objectFit: 'contain' }}
      />
    </Pressable>
  );
};

export default UserButton;
