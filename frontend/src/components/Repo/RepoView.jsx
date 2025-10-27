// src/components/Repo/RepoView.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar"; // Adjust import path
import RepoLandingPage from "./RepoLandingPage"; // Fallback for empty repo
import { FaCodeCommit } from "react-icons/fa6";
import {
  FaCodeBranch,
  FaStar,
  FaEye,
  FaCode,
  FaBook,
  FaPlus,
  FaCaretDown,
  FaRegFileAlt,
  FaFolder,
  FaPencilAlt,
  FaInfoCircle,
  FaScroll,
  FaChevronDown,
  FaCircle,
  FaExclamationCircle,
  FaProjectDiagram,
  FaCog,
  FaPlayCircle,
  FaShieldAlt,
  FaChartLine,
  FaTag,
  FaHistory,
  FaFileCode,
  FaUpload,
  FaDownload,
  FaBookOpen, // Icon for Wiki
} from "react-icons/fa";
import ReactMarkdown from "react-markdown"; // For rendering README.md
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import "./RepoView.css";

// --- Helper Functions ---
const getFileIcon = (fileName) => {
  // Updated to include folder
  // Basic folder detection (can be improved)
  if (!fileName.includes(".") || fileName.endsWith("/")) {
    // Crude folder check
    return <FaFolder style={{ color: "#58a6ff" }} />;
  }
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return <FaCode style={{ color: "#f1e05a" }} />; // JS Yellow
    case "html":
      return <FaCode style={{ color: "#e34c26" }} />; // HTML Orange
    case "css":
    case "scss":
    case "less":
      return <FaCode style={{ color: "#563d7c" }} />; // CSS Purple
    case "md":
      return <FaBookOpen style={{ color: "#c9d1d9" }} />; // White book for MD
    case "txt":
      return <FaRegFileAlt />;
    case "json":
      return <FaFileCode style={{ color: "#f6d32d" }} />;
    case "py":
      return <FaCode style={{ color: "#3572A5" }} />; // Python Blue
    case "java":
      return <FaCode style={{ color: "#b07219" }} />; // Java Brown
    case "c":
    case "cpp":
    case "h":
      return <FaCode style={{ color: "#00599C" }} />; // C/C++ Blue
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <FaRegFileAlt style={{ color: "#DB61A2" }} />; // Image Pink
    default:
      return <FaRegFileAlt />; // Default icon
  }
};

const getLanguageColor = (language) => {
  // Keep this for sidebar
  const langMap = {
    javascript: "#f1e05a",
    html: "#e34c26",
    css: "#563d7c",
    python: "#3572A5",
    java: "#b07219",
    markdown: "#083061",
    typescript: "#3178c6",
    shell: "#89e051",
    "c++": "#f34b7d",
    c: "#555555",
    ruby: "#701516",
    text: "#8b949e", // Add other languages from your backend model if needed
  };
  return langMap[language?.toLowerCase()] || "#8b949e";
};
// --- End Helper Functions ---

