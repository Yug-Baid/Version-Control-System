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

    useEffect(()=>{
        const userId = localStorage.getItem('userId')
        if(userId){
            setCurrentUser(userId)
        }
    },[])

    const value = {
        currentUser,setCurrentUser
    }

    return <authContext.Provider value={value}>{children}</authContext.Provider>
}