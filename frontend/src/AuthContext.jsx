import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { createContext } from 'react'

const authContext = createContext()

export const useAuth = ()=>{
    return useContext(authContext)
}

export const Authprovider = ({children})=>{
    const [currentUser,setCurrentUser] = useState(null)
    const [userName,setUserName] = useState('')

    useEffect(()=>{
        const userId = localStorage.getItem('userId')
        if(userId){
            setCurrentUser(userId)
        }
    },[])

    useEffect(()=>{
         const userId = localStorage.getItem("userId");
        const fetchUserdata = async()=>{
            const userRes = await axios.get(`http://localhost:3000/getUser/${userId}`);
            setUserName(userRes.data.name || 'User');
        }
        fetchUserdata()
       
    },[])

    const value = {
        currentUser,setCurrentUser,userName,setUserName
    }

    return <authContext.Provider value={value}>{children}</authContext.Provider>
}