import * as Sentry from "@sentry/react"
import axios from "axios";
import { getCookie } from "../components/Helpers";
import { isProd } from "../components/env";

const API_URL = `${process.env.REACT_APP_API_URL}/api`; //  backend URL
const orders="orders"

const csrf_token=getCookie("XSRF-TOKEN")



export const getOrders = async (page , limit ) => {
  try {


    const response = await axios.get(`${API_URL}/${orders}`,{
      params: { page, limit },
      headers:{
        
       
      "ngrok-skip-browser-warning":"true"},
      withCredentials:true});
    //console.log("response",response)
    return response.data;
  } catch (error) {
    if(isProd){

      Sentry.captureMessage("Error fetching orders")
      Sentry.captureException(error)
    }

    return [];
  }
};export const get_user_orders = async ( userId ,page,limit) => {
 
  try {
    const requests = [];

    if (userId) {
      const token=localStorage.getItem("sessionId")
      requests.push(axios.get(`${API_URL}/${orders}/${userId}`,{ params: {
                
                page,
                limit,
              },headers:{"x-session-id":token},withCredentials:true,"ngrok-skip-browser-warning": "true"}));
      requests.push(axios.get(`${API_URL}/fileupload/${userId}`, { responseType: "blob" },{headers:{"x-session-id":token},withCredentials:true,"ngrok-skip-browser-warning": "true"}));
    }
    
    const results = await Promise.allSettled(requests);
   

    const orderResponse = results[0].status === "fulfilled" ? results[0].value : null;
    const fileResponse = results[1].status === "fulfilled" ? results[1].value : null;

    return { orders: orderResponse?.data, file: fileResponse };
  } catch (error) {
    if(isProd){

      Sentry.captureMessage("Error fetching orders")
      Sentry.captureException(error)
    }

    return {};
  }
};


export const createOrder = async ({ formData, orderData }) => {
  try {
    let uploadedFileIds = [];
    //const token_csrf = getCookie('XSRF-TOKEN');
    
    // STEP 1: Upload files if present
  
    if (formData && formData.has("files")) {
      const fileResponse = await axios.post(`${API_URL}/fileupload/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
          "x-csrf-token":csrf_token,
      },
      withCredentials:true}
    );

      // Extract file IDs from response
      uploadedFileIds = fileResponse?.data?.files?._id;
    }

    // STEP 2: Attach file IDs if available
    if (uploadedFileIds.length > 0) {
      orderData.fileRefs = uploadedFileIds;
    }

    //  STEP 3: Always send order
    const orderResponse = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        "x-csrf-token":csrf_token,
        "ngrok-skip-browser-warning": "true",
      },
      withCredentials:true
    });

    return {
      file: uploadedFileIds,
      order: orderResponse,
    };
  } catch (error) {
    if(isProd){

      Sentry.captureMessage("Error creating order");
      Sentry.captureException(error);
    }
    return {
      file: null,
      order: null,
      error,
    };
  }
};



export const updateOrderStatus = async (orderId, status) => {
  try {
    const token_csrf = getCookie('XSRF-TOKEN');
    const response = await axios.put(`${API_URL}/${orders}/${orderId}`, { status },{headers:{ "x-csrf-token": token_csrf,"ngrok-skip-browser-warning": "true"},
      withCredentials:true});
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};
export const downloadFile = async (fileId,filename,onProgress) => {
  try {
   
    const response_2 = await axios.get(`${API_URL}/fileupload/download/${fileId}/${filename}`,{responseType: "blob" ,
      onDownloadProgress: (e) => {
      if (onProgress) onProgress(e);
    },
      headers:{ "ngrok-skip-browser-warning": "true"}});
    return response_2.data;
  } catch (err) {
    if (isProd)Sentry.captureException(err)
    
  }
};

export const deleteOrder = async (orderId) => {
  try {
    //const token_csrf = getCookie('XSRF-TOKEN');
    await axios.delete(`${API_URL}/${orders}/${orderId}`,{headers:{"x-csrf-token":csrf_token, "ngrok-skip-browser-warning": "true"},
      withCredentials:true});
  } catch (error) {
    if(isProd){

      Sentry.captureMessage("Error deleting  orders")
      Sentry.captureException(error)
    }
    
  }
};


