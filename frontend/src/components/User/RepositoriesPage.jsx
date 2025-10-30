// src/components/User/RepositoriesPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar"; // Adjust path if needed
import { useAuth } from "../../AuthContext"; // To get current user info
import {
  FaSearch,
  FaStar,
  FaGlobe,
  FaLock,
  FaCode,
  FaBook,
  FaProjectDiagram,
  FaBoxes,
  FaRegStar,
  FaRegBuilding,
  FaMapMarkerAlt,
  FaLink,
  FaTwitter, // Profile icons
  FaTrophy,
  FaPlus,
  FaCaretDown, // Achievements, New button icons
} from "react-icons/fa"; // Import necessary icons
import "./RepositoriesPage.css";
import "./Profile.css";

const RepositoriesPage = () => {
  // Use URL param for userId if viewing someone else's, else use logged-in user
  const { userId: paramUserId } = useParams();
  const { currentUser } = useAuth();
  const targetUserId = paramUserId || currentUser; // Determine whose repos to show

  const [userData, setUserData] = useState(null); // User whose profile this is
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        const userPromise = axios.get(
          `3.7.71.159:3000/getUser/${targetUserId}`
        ); //
        // Fetch repositories for the target user
        const reposPromise = axios.get(
          `3.7.71.159:3000/repo/user/${targetUserId}`
        ); //

        const [userRes, reposRes] = await Promise.all([
          userPromise,
          reposPromise,
        ]);

        setUserData(userRes.data);
        setRepositories(reposRes.data.repos || []); // Access the 'repos' array
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          `Failed to fetch data: ${err.response?.data?.message || err.message}`
        );
        setUserData(null);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetUserId]); // Re-fetch if targetUserId changes

  // --- Filtering Logic --- (Simple search for now)
  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Placeholder avatar
  const avatarUrl = `https://avatars.githubusercontent.com/${
    userData?.name || "github"
  }?s=296`; // Use name for identicon

  if (loading) {
    return (
      <>
        {" "}
        <Navbar username="Loading..." />{" "}
        <div
          className="repositories-page-container"
          style={{ textAlign: "center", paddingTop: "50px" }}
        >
          Loading...
        </div>{" "}
      </>
    );
  }
  if (error) {
    return (
      <>
        {" "}
        <Navbar username="Error" />{" "}
        <div
          className="repositories-page-container"
          style={{ textAlign: "center", paddingTop: "50px", color: "red" }}
        >
          Error: {error}
        </div>{" "}
      </>
    );
  }
  if (!userData) {
    // Should be caught by error, but good check
    return (
      <>
        {" "}
        <Navbar username="Not Found" />{" "}
        <div
          className="repositories-page-container"
          style={{ textAlign: "center", paddingTop: "50px" }}
        >
          User not found.
        </div>{" "}
      </>
    );
  }

  return (
    <>
      {/* Pass current logged-in user's name to Navbar, not the profile being viewed */}
      <Navbar
        username={
          currentUser === targetUserId ? userData.name : "Your Username"
        }
      />

      <div className="profile-container">
        <div className="profile-tabs">
          <a href="#" className="tab-item">
            <BookIcon />
            <Link
              style={{ textDecoration: "none", color: "#c9d1d9" }}
              to={"/profile"}
            >
              {" "}
              <span>Overview</span>
            </Link>
          </a>
          <a href="#" className="tab-item active">
            <RepoIcon />
            <Link
              style={{ textDecoration: "none", color: "#c9d1d9" }}
              to={`/profile/${currentUser}/repositories`}
            >
              {" "}
              <span>Repositories</span>
            </Link>
            {/* Dynamic repo count */}
            <span className="tab-count">{repositories.length}</span>
          </a>
          {/* Other tabs... */}
          <a href="#" className="tab-item">
            <ProjectIcon />
            <span>Projects</span>
          </a>
          <a href="#" className="tab-item">
            <PackageIcon />
            <span>Packages</span>
          </a>
          <a href="#" className="tab-item">
            <StarIcon />
            <span>Stars</span>
          </a>
        </div>
        {/* Main Content Layout */}
        <div className="repositories-content-layout">
          {/* Left Sidebar */}
          <aside className="repositories-sidebar">
            <div className="avatar">
              {userData.name ? userData.name.slice(0, 1).toUpperCase() : "?"}
            </div>
            <h1 className="profile-username">{userData.name}</h1>
            {currentUser === targetUserId && (
                <button className="edit-profile-btn">Edit profile</button>
            )}
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
              <button className="repo-filter-btn">
                Type <FaCaretDown />
              </button>
              <button className="repo-filter-btn">
                Language <FaCaretDown />
              </button>
              <button className="repo-filter-btn">
                Sort <FaCaretDown />
              </button>
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
                <li
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#8b949e",
                  }}
                >
                  {userData.name} doesn’t have any repositories that match.
                </li>
              ) : (
                filteredRepos.map((repo) => (
                  <li key={repo._id} className="repository-item">
                    <div className="repository-item-left">
                      <div className="repo-name-visibility">
                        <Link
                          to={`/repo/${targetUserId}/${repo.name}`}
                          className="repository-name"
                        >
                          {repo.name}
                        </Link>
                        <span className="repository-visibility">
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="repository-description">
                        {repo.description || ""}
                      </p>
                      <div className="repository-meta">
                        {repo.language && (
                          <span>
                            <span
                              className="language-color"
                              style={{
                                backgroundColor: getLanguageColor(
                                  repo.language
                                ),
                              }}
                            ></span>
                            {repo.language}
                          </span>
                        )}
                        {/* Placeholder Star count */}
                        <span>
                          <FaRegStar /> 0
                        </span>
                        {/* Use actual date field from backend */}
                        <span>
                          Updated on{" "}
                          {new Date(
                            repo.updatedAt || repo.createdAt || Date.now()
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
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
const getLanguageColor = (language) => {
  //
  const langMap = {
    //
    javascript: "#f1e05a",
    html: "#e34c26",
    css: "#563d7c", //
    python: "#3572A5",
    java: "#b07219",
    markdown: "#083061", //
    typescript: "#3178c6",
    shell: "#89e051",
    "c++": "#f34b7d",
    c: "#555555", //
    ruby: "#701516",
    text: "#8b949e", //
  }; //
  return langMap[language?.toLowerCase()] || "#8b949e"; //
}; //

const BookIcon = () => (
  /* ... SVG path ... */ <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    className="octicon"
  >
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c.22 0 .415.126.53.318l.09.143h7.677a.75.75 0 0 1 0 1.5H5.623a.75.75 0 0 1-.53-.318L5 2.5H1.5v11h11.75a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 13.25Z"></path>
    <path d="M7.25 2.083c.22 0 .415.126.53.318l.09.143h5.38a.75.75 0 0 1 .75.75v8.125a.75.75 0 0 1-.75.75h-5.38a.75.75 0 0 1-.53-.318L7.25 10.75V2.083Z"></path>
  </svg>
);
const RepoIcon = () => (
  /* ... SVG path ... */ <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    className="octicon"
  >
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Z"></path>
    <path d="M3.75 12.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5.25 11a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.75 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M6.5 4.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.75 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"></path>
  </svg>
);
const ProjectIcon = () => (
  /* ... SVG path ... */ <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    className="octicon"
  >
    <path d="M1.75 0A1.75 1.75 0 0 0 0 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0 0 16 14.25V1.75A1.75 1.75 0 0 0 14.25 0ZM7.5 11.5h1v-2h-1Zm-2-4h1v-2h-1ZM6 6.5h1v-2H6Zm2.5 1h-1v2h1ZM10 9.5h1v-2h-1Zm-2.5 1h1v-2h-1Z"></path>
  </svg>
);
const PackageIcon = () => (
  /* ... SVG path ... */ <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    className="octicon"
  >
    <path d="M8.878.398a.75.75 0 0 0-1.756 0l-5.25 3.045A.75.75 0 0 0 1.5 4.132v7.736a.75.75 0 0 0 .372.65l5.25 3.045a.75.75 0 0 0 .878 0l5.25-3.045a.75.75 0 0 0 .372-.65V4.132a.75.75 0 0 0-.372-.684Zm-5.63 3.48L8 1.44l4.752 2.438L8 6.316Zm.502 6.94 4.5 2.608 4.5-2.608V7.189l-4.5 2.608-4.5-2.608Z"></path>
  </svg>
);
const StarIcon = () => (
  /* ... SVG path ... */ <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    className="octicon"
  >
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 13.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.192L.646 6.574a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
  </svg>
);

export default RepositoriesPage;
