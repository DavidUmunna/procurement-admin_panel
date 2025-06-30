import axios from "axios"
import * as Sentry from "@sentry/react"


export const fetch_RBAC=async()=>{
      try{

          const token = localStorage.getItem('authToken');
          const API_URL = `${process.env.REACT_APP_API_URL}/api`
          const rbacRes=await axios.post(`${API_URL}/roles&departments`,{ADMIN_ROLES_GENERAL:true},{headers: {
                Authorization: `Bearer ${token}`,
               
                "ngrok-skip-browser-warning": "true",
              },
              withCredentials: true,
            })
            return rbacRes
            
      }catch(error){
        Sentry.captureException(error)
  
      }
}

export const fetch_RBAC_DASH=async()=>{
  try{

     const token = localStorage.getItem('authToken');
          const API_URL = `${process.env.REACT_APP_API_URL}/api`
          const rbacRes=await axios.post(`${API_URL}/roles&departments`,{ADMIN_ROLES_DASHBOARD:true,GENERAL_ACCESS:true,DEPARTMENTAL_ACCESS:true},{headers: {
                Authorization: `Bearer ${token}`,
                
                "ngrok-skip-browser-warning": "true",
              },
              withCredentials: true,
            })
    return rbacRes

  }catch(error){
    Sentry.captureException(error)
  }
}

export const fetch_RBAC_ordermanagement=async()=>{
  try{

     const token = localStorage.getItem('authToken');
          const API_URL = `${process.env.REACT_APP_API_URL}/api`
          const rbacRes=await axios.post(`${API_URL}/roles&departments`,{ADMIN_ROLES_GENERAL:true,GENERAL_ACCESS_ORDERS:true,DEPARTMENTAL_ACCESS:true,APPROVALS_LIST:true},{headers: {
                Authorization: `Bearer ${token}`,
            
                "ngrok-skip-browser-warning": "true",
              },
              withCredentials: true,
            })
    return rbacRes

  }catch(error){
    Sentry.captureException(error)
  }
}
export const fetch_RBAC_department=async()=>{
  try{

     const token = localStorage.getItem('authToken');
          const API_URL = `${process.env.REACT_APP_API_URL}/api`
          const rbacRes=await axios.post(`${API_URL}/roles&departments`,{ADMIN_ROLES_DEPARTMENT:true},{headers: {
                Authorization: `Bearer ${token}`,
                
                "ngrok-skip-browser-warning": "true",
              },
              withCredentials: true,
            })
    return rbacRes

  }catch(error){
    Sentry.captureException(error)
  }
}

