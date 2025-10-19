import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaGithub, FaSearch, FaBell, FaPlus, FaChartBar, FaUsers } from "react-icons/fa";

const Navbar = ({username}) => {
  if(!username){
    return <div>Loading...</div>
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
      <Link to={"/profile"} style={{textDecoration:"none"}}>
    
        <div className="profile">
          <span className="profile-initial">{username.slice(0,1).toUpperCase()}</span>
        </div>
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;
