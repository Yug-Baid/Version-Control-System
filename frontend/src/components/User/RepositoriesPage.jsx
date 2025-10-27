// src/components/User/RepositoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar'; // Adjust path if needed
import { useAuth } from '../../AuthContext'; // To get current user info
import {
    FaSearch, FaStar, FaGlobe, FaLock, FaCode, FaBook, FaProjectDiagram, FaBoxes, FaRegStar,
    FaRegBuilding, FaMapMarkerAlt, FaLink, FaTwitter, // Profile icons
    FaTrophy, FaPlus, FaCaretDown // Achievements, New button icons
} from 'react-icons/fa'; // Import necessary icons

// --- CSS Styles --- (Consider moving to RepositoriesPage.css)
const repositoriesPageStyles = `
  .repositories-page-container {
    margin-top: 65px; /* Space for fixed Navbar */
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    min-height: calc(100vh - 70px);
    padding-bottom: 50px;
    position:absolute;
    right:0;
    left:0;
    top:0;
  }

  /* Profile Tabs Navigation */
  .profile-tabs-nav {
    display: flex;
    border-bottom: 1px solid #30363d;
    margin-bottom: 24px;
    padding: 0 24px;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    overflow-x: auto;
    scrollbar-width: none;
   }
  .profile-tabs-nav::-webkit-scrollbar { display: none; }
  .profile-tabs-nav a {
    padding: 16px; /* Slightly more padding */
    text-decoration: none;
    color: #8b949e;
    font-weight: 500;
    font-size: 14px;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease-in-out;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  .profile-tabs-nav a:hover {
    color: #c9d1d9;
    border-bottom-color: #30363d; /* Subtle hover border */
  }
  .profile-tabs-nav a.active {
    color: #c9d1d9;
    border-bottom-color: #f78166;
    font-weight: 600;
  }
  .profile-tabs-nav a svg { /* Style icons in tabs */
      font-size: 16px;
  }
  .profile-tabs-nav a span.count {
      background-color: #30363d;
      color: #c9d1d9; /* White count text */
      padding: 0px 6px; /* Smaller padding */
      border-radius: 2em;
      font-size: 12px;
      margin-left: 4px;
      line-height: 18px;
  }

  /* Main content layout */
  .repositories-content-layout {
    display: flex;
    flex-direction: column; /* Stack sidebar and main on smaller screens */
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    gap: 32px;
  }
  @media (min-width: 768px) { /* Apply side-by-side layout on medium screens and up */
      .repositories-content-layout {
          flex-direction: row;
          align-items: flex-start; /* Align top */
      }
  }


  /* Left Sidebar */
  .repositories-sidebar {
    width: 100%; /* Full width on small screens */
  }
  @media (min-width: 768px) {
      .repositories-sidebar {
          width: 296px; /* Fixed width on larger screens */
          flex-shrink: 0;
      }
  }
  .profile-avatar-large {
    width: 296px; /* Fixed size */
    height: 296px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 16px;
    border: 1px solid #30363d;
    background-color: #161b22; /* Placeholder bg */
    display: block; /* Center if needed */
    margin-left: auto;
    margin-right: auto;
  }
  .profile-username {
    font-size: 26px;
    line-height: 1.25;
    font-weight: 600;
    margin-bottom: 4px;
    color: #c9d1d9;
  }
  .profile-loginname { /* The gray login name */
      font-size: 20px;
      font-style: normal;
      font-weight: 300;
      line-height: 24px;
      color: #8b949e;
      margin-bottom: 16px;
  }
  .edit-profile-btn {
    background-color: #21262d;
    border: 1px solid rgba(240, 246, 252, 0.1); /* Lighter border */
    border-radius: 6px;
    color: #c9d1d9;
    padding: 5px 16px; /* Adjusted padding */
    width: 100%;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 16px;
    display: block; /* Make it block level */
  }
  .edit-profile-btn:hover {
    background-color: #30363d;
    border-color: #8b949e;
  }
  .profile-stats { /* Followers/Following */
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #8b949e;
  }
   .profile-stats a {
       color: #8b949e;
       text-decoration: none;
       display: flex;
       align-items: center;
       gap: 4px;
   }
   .profile-stats a:hover {
       color: #58a6ff;
   }
   .profile-stats strong {
       font-weight: 600;
       color: #c9d1d9;
   }
  .profile-details ul {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 14px;
      color: #c9d1d9;
  }
   .profile-details ul li {
       display: flex;
       align-items: center;
       gap: 8px;
       margin-bottom: 8px;
   }
   .profile-details ul li svg {
       color: #8b949e;
       font-size: 16px;
       width: 16px; /* Fixed width for alignment */
   }


  .achievements-section {
    margin-top: 16px;
    border-top: 1px solid #30363d;
    padding-top: 16px;
  }
  .achievements-section h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #c9d1d9;
  }
  .achievement-placeholder { /* Placeholder style */
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
  }
   .achievement-icon-placeholder {
       width: 40px; height: 40px; background-color: #30363d;
       border-radius: 50%; display: flex; align-items: center; justify-content: center;
       color: #8b949e; font-size: 20px;
   }


  /* Main Content - Repository List */
  .repo-list-main {
    flex-grow: 1; /* Takes remaining space */
    min-width: 0; /* Prevent overflow */
  }

  .repo-search-bar {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping */
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #30363d;
    align-items: center;
  }
  .repo-search-bar input {
    flex-grow: 1;
    min-width: 200px; /* Min width before wrapping */
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 5px 12px; /* Reduced padding */
    color: #c9d1d9;
    font-size: 14px;
    height: 32px; /* Standard height */
  }
  .repo-search-bar input::placeholder { color: #8b949e; }
  .repo-filter-btn, .new-repo-btn {
    background-color: #21262d; border: 1px solid rgba(240, 246, 252, 0.1);
    border-radius: 6px; color: #c9d1d9; padding: 5px 16px; /* Standard padding */
    font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px;
    font-weight: 500; height: 32px; /* Standard height */
    white-space: nowrap;
  }
  .repo-filter-btn:hover { background-color: #30363d; border-color: #8b949e; }
  .new-repo-btn {
    background-color: #238636; border-color: rgba(240, 246, 252, 0.1); color: white;
  }
  .new-repo-btn:hover { background-color: #2ea043; border-color: rgba(240, 246, 252, 0.1); }
  .new-repo-btn svg { margin-right: 4px;}


  .repository-list { /* Container for items */
      list-style: none;
      padding: 0;
      margin: 0;
  }
  .repository-item { /* List item */
    border-bottom: 1px solid #30363d; /* Separator */
    padding: 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
   .repository-item:first-child { border-top: 1px solid #30363d; /* Add top border for first item */}
  .repository-item-left { flex-grow: 1; min-width: 0;} /* Allow shrinking */
  .repo-name-visibility { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .repository-name { font-size: 20px; font-weight: 600; color: #58a6ff; text-decoration: none; word-break: break-all; /* Break long names */}
  .repository-name:hover { text-decoration: underline; }
  .repository-visibility { display: inline-block; border: 1px solid #30363d; border-radius: 2em; padding: 0 7px; font-size: 12px; color: #8b949e; white-space: nowrap;}
  .repository-description { color: #8b949e; margin-top: 4px; margin-bottom: 12px; font-size: 14px; }
  .repository-meta { display: flex; flex-wrap: wrap; /* Wrap meta items */ gap: 16px; font-size: 12px; color: #8b949e; align-items: center; }
  .repository-meta span { display: flex; align-items: center; gap: 5px; }
  .repository-meta .language-color { display: inline-block; width: 12px; height: 12px; border-radius: 50%; }

  .repository-item-right {
    flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-left: 16px;
  }
  .star-button {
    background-color: #21262d; border: 1px solid rgba(240, 246, 252, 0.1); border-radius: 6px;
    color: #c9d1d9; padding: 3px 12px; /* Smaller padding */ font-size: 12px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
  }
  .star-button:hover { background-color: #30363d; border-color: #8b949e;}
  .star-button svg { color: #8b949e; font-size: 14px;}
  .contribution-graph-mini { display: none; /* Hide for now */ }
`;

