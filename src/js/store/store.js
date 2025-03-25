import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "../reducer/rootreducer"
import  { logger } from "redux-logger"



const store=configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }).concat(logger)
})

export default store;