import {configureStore} from "@reduxjs/toolkit"
import  { logger } from "redux-logger"
import searchreducer from "../reducer/rootreducer"



const store=configureStore({
    reducer:{search:searchreducer}  ,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }).concat(logger)
})
export default store