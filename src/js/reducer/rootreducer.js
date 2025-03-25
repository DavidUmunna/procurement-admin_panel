//import {searchbyname} from "../actions/actions"
import { SEARCH_BY_NAME } from "../constants/action-types";

const initialstate={
    searchResults:[]
}

const rootReducer=(state=initialstate,action)=>{
    switch(action.types){
        case SEARCH_BY_NAME:
            return {

                ...state,
                searchResults:action.payload
            }
        default:
            return state;
    }
}

export default rootReducer