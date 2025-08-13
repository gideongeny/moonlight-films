import axios from "axios";
import { API_URL } from "./constants";

const instance = axios.create({
  baseURL: API_URL,
  params: {
    api_key: "8c247ea0b4b56ed2ff7d41c9a833aa77", // TMDB API key
  },
});

export default instance;
