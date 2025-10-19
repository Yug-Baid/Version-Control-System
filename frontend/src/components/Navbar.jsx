import "./Navbar.css";
import { FaBars, FaGithub, FaSearch, FaBell, FaPlus, FaChartBar, FaUsers } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="nav-left">
        <button className="menu-btn">
          <FaBars />
        </button>
        <FaGithub className="github-logo" />
        <span className="nav-title">Dashboard</span>
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
        <button className="icon-btn"><FaPlus /></button>
        <button className="icon-btn"><FaBell /></button>
        <button className="icon-btn"><FaChartBar /></button>
        <div className="profile">
          <span className="profile-initial">H</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
