import axios from "axios";

const API_URL = "http://localhost:5000/"; // Update with your backend URL

export const getOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${API_URL}/${orderId}`);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};
