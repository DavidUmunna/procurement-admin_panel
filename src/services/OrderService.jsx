import axios from "axios";

const API_URL = "http://localhost:5000/api"; //  backend URL

const orders="orders"

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/${orders}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    console.log(orderData)
    const response = await axios.post(`${API_URL}/${orders}`, orderData);
    console.log(response)
    return response.data;
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

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${API_URL}/${orderId}`);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};
