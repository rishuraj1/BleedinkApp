import React from "react";
import { Text } from "react-native";
import moment from "moment";

const Timeparser = ({ timestamp }) => {
  const timeAgo = moment(timestamp).fromNow();
  // console.log(timeAgo);
  // console.log(timestamp, timeAgo);
  return <Text>{timeAgo}</Text>;
};

export default Timeparser;
