import React from "react";
import { Text } from "react-native";
import moment from "moment";

const Timeparser = ({ timestamp }) => {
  const timeAgo = moment(timestamp).fromNow();
  return <Text>{timeAgo}</Text>;
};

export default Timeparser;
