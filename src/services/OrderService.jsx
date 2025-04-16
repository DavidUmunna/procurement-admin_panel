import axios from "axios";
//const circuitBreaker=require("opossum")

const API_URL = "/api"; //  backend URL

const orders="orders"



export const getOrders = async () => {
  try {
    const token=localStorage.getItem("authToken")
    console.log(token)
    const response = await axios.get(`${API_URL}/${orders}`,{headers:{Authorization:`Bearer ${token}`, 
      "ngrok-skip-browser-warning": "true"},
      withCredential:true});
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};export const get_user_orders = async ( email ) => {
  try {
    const requests = [];

    if (email) {
      const token=localStorage.getItem("authToken")
      requests.push(axios.get(`${API_URL}/${orders}/${email}`,{headers:{Authorization:`Bearer ${token}`},withCredentials:true}));
      requests.push(axios.get(`${API_URL}/fileupload/${email}`, { responseType: "blob" },{headers:{Authorization:`Bearer ${token}`},withCredentials:true}));
    }

    const results = await Promise.allSettled(requests);

    const orderResponse = results[0].status === "fulfilled" ? results[0].value : null;
    const fileResponse = results[1].status === "fulfilled" ? results[1].value : null;

    return { orders: orderResponse?.data, file: fileResponse };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {};
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
          headers: { "Content-Type": "multipart/form-data" 
            ,"ngrok-skip-browser-warning": "true",
          },
        })
      );
    }

    // Send the order even if no file is uploaded
    if (orderData && Object.keys(orderData).length > 0) {
      requests.push(axios.post(`${API_URL}/orders`, orderData,{headers:{ "ngrok-skip-browser-warning": "true"}}));
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
    const response = await axios.put(`api/${orders}/${orderId}`, { status },{headers:{ "ngrok-skip-browser-warning": "true"}});
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};
export const downloadFile = async (fileName) => {
  try {
    const response_2 = await axios.get(`api/fileupload/download/${fileName}`, { responseType: "blob" ,
      headers:{ "ngrok-skip-browser-warning": "true"}});
    return response_2.data;
  } catch (err) {
    console.error({ err });
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`api/${orders}/${orderId}`,{headers:{ "ngrok-skip-browser-warning": "true"}});
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};


