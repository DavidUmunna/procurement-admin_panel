import {connect} from "react-redux"

import React,{useState} from "react"
import { searchbyname } from "../js/actions/actions"

const mapdispatchtoprop=(dispatch)=>{
    return {
        searchbyname:name=>dispatch(searchbyname(name))
    }

}

const Searchbar=(props)=>{
    const [search,setsearch]=useState('')


    const handleSearch=(e)=>{
       
        setsearch(e.target.value)
       

    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        if (search.trim()===""){
            alert("please enter a search term")
            return
        }
        props.searchbyname(search)
    }

    return (
        <div>
            <div className="flex justify-center">
                <input 
                type="text" 
                placeholder="enter search"
                value={search}
                onChange={handleSearch}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
                <button className="bg-blue-500 text-white rounded-lg  hover:bg-blue-600 transition px-3 py-1" onClick={handleSubmit}
                 >Search</button>
            </div>

        </div>
    )
}

export default connect(null,mapdispatchtoprop)(Searchbar)