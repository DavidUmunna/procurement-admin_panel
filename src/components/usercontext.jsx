import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();
const getInitialState=()=>{
    const  user=sessionStorage.getItem("user")
    return user ? JSON.parse(user) : null
}
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(getInitialState);
    useEffect(()=>{
        sessionStorage.setItem("user",JSON.stringify(user))
    },[user])
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
