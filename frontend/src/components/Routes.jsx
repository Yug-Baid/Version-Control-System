import React, { useEffect } from 'react'
import { useAuth } from '../AuthContext'
import {useNavigate,useRoutes} from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Login from './Auth/Login'
import Signup from './Auth/Signup'
import Profile from './User/Profile'
import CreateRepo from './Repo/CreateRepo'

const ProjectRoutes = () => {
    const {currentUser,setCurrentUser} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        const userIdFromSystem = localStorage.getItem('userId')

        if(!userIdFromSystem && !currentUser){
            setCurrentUser(userIdFromSystem)
        }

        if(!userIdFromSystem && !["/auth","/signup"].includes(window.location.pathname)){
            navigate("/auth")
        }

        if(userIdFromSystem && window.location.pathname == "/auth"){
            navigate('/')
        }

    },[currentUser,navigate,setCurrentUser])

    const element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
         {
            path:"/auth",
            element:<Login/>
        },
         {
            path:"/signup",
            element:<Signup/>
        },
         {
            path:"/profile",
            element:<Profile/>
        },
         {
            path:"/create",
            element:<CreateRepo/>
        },
    ])

    return element
}

export default ProjectRoutes