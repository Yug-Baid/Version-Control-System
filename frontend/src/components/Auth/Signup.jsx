import { useState } from "react"
import "./Signup.css"
import { useAuth } from "../../AuthContext" 
import axios from "axios"


const Signup = () => {

  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const {setCurrentUser} = useAuth()

  const handleSignUp = async (e)=>{
      e.preventDefault()

      try {
        setLoading(true)
        const res = await axios.post("http://localhost:3000/signup",{
          email:email,
          username:username,
          password:password
        })

        localStorage.setItem("token",res.data.token)
        localStorage.setItem("userId",res.data.userId)
        setCurrentUser(res.data.userId)

        setLoading(false)
        window.location.href = "/"


      } catch (error) {
        console.log(error)
        alert("Signup Failed")
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
          <label style={{alignSelf:"start"}} htmlFor="username">Username</label>
          <input style={{background:"transparent",borderRadius:"5px"}} autoComplete="off" type="text" id="username" name="username"  value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
         <div className="form-indv">
          <label style={{alignSelf:"start"}} htmlFor="email">Email</label>
          <input style={{background:"transparent",borderRadius:"5px"}} autoComplete="off" type="text" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="form-indv">
          <label  style={{alignSelf:"start"}} htmlFor="password">Password</label>
          <input style={{background:"transparent",borderRadius:"5px"}} autoComplete="off" type="password" id="password" name="password"  value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button className="button" onClick={handleSignUp} disabled={loading} >{loading ? "Loading..." : "SignUp"}</button>
      </div>
    </div>
  )
}

export default Signup