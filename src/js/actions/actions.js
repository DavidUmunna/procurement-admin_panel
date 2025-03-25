import {SEARCH_BY_DATE} from "../constants/action-types"
import {SEARCH_BY_NAME} from "../constants/action-types"


export const searchbyname=(name)=>{
    return {
        type:SEARCH_BY_NAME,
        payload:name
    }
}
export const searchbydate=(date)=>{
    return {
        type:SEARCH_BY_DATE,
        payload:date
    }
}