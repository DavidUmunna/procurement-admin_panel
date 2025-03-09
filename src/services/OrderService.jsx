import axios from "axios";
const circuitBreaker=require("opossum")

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
const Breaker=new circuitBreaker(getOrders,options)
Breaker.fallback(() => ({ message: "Service is down. Please try again later." }))

Breaker.fire().then((response)=>console.log(response.data))
.catch(err=>console.error("circuit breaker triggered",err))

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
const Breaker_createOrder= new circuitBreaker(createOrder,options)
Breaker_createOrder.fallback(() => ({ message: "Service is down. Please try again later." }))

Breaker_createOrder.fire().then((response)=>console.log(response.data))
.catch(err=>console.error("circuit breaker triggered",err))

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orders}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};
const Breaker_updateOrder=new circuitBreaker(updateOrderStatus,options)
Breaker_updateOrder.fallback(() => ({ message: "Service is down. Please try again later." }))

Breaker_createOrder.fire().then((response)=>console.log(response.data))
.catch(err=>console.error("circuit breaker triggered",err))

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${API_URL}/${orderId}`);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

const Breaker_deleteOrder=new circuitBreaker(deleteOrder,options)
Breaker_deleteOrder.fallback(() => ({ message: "Service is down. Please try again later." }))

Breaker_createOrder.fire().then((response)=>console.log(response.data))
.catch(err=>console.error("circuit breaker triggered",err))
