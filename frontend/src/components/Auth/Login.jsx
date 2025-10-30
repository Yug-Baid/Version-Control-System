import { useEffect, useState } from "react"
import "./Signup.css"
import { useAuth } from "../../AuthContext" 
import axios from "axios"
import { Link } from "react-router-dom"
import './Login.css'


const Login = () => {
      const [email,setEmail] = useState('')
      const [password,setPassword] = useState('')
      const [loading,setLoading] = useState(false)
      const {setCurrentUser} = useAuth()
    
      const handleLogin = async (e)=>{
          e.preventDefault()
    
          try {
            setLoading(true)
            const res = await axios.post("3.7.71.159:3000/login",{
              email:email,
              password:password
            })
    
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("userId",res.data.userId)
            setCurrentUser(res.data.userId)
    
            setLoading(false)
            window.location.href = "/"
    
    
          } catch (error) {
            console.log(error)
            alert("Login Failed")
            setLoading(false)
          }
    
      }
    
      return (
        <div className="signup-page">
          <div style={{marginBottom:"20px", marginTop:"50px"}} className="header">
            <img width={70} src="/logo.svg" alt="" />
            <h2>Sign in to Github</h2>
          </div>
          <div className="form_data">
             <div className="form-indv">
              <label style={{alignSelf:"start"}} htmlFor="email">Email</label>
              <input style={{background:"transparent",borderRadius:"5px"}} autoComplete="off" type="text" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="form-indv">
              <label  style={{alignSelf:"start"}} htmlFor="password">Password</label>
              <input style={{background:"transparent",borderRadius:"5px"}} autoComplete="off" type="password" id="password" name="password"  value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div style={{display:"flex" , alignItems:"center",justifyContent:"space-between"}}>
              <div>
                 <p>Dosen't Have a Account ? </p>
              </div>
              <div >
                <Link className="signup-btn"  style={{textDecoration:"none"}} to={'/signup'}>Signup</Link>
              </div>
            </div>
            <button className="button" onClick={handleLogin} disabled={loading} >{loading ? "Loading..." : "Login"}</button>

          </div>
        </div>
      )
    
}

export default Login