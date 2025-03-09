import axios from "axios";
import { debounce } from "lodash";

// Debounced API call function
const debouncedRequest = debounce(async (data) => {
  try {
    const response = await axios.post("/api/create", data);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("API Request Failed:", error);
  }
}, 500); 

// Call this function when sending a request
export const sendRequest = (data) => {
  debouncedRequest(data);
};
