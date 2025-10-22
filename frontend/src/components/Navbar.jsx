  import { Link } from "react-router-dom";
  import "./Navbar.css";
  import { FaBars, FaGithub, FaSearch, FaBell, FaPlus, FaChartBar, FaUsers  } from "react-icons/fa";
  import { IoIosLogOut } from "react-icons/io";
  import { CiUser } from "react-icons/ci";
  import { RiGitRepositoryLine } from "react-icons/ri";
  import { FaFreeCodeCamp } from "react-icons/fa";
  import { useEffect, useInsertionEffect, useState } from "react";
import { useAuth } from "../AuthContext";

  const Navbar = ({username}) => {

    const {setCurrentUser} = useAuth()
    const [change,setChange] = useState(false) 

      const handleProfileClick = ()=>{
       setChange((prev)=>!prev)
    }

  
    return (
      <nav className="navbar">
        {/* Left Section */}
        <div className="nav-left">
          <button className="menu-btn">
            <FaBars />
          </button>
          <Link to={"/"}>
          <FaGithub className="github-logo" />   
          </Link>
          <Link to={"/"} style={{textDecoration:"none"}}>

          <span className="nav-title">Dashboard</span>
                  </Link>
        </div>

        {/* Center Search */}
        <div className="nav-center">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Type / to search" />
          </div>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <button className="icon-btn"><FaUsers /></button>
          <Link to={"/create"}>
          <button className="icon-btn"><FaPlus /></button>
          </Link>
          <button className="icon-btn"><FaBell /></button>
          <button className="icon-btn"><FaChartBar /></button>
      

       
        <div className="profile" id="profile" onClick={()=>handleProfileClick()} style={{cursor:"pointer"}}>
            <span className="profile-initial">{username ? username.slice(0,1).toUpperCase(): "U"}</span>
            <div className={`dropDown ${change ? 'open' : ''}`} style={{position:"absolute",color:"white",bottom:"-180px",zIndex:"99",right:"20px",background:"#010409",width:"150px",borderRadius:"10px",border:"1px solid #656c76",flexDirection:"column",justifyContent:"center",padding:"20px 20px 20px 4px",fontSize:"13px",fontWeight:"500"}}>
              <div style={{borderBottom:"1px solid #656c767a"}}>
                <Link to={"/profile"}>
              <p className="icon-btn-profile"><CiUser style={{fontSize:"16px"}}/>Profile</p></Link>
              <p className="icon-btn-profile"><FaFreeCodeCamp  style={{fontSize:"18px"}} />Contributions</p>
              <p style={{marginBottom:"10px"}} className="icon-btn-profile"><RiGitRepositoryLine  style={{fontSize:"16px"}} />Repositories</p>
              </div>
              <div style={{marginTop:"5px"}}>
              <button onClick={()=>{
                localStorage.removeItem('token')
                localStorage.removeItem('userId')
                setCurrentUser(null)
              }}
              style={{border:"none",outline:"none",padding:"5px 60px 5px 8px"}}
               className="icon-btn-profile"><IoIosLogOut  style={{fontSize:"18px"}}/>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;
