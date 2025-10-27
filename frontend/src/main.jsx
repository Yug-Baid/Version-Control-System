import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from './AuthContext.jsx'
import ProjectRoutes from './components/Routes.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

createRoot(document.getElementById('root')).render(
  <Authprovider>
    <Router>
    <ProjectRoutes />
    </Router>
     </Authprovider>
  
)