const RepositoriesPage = () => {
    // Use URL param for userId if viewing someone else's, else use logged-in user
    const { userId: paramUserId } = useParams();
    const { currentUser } = useAuth();
    const targetUserId = paramUserId || currentUser; // Determine whose repos to show

    const [userData, setUserData] = useState(null); // User whose profile this is
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // Add states for filters if needed

    // Fetch User Data and Repositories
    useEffect(() => {
        const fetchData = async () => {
            if (!targetUserId) {
                setLoading(false);
                setError("User not identified.");
                return;
            }
            setLoading(true);
            setError(null);
            try {
                // Fetch user data in parallel
                const userPromise = axios.get(`http://localhost:3000/getUser/${targetUserId}`); //
                // Fetch repositories for the target user
                const reposPromise = axios.get(`http://localhost:3000/repo/user/${targetUserId}`); //

                const [userRes, reposRes] = await Promise.all([userPromise, reposPromise]);

                setUserData(userRes.data);
                setRepositories(reposRes.data.repos || []); // Access the 'repos' array

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
                setUserData(null);
                setRepositories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetUserId]); // Re-fetch if targetUserId changes

    // --- Filtering Logic --- (Simple search for now)
    const filteredRepos = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Placeholder avatar
    const avatarUrl = `https://avatars.githubusercontent.com/${userData?.name || 'github'}?s=296`; // Use name for identicon


    if (loading) {
        return ( <> <Navbar username="Loading..." /> <div className="repositories-page-container" style={{ textAlign: 'center', paddingTop: '50px' }}>Loading...</div> </> );
    }
    if (error) {
        return ( <> <Navbar username="Error" /> <div className="repositories-page-container" style={{ textAlign: 'center', paddingTop: '50px', color: 'red' }}>Error: {error}</div> </> );
    }
     if (!userData) { // Should be caught by error, but good check
        return ( <> <Navbar username="Not Found" /> <div className="repositories-page-container" style={{ textAlign: 'center', paddingTop: '50px' }}>User not found.</div> </> );
    }

    return (
        <>
            {/* Pass current logged-in user's name to Navbar, not the profile being viewed */}
            <Navbar username={currentUser === targetUserId ? userData.name : 'Your Username'} />
            <style>{repositoriesPageStyles}</style>

            <div className="repositories-page-container">
                {/* Profile Tabs (Active tab is Repositories) */}
                <div className="profile-tabs-nav">
                    <Link to={`/profile/${targetUserId}`}><FaBook /> Overview</Link>
                    <Link to={`/profile/${targetUserId}/repositories`} className="active"><FaCode /> Repositories <span className="count">{repositories.length}</span></Link>
                    <Link to={`/profile/${targetUserId}/projects`}><FaProjectDiagram /> Projects</Link>
                    <Link to={`/profile/${targetUserId}/packages`}><FaBoxes /> Packages</Link>
                    <Link to={`/profile/${targetUserId}/stars`}><FaRegStar /> Stars</Link>
                </div>

                {/* Main Content Layout */}
                <div className="repositories-content-layout">
                    {/* Left Sidebar */}
                    <aside className="repositories-sidebar">
                        <img src={avatarUrl} alt={`${userData.name}'s Avatar`} className="profile-avatar-large" />
                        <h1 className="profile-username">{userData.name}</h1>
                        <p className="profile-loginname">{userData.name?.toLowerCase()}</p> {/* Use name as login */}

                         {/* Only show Edit Profile if viewing own profile */}
                        {currentUser === targetUserId && (
                           <Link to={`/profile/${targetUserId}/edit`}>
                               <button className="edit-profile-btn">Edit profile</button>
                           </Link>
                        )}

                        {/* Profile Stats & Details (Placeholders) */}
                         <div className="profile-stats">
                           <Link to="#"><span>Followers</span> <strong>0</strong></Link>
                           <Link to="#"><span>Following</span> <strong>0</strong></Link>
                         </div>
                         <div className="profile-details">
                             <ul>
                                 {/* Add actual data later */}
                                 <li><FaRegBuilding /> Company</li>
                                 <li><FaMapMarkerAlt /> Location</li>
                                 <li><FaLink /> website.com</li>
                                 <li><FaTwitter /> @twitter_handle</li>
                             </ul>
                         </div>


                        {/* Achievements Section (Placeholder) */}
                        <div className="achievements-section">
                            <h3>Achievements</h3>
                            <div className="achievement-placeholder">
                                <span className="achievement-icon-placeholder"><FaTrophy/></span>
                                <span className="achievement-icon-placeholder"><FaTrophy/></span>
                                {/* Add more placeholders */}
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <main className="repo-list-main">
                        {/* Search and Filter Bar */}
                        <div className="repo-search-bar">
                            <input
                                type="text"
                                placeholder="Find a repository..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {/* Simplified Buttons for now */}
                            <button className="repo-filter-btn">Type <FaCaretDown /></button>
                            <button className="repo-filter-btn">Language <FaCaretDown /></button>
                            <button className="repo-filter-btn">Sort <FaCaretDown /></button>
                            {/* New Repository Button (only if viewing own profile) */}
                             {currentUser === targetUserId && (
                                <Link to="/create" className="new-repo-btn">
                                    <FaBook /> New
                                </Link>
                             )}
                        </div>

                        {/* Repository List */}
                        <ul className="repository-list">
                            {filteredRepos.length === 0 ? (
                                <li style={{ textAlign: 'center', padding: '40px 0', color: '#8b949e' }}>
                                    {userData.name} doesn’t have any repositories that match.
                                </li>
                            ) : (
                                filteredRepos.map((repo) => (
                                    <li key={repo._id} className="repository-item">
                                        <div className="repository-item-left">
                                            <div className="repo-name-visibility">
                                                 <Link to={`/repo/${targetUserId}/${repo.name}`} className="repository-name">
                                                    {repo.name}
                                                </Link>
                                                <span className="repository-visibility">
                                                    {repo.visibility ? 'Public' : 'Private'}
                                                </span>
                                            </div>
                                            <p className="repository-description">
                                                {repo.description || ''}
                                            </p>
                                            <div className="repository-meta">
                                                {repo.language && (
                                                    <span>
                                                        <span className="language-color" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                                                        {repo.language}
                                                    </span>
                                                )}
                                                 {/* Placeholder Star count */}
                                                 <span><FaRegStar /> 0</span>
                                                {/* Use actual date field from backend */}
                                                <span>
                                                     Updated on {new Date(repo.updatedAt || repo.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                 </span>
                                            </div>
                                        </div>
                                        <div className="repository-item-right">
                                            <button className="star-button">
                                                <FaRegStar /> Star
                                            </button>
                                            {/* <div className="contribution-graph-mini"></div> */}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </main>
                </div>
            </div>
        </>
    );
};

// --- Helper function for language color ---
const getLanguageColor = (language) => { //
    const langMap = { //
        'javascript': '#f1e05a', 'html': '#e34c26', 'css': '#563d7c', //
        'python': '#3572A5', 'java': '#b07219', 'markdown': '#083061', //
        'typescript': '#3178c6', 'shell': '#89e051', 'c++': '#f34b7d', 'c': '#555555', //
        'ruby': '#701516', 'text': '#8b949e' //
    }; //
    return langMap[language?.toLowerCase()] || '#8b949e'; //
}; //

export default RepositoriesPage;