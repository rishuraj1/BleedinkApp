const baseUrl = process.env.EXPO_PUBLIC_API_URL;
import axios from "axios";

export const fetchPosts = async () => {
  const respose = await axios.get(`${baseUrl}/post?limit=500`);
  return respose.data;
};