const RepoView = () => {
  const { userId, repoName } = useParams();
  const location = useLocation();
  const [ownerName, setOwnerName] = useState("");
  const [repoDetails, setRepoDetails] = useState(null); // Includes description, visibility, language
  const [files, setFiles] = useState([]); // File list from S3
  const [readmeContent, setReadmeContent] = useState(null);
  const [latestCommit, setLatestCommit] = useState(null); // Mocked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEmptyRepo, setIsEmptyRepo] = useState(false);
  const [activeTab, setActiveTab] = useState("Code");

  // Determine active tab based on URL path suffix
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    // Check if the last segment matches a known tab name and belongs to this repo's path structure
    if (
      secondLastSegment === repoName &&
      ["issues", "projects", "settings"].includes(lastSegment)
    ) {
      setActiveTab(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
    } else {
      setActiveTab("Code"); // Default if no specific tab suffix or different repo path
    }
  }, [location.pathname, repoName]); // Re-run when path or repoName changes

  // Fetch all necessary data
  useEffect(() => {
    const fetchRepoData = async () => {
      if (!userId || !repoName) {
        setError("Missing user or repository name in URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      setIsEmptyRepo(false);
      setReadmeContent(null);
      setFiles([]);
      setLatestCommit(null);
      setRepoDetails(null); // Reset repo details

      let fetchedOwnerName = userId; // Fallback

      try {
        // --- Fetch User Data (Parallel) ---
        const userPromise = axios
          .get(`http://localhost:3000/getUser/${userId}`)
          .then((res) => {
            fetchedOwnerName = res.data?.name || userId;
            setOwnerName(fetchedOwnerName);
          })
          .catch((userErr) => {
            console.warn("Could not fetch user data:", userErr);
            setOwnerName(userId); // Use ID if name fetch fails
          });

        // --- Fetch Repository Details (Needs Backend Endpoint - Mocking for now) ---
        const repoDetailsPromise = axios
          .get(`http://localhost:3000/repo/name/${repoName}`) // Using existing name route
          .then((res) => {
            // Find the repo belonging to the correct user
            const foundRepo = res.data.find(
              (r) => r.owner === userId || r.owner?._id === userId
            );
            if (!foundRepo) {
              throw {
                response: {
                  status: 404,
                  data: { message: "Repository not found for this user." },
                },
              };
            }
            setRepoDetails(foundRepo); // Set the repo details state
            return foundRepo; // Pass data to next step if needed
          });

        // --- Fetch Files List (Parallel) ---
        const filesPromise = axios.get(
          `http://localhost:3000/repo/content/${userId}/${repoName}`
        ); // Use content endpoint

        // Wait for all initial fetches
        const [_, repoDataResult, filesResult] = await Promise.all([
          userPromise,
          repoDetailsPromise,
          filesPromise,
        ]);
        // Note: User data is set directly via setOwnerName inside its promise

        const fetchedFiles = filesResult.data.files || [];

        if (
          filesResult.data.message === "Repository is empty." ||
          fetchedFiles.length === 0
        ) {
          setIsEmptyRepo(true);
          setLoading(false);
          return;
        }

        // Prepare file list (add type based on name - basic)
        const processedFiles = fetchedFiles.map((name) => ({
          name: name,
          type: name.includes(".") ? "file" : "folder", // Very basic type detection
        }));
        setFiles(processedFiles);

        // --- Try to fetch README (after knowing files exist) ---
        const readmeFileName = fetchedFiles.find(
          (f) => f.toLowerCase() === "readme.md"
        );
        if (readmeFileName) {
          try {
            const readmeRes = await axios.get(
              `http://localhost:3000/repo/file/${userId}/${repoName}/${encodeURIComponent(
                readmeFileName
              )}`
            );
            if (!readmeRes.data.isBinary) {
              setReadmeContent(readmeRes.data.content);
            }
          } catch (readmeErr) {
            console.warn("Could not fetch README content:", readmeErr);
          }
        }

        // --- Mock Latest Commit ---
        setLatestCommit({
          message: readmeFileName ? "Update README.md" : "Add initial files", // Slightly better mock message
          author: fetchedOwnerName,
          timeAgo: "10 months ago", // From image
          commitHash: "eab328b", // From image
          commitCount: 3, // From image
        });
      } catch (err) {
        console.error("Error loading repository:", err);
        if (err.response?.status === 404) {
          setError(`Repository not found.`);
          setIsEmptyRepo(true); // Treat as empty/non-existent
        } else {
          setError(err.response?.data?.message || "Failed to load repository.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [userId, repoName]); // Re-fetch if user or repo changes

  // --- Loading / Error / Empty States ---
  if (loading) {
    return (
      <>
        {" "}
        <Navbar username="Loading..." />{" "}
        <div className="repo-view-container" style={{display:"flex",justifyContent:"center",alignContent:"center"}}>Loading Repo Details ......</div>{" "}
      </>
    );
  }
  if (isEmptyRepo) {
    // Render landing page only if specifically empty, not on other errors
    if (!error || error === `Repository not found.`) {
      // Check if error is just 'not found'
      return (
        <RepoLandingPage ownerName={ownerName || userId} repoName={repoName} />
      );
    }
  }
  if (error) {
    // Show generic error for other issues
    return (
      <>
        {" "}
        <Navbar username={ownerName || "Error"} />{" "}
        <div className="repo-view-container" style={{ color: "red" }}>
          Error: {error}
        </div>{" "}
      </>
    );
  }
  if (!repoDetails) {
    // Should not happen if loading is false and no error, but safety check
    return (
      <>
        {" "}
        <Navbar username={ownerName || "Error"} />{" "}
        <div className="repo-view-container">
          Could not load repository details.
        </div>{" "}
      </>
    );
  }
  // --- End Loading / Error / Empty States ---

  // --- Helper Data for Rendering ---
  const visibility = repoDetails.visibility ? "Public" : "Private";
  const description = repoDetails.description || "No description provided.";
  const mainLanguage = repoDetails.language || "Text";
  // Simplified language stats - Replace with real data when available
  const languagesStats = [
    {
      language: mainLanguage,
      percentage: 100,
      color: getLanguageColor(mainLanguage),
    },
  ];

  // --- Main Render ---
  return (
    <>
      <Navbar username={ownerName} />
      <div className="repo-view-container">
        {/* Repo Header */}
        <div className="repo-header-section">
          <div className="repo-header-left">
            <FaBook style={{ color: "#8b949e", flexShrink: 0 }} />
            <h1>
              <Link to={`/profile/${userId}`}>{ownerName}</Link>
              {" / "}
              <span>{repoName}</span>
            </h1>
            <span className="privacy-badge">{visibility}</span>
          </div>
          {/* Actions from Image */}
          <div className="repo-header-actions">
            <div className="action-btn-group">
              <button className="action-btn">
                <FaEye /> Unwatch
              </button>{" "}
              {/* Changed text */}
              <button className="action-btn">
                1 <FaCaretDown />
              </button>{" "}
              {/* Count + Dropdown */}
            </div>
            <div className="action-btn-group">
              <button className="action-btn">
                <FaCodeBranch /> Fork
              </button>
              <button className="action-btn">0</button>
            </div>
            <div className="action-btn-group">
              <button className="action-btn">
                <FaStar /> Star
              </button>
              <button className="action-btn">0</button>
            </div>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <nav className="repo-top-nav">
          {[
            // Tabs matching the image
            { name: "Code", icon: FaCode, pathSuffix: "" },
            {
              name: "Issues",
              icon: FaExclamationCircle,
              count: 0,
              pathSuffix: "/issues",
            },
            {
              name: "Pull requests",
              icon: FaCodeBranch,
              count: 0,
              pathSuffix: "/pulls",
            }, // Added Pull Requests
            { name: "Actions", icon: FaPlayCircle, pathSuffix: "/actions" }, // Added Actions
            {
              name: "Projects",
              icon: FaProjectDiagram,
              count: 0,
              pathSuffix: "/projects",
            },
            { name: "Wiki", icon: FaBookOpen, pathSuffix: "/wiki" }, // Added Wiki
            { name: "Security", icon: FaShieldAlt, pathSuffix: "/security" }, // Added Security
            { name: "Insights", icon: FaChartLine, pathSuffix: "/insights" }, // Added Insights
            { name: "Settings", icon: FaCog, pathSuffix: "/settings" },
          ].map((tab) => (
            <Link
              key={tab.name}
              to={`/repo/${userId}/${repoName}${tab.pathSuffix}`} // Basic routing
              className={`repo-top-nav-item ${
                activeTab === tab.name ? "active" : ""
              }`}
            >
              <tab.icon /> {tab.name}{" "}
              {tab.count !== undefined && <span>{tab.count}</span>}
            </Link>
          ))}
        </nav>

        {/* --- Conditional Content Based on Active Tab --- */}

        {/* CODE TAB */}
        {activeTab === "Code" && (
          <div className="repo-main-content">
            {/* Left Side: File List & README */}
            <div className="repo-file-list-area">
              {/* File Controls */}
              <div className="repo-file-controls">
                <button className="branch-selector">
                  <FaCodeBranch /> main <FaCaretDown />
                </button>
                <div className="file-stats">
                  <Link to="#">
                    <FaCodeBranch /> <strong>1</strong> branch
                  </Link>
                  <Link to="#">
                    <FaTag /> <strong>0</strong> tags
                  </Link>
                </div>
                <div className="repo-main-actions">
                  <button className="action-btn-sm"> Go to file</button>
                  <button className="action-btn-sm">
                    {" "}
                    <FaPlus /> Add file <FaCaretDown />
                  </button>
                  <button className="action-dropdown-btn">
                    {" "}
                    <FaCode /> Code <FaChevronDown />
                  </button>
                </div>
              </div>
              {/* File List Container */}
              <div className="file-list-container">
                {/* Latest Commit Header */}
                {latestCommit && (
                  <div className="file-list-header">
                    {/* Placeholder avatar */}
                    <img
                      src={`https://avatars.githubusercontent.com/${latestCommit.author}?s=20`}
                      alt={latestCommit.author}
                    />
                    <Link to="#" className="author-link">
                      {latestCommit.author}
                    </Link>
                    <span
                      className="commit-message"
                      title={latestCommit.message}
                    >
                      {latestCommit.message}
                    </span>
                    <div className="commit-details">
                      <Link
                        to="#"
                        className="commit-hash"
                        title={`View commit ${latestCommit.commitHash}`}
                      >
                        {latestCommit.commitHash}
                      </Link>
                      <span className="commit-time">
                        {latestCommit.timeAgo}
                      </span>
                      <Link to="#" className="commit-link">
                        <FaCodeCommit /> {latestCommit.commitCount} Commits
                      </Link>
                    </div>
                  </div>
                )}

                {/* File List Items */}
                {files.map((file) => (
                  <div key={file.name} className="file-list-item">
                    <div className="file-list-item-icon">
                      {getFileIcon(file.name)}
                    </div>
                    <Link
                      to={`/repo/${userId}/${repoName}/blob/${encodeURIComponent(
                        file.name
                      )}`}
                      className="file-list-item-name"
                    >
                      {file.name}
                    </Link>
                    {/* Use latest commit message/time for all files in this simple view */}
                    <span
                      className="file-list-item-commit-msg"
                      title={latestCommit?.message || "Commit message"}
                    >
                      {latestCommit?.message || "Commit message"}
                    </span>
                    <span className="file-list-item-time">
                      {latestCommit?.timeAgo || "some time ago"}
                    </span>
                  </div>
                ))}
              </div>{" "}
              {/* End File List Container */}
              {/* README Display */}
              {readmeContent && (
                <div className="readme-container">
                  <div className="readme-header">
                    <FaBook /> README.md
                    <Link
                      to="#"
                      style={{
                        marginLeft: "auto",
                        color: "#8b949e",
                        textDecoration: "none",
                      }}
                      title="Edit README"
                    >
                      <FaPencilAlt />
                    </Link>
                  </div>
                  <div className="readme-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {readmeContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              {!readmeContent &&
                !loading &&
                !isEmptyRepo && ( // Show prompt only if repo not empty but no README
                  <div
                    style={{
                      marginTop: "24px",
                      padding: "16px",
                      border: "1px dashed #30363d",
                      borderRadius: "6px",
                      backgroundColor: "#161b22",
                      color: "#8b949e",
                      textAlign: "center",
                    }}
                  >
                    <p>
                      Help people interested in this repository understand your
                      project by adding a README.
                    </p>
                    <button
                      className="action-btn-sm"
                      style={{ marginTop: "8px", backgroundColor: "#21262d" }}
                    >
                      <FaPlus /> Add a README
                    </button>
                  </div>
                )}
            </div>{" "}
            {/* End Left Side */}
            {/* Right Sidebar */}
            <div className="repo-sidebar">
              {/* About Section */}
              <div className="sidebar-box">
                <h3>
                  <FaInfoCircle /> About
                </h3>
                <div className="sidebar-box-content">
                  <p>{description}</p>
                  {/* Mocked links - Replace with actual data later */}
                  <ul>
                    <li>
                      <FaBook /> <Link to="#">Readme</Link>
                    </li>
                    <li>
                      <FaHistory /> Activity
                    </li>
                    <li>
                      <FaStar /> 0 stars
                    </li>
                    <li>
                      <FaEye /> 1 watching
                    </li>
                    <li>
                      <FaCodeBranch /> 0 forks
                    </li>
                  </ul>
                </div>
              </div>

              {/* Releases Section */}
              <div className="sidebar-box">
                <h3>Releases</h3>
                <div className="sidebar-box-content">
                  <p>No releases published</p>
                  <p>
                    <Link to="#">Create a new release</Link>
                  </p>
                </div>
              </div>

              {/* Packages Section */}
              <div className="sidebar-box">
                <h3>Packages</h3>
                <div className="sidebar-box-content">
                  <p>No packages published</p>
                  <p>
                    <Link to="#">Publish your first package</Link>
                  </p>
                </div>
              </div>

              {/* Languages Section */}
              <div className="sidebar-box">
                <h3>Languages</h3>
                <div className="sidebar-box-content">
                  {languagesStats.length > 0 ? (
                    <>
                      <div className="language-bar-container">
                        {languagesStats.map((lang, index) => (
                          <div
                            key={index}
                            className="language-bar-segment"
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color,
                            }}
                            title={`${lang.language}: ${lang.percentage}%`}
                          ></div>
                        ))}
                      </div>
                      <div className="language-stats">
                        <ul>
                          {languagesStats.map((lang, index) => (
                            <li key={index}>
                              <span>
                                <span
                                  className="lang-color-dot"
                                  style={{ backgroundColor: lang.color }}
                                ></span>
                                {lang.language}
                              </span>
                              <span>{lang.percentage}%</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p>Languages could not be determined.</p>
                  )}
                </div>
              </div>
            </div>{" "}
            {/* End Right Sidebar */}
          </div> // End .repo-main-content for Code tab
        )}

        {/* --- Placeholder Content for Other Tabs --- */}
        {activeTab !== "Code" && (
          <div
            style={{
              padding: "40px 20px",
              border: "1px solid #30363d",
              borderRadius: "6px",
              backgroundColor: "#161b22",
              marginTop: "24px",
              textAlign: "center",
              color: "#8b949e",
            }}
          >
            <h2>{activeTab}</h2>
            <p>
              Functionality for the "{activeTab}" tab is not yet implemented.
            </p>
            {/* Add specific placeholder content or buttons if desired */}
            {activeTab === "Issues" && (
              <button
                className="action-dropdown-btn"
                style={{ marginTop: "10px" }}
              >
                <FaPlus /> New Issue
              </button>
            )}
          </div>
        )}
        {/* --- End Placeholder Content --- */}
      </div>{" "}
      {/* End repo-view-container */}
    </>
  );
};

export default RepoView;
