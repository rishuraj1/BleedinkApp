import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
// https://bloggler-backend.vercel.app/api/user/getUser?id=6569de1ee342cc6423941c90'

export const fetchUser = async (userId) => {
  const userData = await AsyncStorage.getItem("userData");
  console.log(userData);
  try {
    const response = await axios.get(
      `${baseUrl}/user/getUser?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(userData)?.access_token}`,
        },
      }
    );
    // console.log(response?.data, "response");
    return response?.data;
  } catch (error) {
    console.log(error, "error fetching user");
  }
};
