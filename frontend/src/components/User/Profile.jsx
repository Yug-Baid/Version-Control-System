import React, { useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "../Navbar";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import HeatMapProfile from "./HeatMap";
import { Link, useParams } from "react-router-dom"; // Import Link and useParams

// --- SVG Icons remain the same ---
// BookIcon, RepoIcon, ProjectIcon, PackageIcon, StarIcon...

const Profile = () => {
  const { currentUser } = useAuth(); // Get current logged-in user ID
  // Optional: Get userId from URL if profiles can be viewed by others
  // const { userId: profileUserId } = useParams();
  // const targetUserId = profileUserId || currentUser; // Use URL param or fallback to logged-in user

  // For simplicity, this example assumes the profile is always for the logged-in user
  const targetUserId = currentUser;

  const [userRepos, setUserRepos] = useState([]);
  const [userData, setUserData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!targetUserId) {
        setError("User not identified.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");

      try {
        // Fetch user details
        const userRes = await axios.get(
          `http://localhost:3000/getUser/${targetUserId}`
        );
        setUserData(userRes.data);

        // Fetch repositories for this user
        const repoRes = await axios.get(
          `http://localhost:3000/repo/user/${targetUserId}`
        );
        setUserRepos(repoRes.data.repos || []);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError(
          err.response?.data?.message || "Could not load profile information."
        );
        setUserData(null);
        setUserRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [targetUserId]); // Re-fetch if the target user ID changes

  if (loading) {
    // Provide a loading state with Navbar
    return (
      <>
        <Navbar username="Loading..." />
        <div className="profile-container">Loading profile...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar username="Error" />
        <div className="profile-container" style={{ color: "red" }}>
          Error: {error}
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navbar username="Not Found" />
        <div className="profile-container">User profile not found.</div>
      </>
    );
  }

  // --- Render Profile ---
  return (
    <>
      <Navbar username={userData.name || "User"} /> {/* Use fetched name */}
      <div className="profile-container">
        {/* --- Tabs remain the same --- */}
        <div className="profile-tabs">
          <a href="#" className="tab-item active">
            <BookIcon />
            <span>Overview</span>
          </a>
          <a href="#" className="tab-item">
            <RepoIcon />
            <span>Repositories</span>
            {/* Dynamic repo count */}
            <span className="tab-count">{userRepos.length}</span>
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

        <div className="profile-main">
          <div className="profile-sidebar">
            {/* Display initial */}
            <div className="avatar">
              {userData.name ? userData.name.slice(0, 1).toUpperCase() : "?"}
            </div>
            <div className="user-name">{userData.name}</div>
            {/* Display email or other details if needed */}
            {/* <div className="user-email">{userData.email}</div> */}
            <button className="edit-profile-btn">Edit profile</button>{" "}
            {/* Functionality TBD */}
          </div>

          <div className="profile-content">
            <div className="repos-header">
              <h2 className="repos-title">Popular repositories</h2>{" "}
              {/* Adjust title if needed */}
              <a href="#" className="customize-link">
                Customize your pins
              </a>
            </div>
            <div className="repos-grid">
              {userRepos.length > 0 ? (
                userRepos.map((repo) => (
                  // --- Updated Link ---
                  <Link
                    to={`/repo/${repo.owner}/${repo.name}`}
                    key={repo._id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="repo-card">
                      <div className="repo-card-header">
                        {/* Use Link instead of anchor */}
                        <span className="repo-name">{repo.name}</span>
                        <span className="public-badge">
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="repo-description">
                        {repo.description || "No description"}
                      </p>
                      <div className="repo-language">
                        <span
                          className="language-dot"
                          style={{
                            backgroundColor: repo.languageColor || "#8b949e",
                          }}
                        ></span>
                        <span>{repo.language || "N/A"}</span>
                      </div>
                    </div>
                  </Link>
                  // --- End Updated Link ---
                ))
              ) : (
                <p style={{ color: "#8b949e" }}>
                  No repositories found for this user.
                </p>
              )}
            </div>
            {/* Heatmap Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
                border: "1px solid #30363d",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <HeatMapProfile minWidthValue={950} />{" "}
              {/* Ensure HeatMapProfile doesn't cause issues */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- SVG Icons definition (keep them here or move to a separate file) ---
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

export default Profile;
