import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "../reducer/rootreducer"
import  { logger } from "redux-logger"
import searchreducer from "../reducer/rootreducer"
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js"


const store=configureStore({
    reducer:{search:searchreducer}  ,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }).concat(logger)
})
export default store