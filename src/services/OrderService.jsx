import axios from "axios";
//const circuitBreaker=require("opossum")

const API_URL = "http://192.168.0.185:5000/api"; //  backend URL

const orders="orders"



export const getOrders = async (role) => {
  try {
    const token=localStorage.getItem("authToken")
    console.log(token)
    const response = await axios.get(`${API_URL}/${orders}`,{headers:{Authorization:`Bearer ${token}`},withCredential:true});
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


export const createOrder = async ({ formData, orderData }) => {
  try {
    console.log("Order Data:", orderData);

    const requests = [];

    // Check if formData contains a file before uploading
    if (formData && formData.has("files")) {
      requests.push(
        axios.post(`${API_URL}/fileupload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
    }

    // Send the order even if no file is uploaded
    if (orderData && Object.keys(orderData).length > 0) {
      requests.push(axios.post(`${API_URL}/orders`, orderData));
    } else {
      console.warn("No order data provided.");
    }

    const results = await Promise.allSettled(requests);

    const fileResponse = results[0]?.status === "fulfilled" ? results[0].value : null;
    const orderResponse = results[1]?.status === "fulfilled" ? results[1].value : null;

    return { file: fileResponse?.data, order: orderResponse?.data };
  } catch (error) {
    console.error("Error creating order:", error);
  }
};


export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orders}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};
export const downloadFile = async (fileName) => {
  try {
    const response_2 = await axios.get(`${API_URL}/fileupload/download/${fileName}`, { responseType: "blob" });
    return response_2.data;
  } catch (err) {
    console.error({ err });
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${API_URL}/${orders}/${orderId}`);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};


