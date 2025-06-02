import * as Sentry from "@sentry/react"
import axios from "axios";


const API_URL = `${process.env.REACT_APP_API_URL}/api`; //  backend URL
const orders="orders"



export const getOrders = async (page , limit ) => {
  try {
    const token=localStorage.getItem("authToken")
    
    const response = await axios.get(`${API_URL}/${orders}`,{
      params: { page, limit },
      headers:{Authorization:`Bearer ${token}`, 
      "ngrok-skip-browser-warning": "true"},
      withCredential:true});
    //console.log("response",response)
    return response.data;
  } catch (error) {
     Sentry.captureMessage("Error fetching orders")
      Sentry.captureException(error)

    return [];
  }
};export const get_user_orders = async ( userId ) => {
 
  try {
    const requests = [];

    if (userId) {
      const token=localStorage.getItem("authToken")
      requests.push(axios.get(`${API_URL}/${orders}/${userId}`,{headers:{Authorization:`Bearer ${token}`},withCredentials:true,"ngrok-skip-browser-warning": "true"}));
      requests.push(axios.get(`${API_URL}/fileupload/${userId}`, { responseType: "blob" },{headers:{Authorization:`Bearer ${token}`},withCredentials:true,"ngrok-skip-browser-warning": "true"}));
    }
    
    const results = await Promise.allSettled(requests);
   

    const orderResponse = results[0].status === "fulfilled" ? results[0].value : null;
    const fileResponse = results[1].status === "fulfilled" ? results[1].value : null;

    return { orders: orderResponse?.data, file: fileResponse };
  } catch (error) {
    Sentry.captureMessage("Error fetching orders")
    Sentry.captureException(error)

    return {};
  }
};


export const createOrder = async ({ formData, orderData }) => {
  try {
    //console.log("Order Data:", orderData);

    const requests = [];
    let hasfile=false

    // Check if formData contains a file before uploading
    if (formData && formData.has("files")) {
      const response_fileupload=axios.post(`${API_URL}/fileupload`, formData, {
          headers: { "Content-Type": "multipart/form-data" 
            ,"ngrok-skip-browser-warning": "true",
          },
        })
      requests.push(response_fileupload    
      );hasfile=true


    }
    
    // Send the order even if no file is uploaded
    if (orderData && Object.keys(orderData).length > 0) {
      const response_orderdetails=axios.post(`${API_URL}/orders`, orderData,{headers:{ "ngrok-skip-browser-warning": "true"}})
      requests.push(response_orderdetails);
    } else {
      Sentry.captureMessage("No order data provided")

    }
    const results = await Promise.allSettled(requests);
    //console.log("checking file",requests.length)
    //console.log(results.length)
    if (hasfile && results.length===2){

      const fileResponse = results[0]?.status === "fulfilled" ? results[0].value : results[0].reason;
      const orderResponse = results[1]?.status === "fulfilled" ? results[1].value : results[1].reason;
      
      return  { file: fileResponse, order: orderResponse };
    }else if (!hasfile&& results.length===1){
      const orderResponse = results[0]?.status === "fulfilled" ? results[0].value : results[0].reason;
      return {order:orderResponse}

    }else{
      return {order:null}
    }
   
    
    
    
  } catch (error) {
     Sentry.captureMessage("Error creating users")
          Sentry.captureException(error)
    console.error("Error creating order:", error);
  }
};


export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orders}/${orderId}`, { status },{headers:{ "ngrok-skip-browser-warning": "true"}});
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};
export const downloadFile = async (fileId) => {
  try {
    const response_2 = await axios.get(`${API_URL}/fileupload/download/${fileId}`, { responseType: "blob" ,
      headers:{ "ngrok-skip-browser-warning": "true"}});
    return response_2.data;
  } catch (err) {
    Sentry.captureException(err)
    
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${API_URL}/${orders}/${orderId}`,{headers:{ "ngrok-skip-browser-warning": "true"}});
  } catch (error) {
     Sentry.captureMessage("Error deleting  orders")
          Sentry.captureException(error)
    
  }
};


