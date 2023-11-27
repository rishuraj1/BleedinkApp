import { Pressable, Text } from "react-native";
import React from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";

const Button = ({ children, onPress, bgcolor, width }) => {
  return (
    <Pressable
      onPress={onPress}
      className={`p-2 rounded-md items-center`}
      style={{ width: width, backgroundColor: bgcolor }}
    >
      <Text className="text-white font-semibold text-xl">{children}</Text>
    </Pressable>
  );
};

export default Button;
