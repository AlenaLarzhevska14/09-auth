import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const baseURL = `${apiUrl}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
