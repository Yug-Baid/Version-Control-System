// src/components/Repo/RepoSettings.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar"; // Adjust path if needed
import {
  FaCog,
  FaUsers,
  FaLock,
  FaCodeBranch,
  FaTags,
  FaExclamationTriangle,
  FaTrashAlt,
  FaExchangeAlt, // Icons
  FaBook,
  FaCode,
  FaExclamationCircle,
  FaPlayCircle,
  FaProjectDiagram,
  FaBookOpen,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import "./RepoSettings.css";
import { ToastContainer, toast } from "react-toastify";

// --- Component ---
const RepoSettings = () => {
  const { userId, repoName } = useParams();
  const location = useLocation(); // For active tab state
  const [ownerName, setOwnerName] = useState("");
  const [repoDetails, setRepoDetails] = useState(null);
  const [currentRepoName, setCurrentRepoName] = useState(""); // Original name
  const [newRepoName, setNewRepoName] = useState(""); // Input field value
  const [isPublic, setIsPublic] = useState(true); // Fetched visibility
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Active tab state based on URL (copied from RepoView)
  const [activeTab, setActiveTab] = useState("Settings");
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];
    if (
      secondLastSegment === repoName &&
      ["issues", "projects", "settings"].includes(lastSegment)
    ) {
      setActiveTab(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
    } else if (secondLastSegment === repoName && lastSegment !== "settings") {
      // If URL is like /repo/user/name but not /settings, set Code active
      setActiveTab("Code");
    } else {
      setActiveTab("Settings"); // Default to settings on this page
    }
  }, [location.pathname, repoName]);

  // Fetch Owner and Repo Details
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !repoName) {
        setError("Missing user or repository name in URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        // Fetch User in parallel
        const userPromise = axios
          .get(`http://localhost:3000/getUser/${userId}`)
          .then((res) => setOwnerName(res.data?.name || userId))
          .catch((err) => {
            console.warn("Could not fetch user", err);
            setOwnerName(userId);
          });

        // Fetch Repo Details (using the name route and filtering)
        const repoPromise = axios
          .get(`http://localhost:3000/repo/name/${repoName}`)
          .then((res) => {
            const foundRepo = res.data.find(
              (r) => r.owner === userId || r.owner?._id === userId
            );
            if (!foundRepo)
              throw {
                response: {
                  status: 404,
                  data: { message: "Repo not found for user." },
                },
              };
            setRepoDetails(foundRepo);
            setCurrentRepoName(foundRepo.name);
            setNewRepoName(foundRepo.name); // Initialize input field
            setIsPublic(foundRepo.visibility);
            return foundRepo; // Pass to await
          });

        await Promise.all([userPromise, repoPromise]);
      } catch (err) {
        console.error("Error loading settings data:", err);
        setError(
          err.response?.data?.message || "Failed to load repository settings."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, repoName]);

  const handleChangeVisibilityClick = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to change the Visibility of  your repo ${currentRepoName}?`
    );
    if (confirmed) {
      try {
        const repoToggle = await axios.patch(
          `http://localhost:3000/repo/toggle/${repoDetails._id}`
        );
        toast.success("Visibility Changed Successfully"); 
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${currentRepoName}?`
    );
    if (confirmed) {
      try {
        const repoDelete = await axios.delete(
          `http://localhost:3000/repo/delete/${repoDetails._id}`
        );
 
        toast.success("Repo Deleted Successfully"); 
        

      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <>
        {" "}
        <Navbar username="Loading..." />{" "}
        <div className="settings-container"></div>{" "}
      </>
    );
  }
  if (error) {
    return (
      <>
        {" "}
        <Navbar username={ownerName || "Error"} />{" "}
        <div
          className="settings-container"
          style={{ color: "red", padding: "24px" }}
        >
          Error: {error}
        </div>{" "}
      </>
    );
  }
  if (!repoDetails) {
    return (
      <>
        {" "}
        <Navbar username={ownerName || "Error"} />{" "}
        <div className="settings-container" style={{ padding: "24px" }}>
          Repository details could not be loaded.
        </div>{" "}
      </>
    );
  }

  // --- Render ---
  return (
    <>
      <Navbar username={ownerName} />

      <div className="settings-container">
        {/* Repo Header */}
        <div className="repo-header-section">
          <div className="repo-header-left">
            <FaBook style={{ color: "#8b949e", flexShrink: 0 }} />
            <h1>
              <Link to={`/profile/${userId}`}>{ownerName}</Link>
              {" / "}
              {/* Link back to the main repo view */}
              <Link
                to={`/repo/${userId}/${repoName}`}
                style={{ fontWeight: 600, color: "#c9d1d9" }}
              >
                {repoName}
              </Link>
            </h1>
            <span className="privacy-badge">
              {repoDetails.visibility ? "Public" : "Private"}
            </span>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <nav className="repo-top-nav">
          {/* Links point back to RepoView but trigger state change */}
          {[
            "Code",
            "Issues",
            "Pull requests",
            "Actions",
            "Projects",
            "Wiki",
            "Security",
            "Insights",
            "Settings",
          ].map((tabName) => {
            const tabInfo = {
              // Find icon etc. - adapt from RepoView if needed
              Code: { icon: FaCode, pathSuffix: "", count: undefined },
              Issues: {
                icon: FaExclamationCircle,
                pathSuffix: "/issues",
                count: 0,
              },
              "Pull requests": {
                icon: FaCodeBranch,
                pathSuffix: "/pulls",
                count: 0,
              },
              Actions: {
                icon: FaPlayCircle,
                pathSuffix: "/actions",
                count: undefined,
              },
              Projects: {
                icon: FaProjectDiagram,
                pathSuffix: "/projects",
                count: 0,
              },
              Wiki: { icon: FaBookOpen, pathSuffix: "/wiki", count: undefined },
              Security: {
                icon: FaShieldAlt,
                pathSuffix: "/security",
                count: undefined,
              },
              Insights: {
                icon: FaChartLine,
                pathSuffix: "/insights",
                count: undefined,
              },
              Settings: {
                icon: FaCog,
                pathSuffix: "/settings",
                count: undefined,
              },
            }[tabName];

            return (
              <Link
                key={tabName}
                // Link back to RepoView, letting it handle the tab state
                to={`/repo/${userId}/${repoName}${tabInfo.pathSuffix}`}
                // onClick={(e) => { e.preventDefault(); /* Let RepoView handle state */}}
                className={`repo-top-nav-item ${
                  activeTab === tabName ? "active" : ""
                }`}
              >
                <tabInfo.icon /> {tabName}{" "}
                {tabInfo.count !== undefined && <span>{tabInfo.count}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Settings Layout (Sidebar + Content) */}
        <div className="settings-layout">
          {/* Left Sidebar */}
          <aside className="settings-sidebar">
            <nav className="settings-sidebar-nav">
              <ul>
                <li>
                  <a href="#" className="active">
                    <FaCog /> General
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Right Content */}
          <main className="settings-content">
            {/* General Section */}
            <section className="settings-section">
              <div className="settings-section-header">
                <h2>General</h2>
              </div>
              <div className="settings-section-body">
                <label htmlFor="repo-name-input">Repository name</label>
                <div>
                  <input
                    type="text"
                    id="repo-name-input"
                    className="settings-input"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    aria-label="Repository name"
                    readOnly
                  />
                  <button
                    className="settings-button"
                    // Disable if input hasn't changed or is empty
                    disabled
                  >
                    Rename
                  </button>
                </div>
                {/* Add placeholder sections below if desired */}
              </div>
            </section>

            {/* Danger Zone Section */}
            <section className="settings-section danger-zone">
              <div className="settings-section-header">
                <h2>Danger Zone</h2>
              </div>
              <div className="settings-section-body">
                {/* Change Visibility */}
                <div className="danger-zone-item">
                  <div>
                    <h4>Change repository visibility</h4>
                    <p>
                      This repository is currently{" "}
                      <strong>{isPublic ? "public" : "private"}</strong>.
                    </p>
                  </div>
                  <button
                    className="danger-zone-button"
                    onClick={handleChangeVisibilityClick}
                  >
                    Change visibility
                  </button>
                </div>

                {/* Placeholder: Transfer */}
                <div className="danger-zone-item">
                  <div>
                    <h4>Transfer ownership</h4>
                    <p>
                      Transfer this repository to another user or to an
                      organization where you have the ability to create
                      repositories.
                    </p>
                  </div>
                  <button className="danger-zone-button" disabled>
                    Transfer
                  </button>{" "}
                  {/* Disabled */}
                </div>

                {/* Placeholder: Archive */}
                <div className="danger-zone-item">
                  <div>
                    <h4>Archive this repository</h4>
                    <p>Mark this repository as archived and read-only.</p>
                  </div>
                  <button className="danger-zone-button" disabled>
                    Archive this repository
                  </button>{" "}
                  {/* Disabled */}
                </div>

                {/* Delete Repository */}
                <div className="danger-zone-item">
                  <div>
                    <h4>Delete this repository</h4>
                    <p>
                      Once you delete a repository, there is no going back.
                      Please be certain.
                    </p>
                  </div>
                  <button
                    className="danger-zone-button"
                    onClick={handleDeleteClick}
                  >
                    Delete this repository
                  </button>
                  <ToastContainer position="bottom-right" />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default RepoSettings;
