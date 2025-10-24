// src/components/Repo/RepoView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar'; // Adjust import path
import RepoLandingPage from './RepoLandingPage'; // Fallback for empty repo
import { FaCodeCommit } from "react-icons/fa6";
import {
    FaCodeBranch, FaStar, FaEye, FaCode, FaBook, FaPlus, FaCaretDown,
    FaRegFileAlt, FaFolder, FaPencilAlt, FaInfoCircle, FaScroll, FaChevronDown,
    FaCircle, FaExclamationCircle, FaProjectDiagram, FaCog, FaPlayCircle,
    FaShieldAlt, FaChartLine, FaTag, FaHistory, FaFileCode, FaUpload, FaDownload,
    FaBookOpen // Icon for Wiki
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown'; // For rendering README.md
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown

// --- CSS (Strongly recommend moving to RepoView.css) ---
const repoViewStyles = `
  /* General Container */
  .repo-view-container {
    padding: 24px;
    max-width: 100%;
    margin: 60px auto 0 auto; /* Adjust top margin for Navbar */
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 14px;
    background-color: #0d1117; /* Ensure background color */
    min-height: calc(100vh - 70px);
    position:absolute;
    right:0;
    left:0;
    top:0;
  }

  /* Repo Header */
  .repo-header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
  }
  .repo-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }
  .repo-header-left h1 {
    font-size: 20px;
    font-weight: 400;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .repo-header-left h1 a { color: #58a6ff; text-decoration: none; }
  .repo-header-left h1 a:hover { text-decoration: underline; }
  .repo-header-left h1 span { font-weight: 600; color: #c9d1d9; }
  .privacy-badge {
    font-size: 12px;
    font-weight: 500;
    color: #8b949e;
    border: 1px solid #30363d;
    border-radius: 2em;
    padding: 1px 7px;
    margin-left: 8px;
    white-space: nowrap;
    vertical-align: middle; /* Align better with text */
  }
  .repo-header-actions {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
  }
  .action-btn-group {
    display: flex;
    align-items: center;
    border: 1px solid #30363d;
    border-radius: 6px;
    overflow: hidden;
    background-color: #21262d; /* Background for the group */
  }
  .action-btn {
    background: none; /* Make buttons transparent inside group */
    color: #c9d1d9;
    border: none;
    padding: 3px 12px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    border-right: 1px solid #30363d; /* Separator */
    white-space: nowrap;
  }
  .action-btn:last-child { border-right: none; }
  .action-btn:hover { background-color: #30363d; }
  .action-btn svg { margin-right: 4px; color: #8b949e; font-size: 14px; /* Adjust icon size */}
  .action-btn .count { /* Style for count bubble if needed later */ }


  /* Top Navigation Tabs */
  .repo-top-nav {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid #30363d;
    overflow-x: auto;
    scrollbar-width: none;
   }
  .repo-top-nav::-webkit-scrollbar { display: none; }
  .repo-top-nav-item {
    padding: 8px 4px 10px 4px; /* Added bottom padding for border */
    font-size: 14px;
    font-weight: 500;
    color: #8b949e;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease-in-out;
    display: flex;
    align-items: center;
    gap: 8px; /* Increased gap */
    white-space: nowrap;
  }
  .repo-top-nav-item:hover { color: #c9d1d9; }
  .repo-top-nav-item.active {
    color: #c9d1d9;
    border-color: #f78166;
    font-weight: 600; /* Bolder active tab */
  }
   .repo-top-nav-item svg { color: #8b949e; font-size: 16px; /* Slightly larger icons */}
   .repo-top-nav-item.active svg { color: #c9d1d9; }
  .repo-top-nav-item span { /* Count bubble */
    background-color: #30363d;
    color: #c9d1d9;
    padding: 0px 6px;
    border-radius: 2em;
    font-size: 12px;
    min-width: 18px;
    text-align: center;
    line-height: 18px;
    font-weight: 400; /* Normal weight for count */
  }


  /* Main Content Layout */
  .repo-main-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 296px;
    gap: 24px;
    align-items: start;
  }
   @media (max-width: 992px) {
     .repo-main-content { grid-template-columns: minmax(0, 1fr); }
     .repo-sidebar { order: -1; margin-bottom: 24px; }
   }

  /* File List Area */
  .repo-file-list-area { /* Parent */ }
  .repo-file-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
  }
  .branch-selector {
    background-color: #21262d; border: 1px solid #30363d; border-radius: 6px;
    color: #c9d1d9; padding: 5px 12px; font-size: 14px; font-weight: 600; /* Bolder branch name */
    display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;
  }
  .branch-selector:hover { background-color: #30363d; }
  .branch-selector svg:first-child { color: #8b949e; }
  .file-stats { display: flex; gap: 16px; color: #8b949e; font-size: 14px; margin-left: 16px;}
  .file-stats a { color: #8b949e; text-decoration: none; display:flex; align-items:center; gap: 4px;}
  .file-stats a:hover { color: #58a6ff; }
  .file-stats strong { font-weight: 600; color: #c9d1d9; } /* White count */

  .repo-main-actions { margin-left: auto; display: flex; gap: 8px; }
  .action-btn-sm {
    background-color: #21262d; border: 1px solid #30363d; border-radius: 6px;
    color: #c9d1d9; padding: 5px 12px; font-size: 12px; font-weight: 500;
    display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;
  }
  .action-btn-sm:hover { border-color: #8b949e; background-color: #30363d;}

  .action-dropdown-btn { /* Green "Code" button */
    background-color: #238636; border: 1px solid rgba(240, 246, 252, 0.1); border-radius: 6px;
    color: white; padding: 5px 12px; font-size: 12px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; gap: 4px; white-space: nowrap;
  }
  .action-dropdown-btn:hover { background-color: #2ea043; }
  .action-dropdown-btn svg:last-child { font-size: 10px; margin-left: 2px;} /* Smaller caret */

  /* File List Table Structure */
  .file-list-container { border: 1px solid #30363d; border-radius: 6px; overflow: hidden; margin-top: 16px; }
  .file-list-header { /* Latest Commit Bar */
    background-color: #161b22;
    border-bottom: 1px solid #30363d;
    display: flex; align-items: center;
    padding: 10px 16px; font-size: 14px;
    gap: 8px; flex-wrap: nowrap;
  }
   .file-list-header img { width: 20px; height: 20px; border-radius: 50%; }
   .file-list-header .author-link { color: #c9d1d9; font-weight: 600; text-decoration: none; }
   .file-list-header .author-link:hover { text-decoration: underline; }
   .file-list-header .commit-message {
      color: #c9d1d9; flex-grow: 1; margin-left: 4px;
      overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: pointer;
   }
   .file-list-header .commit-message:hover { color: #58a6ff; text-decoration: underline; }
   .file-list-header .commit-details { margin-left: auto; display: flex; gap: 16px; align-items: center;}
   .file-list-header .commit-hash { color: #8b949e; font-size: 12px; font-family: monospace; text-decoration: none; }
   .file-list-header .commit-hash:hover { color: #58a6ff; }
   .file-list-header .commit-time { color: #8b949e; font-size: 14px; white-space: nowrap; }
   .file-list-header .commit-link { color: #8b949e; font-weight: 600; font-size: 14px; text-decoration: none; display: flex; align-items: center; gap: 4px; }
   .file-list-header .commit-link:hover { color: #58a6ff; }
   .file-list-header .commit-link svg { font-size: 16px; }

  .file-list-item { /* Grid for file row */
    display: grid;
    grid-template-columns: 24px 1fr auto auto; /* Icon, Name, Commit Msg, Time */
    gap: 16px;
    align-items: center;
    padding: 10px 16px;
    font-size: 14px;
    border-bottom: 1px solid #21262d;
    background-color: #0d1117;
    transition: background-color 0.1s;
  }
  .file-list-item:last-child { border-bottom: none; }
  .file-list-item:hover { background-color: #161b22; }
  .file-list-item-icon { color: #8b949e; display: flex; align-items: center;}
  .file-list-item-name { color: #c9d1d9; text-decoration: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
  .file-list-item-name:hover { color: #58a6ff; text-decoration: underline; }
  .file-list-item-commit-msg { /* Column 3 */
    color: #8b949e; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
    cursor: pointer; font-size: 14px;
    padding-right: 16px; /* Space before time */
  }
  .file-list-item-commit-msg:hover { color: #58a6ff; text-decoration: underline; }
  .file-list-item-time { /* Column 4 */
      text-align: right; color: #8b949e; font-size: 14px; white-space: nowrap;
   }


  /* README Styles - Adjusted padding, fonts */
   .readme-container { border: 1px solid #30363d; border-radius: 6px; margin-top: 24px; background-color: #0d1117;}
   .readme-header { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #30363d; font-weight: 600; color: #c9d1d9;}
   .readme-header svg { color: #8b949e; }
   .readme-header a { margin-left: auto; color: #8b949e; text-decoration: none;}
   .readme-header a:hover { color: #58a6ff;}
   .readme-content { padding: 24px; line-height: 1.6; color: #c9d1d9; }
   .readme-content > *:first-child { margin-top: 0; } /* Remove extra top margin */
   .readme-content h1, .readme-content h2 { border-bottom: 1px solid #30363d; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
   .readme-content h1 { font-size: 1.8em; } .readme-content h2 { font-size: 1.4em; }
   .readme-content code { background-color: rgba(110,118,129,0.4); border-radius: 6px; padding: .2em .4em; font-family: monospace; font-size: 85%; }
   .readme-content pre { background-color: #161b22; padding: 16px; border-radius: 6px; overflow: auto; font-family: monospace; font-size: 85%; line-height: 1.45;}
   .readme-content pre code { background: none; padding: 0; font-size: 100%; } /* Reset code inside pre */


  /* Sidebar */
  .repo-sidebar { display: flex; flex-direction: column; gap: 24px; }
  .sidebar-box { border: 1px solid #30363d; border-radius: 6px; background-color: #0d1117; }
  .sidebar-box h3 {
    font-size: 16px; font-weight: 600; margin: 0; display: flex; align-items: center;
    gap: 8px; color: #c9d1d9; padding: 16px; border-bottom: 1px solid #30363d;
  }
  .sidebar-box h3 svg { color: #8b949e; font-size: 16px; }
  .sidebar-box-content { padding: 16px; }
  .sidebar-box p, .sidebar-box ul { font-size: 14px; color: #8b949e; margin: 0 0 12px 0; line-height: 1.5; }
  .sidebar-box ul { list-style: none; padding: 0; margin-bottom: 0; } /* Remove bottom margin for lists */
  .sidebar-box ul li { margin-bottom: 8px; display: flex; align-items: center; gap: 6px;}
  .sidebar-box ul li svg { color: #8b949e; font-size: 16px; flex-shrink: 0;}
  .sidebar-box a { color: #58a6ff; text-decoration: none; }
  .sidebar-box a:hover { text-decoration: underline; }
  .language-bar-container { width: 100%; height: 8px; background-color: #30363d; border-radius: 4px; display: flex; overflow: hidden; margin-bottom: 8px;}
  .language-bar-segment { height: 100%; }
  .language-stats ul li { display: flex; align-items: center; gap: 8px; color: #8b949e; margin-bottom: 4px; font-size: 12px; }
  .language-stats ul li span:first-child { font-weight: 600; color: #c9d1d9; }
  .lang-color-dot { width: 12px; height: 12px; border-radius: 50%; }

`;

// --- Helper Functions ---
const getFileIcon = (fileName) => { // Updated to include folder
    // Basic folder detection (can be improved)
    if (!fileName.includes('.') || fileName.endsWith('/')) { // Crude folder check
        return <FaFolder style={{ color: '#58a6ff' }} />;
    }
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js': case 'jsx': case 'ts': case 'tsx': return <FaCode style={{ color: '#f1e05a' }} />; // JS Yellow
        case 'html': return <FaCode style={{ color: '#e34c26' }} />; // HTML Orange
        case 'css': case 'scss': case 'less': return <FaCode style={{ color: '#563d7c' }} />; // CSS Purple
        case 'md': return <FaBookOpen style={{ color: '#c9d1d9' }} />; // White book for MD
        case 'txt': return <FaRegFileAlt />;
        case 'json': return <FaFileCode style={{ color: '#f6d32d' }} />;
        case 'py': return <FaCode style={{ color: '#3572A5' }} />; // Python Blue
        case 'java': return <FaCode style={{ color: '#b07219' }} />; // Java Brown
        case 'c': case 'cpp': case 'h': return <FaCode style={{ color: '#00599C' }} />; // C/C++ Blue
        case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': return <FaRegFileAlt style={{ color: '#DB61A2' }} />; // Image Pink
        default: return <FaRegFileAlt />; // Default icon
    }
};

const getLanguageColor = (language) => { // Keep this for sidebar
    const langMap = {
        'javascript': '#f1e05a', 'html': '#e34c26', 'css': '#563d7c',
        'python': '#3572A5', 'java': '#b07219', 'markdown': '#083061',
        'typescript': '#3178c6', 'shell': '#89e051', 'c++': '#f34b7d', 'c': '#555555',
        'ruby': '#701516', 'text': '#8b949e' // Add other languages from your backend model if needed
    };
    return langMap[language?.toLowerCase()] || '#8b949e';
};
// --- End Helper Functions ---


const RepoView = () => {
    const { userId, repoName } = useParams();
    const location = useLocation();
    const [ownerName, setOwnerName] = useState('');
    const [repoDetails, setRepoDetails] = useState(null); // Includes description, visibility, language
    const [files, setFiles] = useState([]); // File list from S3
    const [readmeContent, setReadmeContent] = useState(null);
    const [latestCommit, setLatestCommit] = useState(null); // Mocked
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEmptyRepo, setIsEmptyRepo] = useState(false);
    const [activeTab, setActiveTab] = useState('Code');

    // Determine active tab based on URL path suffix
    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const secondLastSegment = pathSegments[pathSegments.length - 2];

        // Check if the last segment matches a known tab name and belongs to this repo's path structure
        if (secondLastSegment === repoName && ['issues', 'projects', 'settings'].includes(lastSegment)) {
            setActiveTab(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
        } else {
            setActiveTab('Code'); // Default if no specific tab suffix or different repo path
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
            setError('');
            setIsEmptyRepo(false);
            setReadmeContent(null);
            setFiles([]);
            setLatestCommit(null);
            setRepoDetails(null); // Reset repo details

            let fetchedOwnerName = userId; // Fallback

            try {
                // --- Fetch User Data (Parallel) ---
                const userPromise = axios.get(`http://localhost:3000/getUser/${userId}`)
                    .then(res => {
                        fetchedOwnerName = res.data?.name || userId;
                        setOwnerName(fetchedOwnerName);
                    })
                    .catch(userErr => {
                        console.warn("Could not fetch user data:", userErr);
                        setOwnerName(userId); // Use ID if name fetch fails
                    });

                // --- Fetch Repository Details (Needs Backend Endpoint - Mocking for now) ---
                 const repoDetailsPromise = axios.get(`http://localhost:3000/repo/name/${repoName}`) // Using existing name route
                     .then(res => {
                         // Find the repo belonging to the correct user
                         const foundRepo = res.data.find(r => r.owner === userId || r.owner?._id === userId);
                         if (!foundRepo) {
                             throw { response: { status: 404, data: { message: "Repository not found for this user." } } };
                         }
                         setRepoDetails(foundRepo); // Set the repo details state
                         return foundRepo; // Pass data to next step if needed
                     });


                // --- Fetch Files List (Parallel) ---
                const filesPromise = axios.get(`http://localhost:3000/repo/content/${userId}/${repoName}`); // Use content endpoint

                // Wait for all initial fetches
                const [_, repoDataResult, filesResult] = await Promise.all([userPromise, repoDetailsPromise, filesPromise]);
                // Note: User data is set directly via setOwnerName inside its promise

                const fetchedFiles = filesResult.data.files || [];

                if (filesResult.data.message === "Repository is empty." || fetchedFiles.length === 0) {
                    setIsEmptyRepo(true);
                    setLoading(false);
                    return;
                }

                // Prepare file list (add type based on name - basic)
                 const processedFiles = fetchedFiles.map(name => ({
                     name: name,
                     type: name.includes('.') ? 'file' : 'folder' // Very basic type detection
                 }));
                setFiles(processedFiles);

                // --- Try to fetch README (after knowing files exist) ---
                const readmeFileName = fetchedFiles.find(f => f.toLowerCase() === 'readme.md');
                if (readmeFileName) {
                    try {
                        const readmeRes = await axios.get(`http://localhost:3000/repo/file/${userId}/${repoName}/${encodeURIComponent(readmeFileName)}`);
                        if (!readmeRes.data.isBinary) {
                            setReadmeContent(readmeRes.data.content);
                        }
                    } catch (readmeErr) {
                        console.warn("Could not fetch README content:", readmeErr);
                    }
                }

                // --- Mock Latest Commit ---
                setLatestCommit({
                    message: readmeFileName ? 'Update README.md' : 'Add initial files', // Slightly better mock message
                    author: fetchedOwnerName,
                    timeAgo: '10 months ago', // From image
                    commitHash: 'eab328b', // From image
                    commitCount: 3 // From image
                });

            } catch (err) {
                console.error("Error loading repository:", err);
                if (err.response?.status === 404) {
                    setError(`Repository not found.`);
                    setIsEmptyRepo(true); // Treat as empty/non-existent
                } else {
                    setError(err.response?.data?.message || 'Failed to load repository.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRepoData();
    }, [userId, repoName]); // Re-fetch if user or repo changes


    // --- Loading / Error / Empty States ---
    if (loading) {
        return <> <Navbar username="Loading..." /> <div className="repo-view-container">Loading repository...</div> </>;
    }
    if (isEmptyRepo) {
        // Render landing page only if specifically empty, not on other errors
        if (!error || error === `Repository not found.`) { // Check if error is just 'not found'
             return <RepoLandingPage ownerName={ownerName || userId} repoName={repoName} />;
        }
    }
     if (error) { // Show generic error for other issues
         return <> <Navbar username={ownerName || 'Error'} /> <div className="repo-view-container" style={{color: 'red'}}>Error: {error}</div> </>;
     }
     if (!repoDetails) { // Should not happen if loading is false and no error, but safety check
          return <> <Navbar username={ownerName || 'Error'} /> <div className="repo-view-container">Could not load repository details.</div> </>;
     }
    // --- End Loading / Error / Empty States ---


    // --- Helper Data for Rendering ---
    const visibility = repoDetails.visibility ? 'Public' : 'Private';
    const description = repoDetails.description || 'No description provided.';
    const mainLanguage = repoDetails.language || 'Text';
    // Simplified language stats - Replace with real data when available
    const languagesStats = [{ language: mainLanguage, percentage: 100, color: getLanguageColor(mainLanguage) }];


    // --- Main Render ---
    return (
        <>
            <Navbar username={ownerName} />
            <style>{repoViewStyles}</style>
            <div className="repo-view-container">
                {/* Repo Header */}
                <div className="repo-header-section">
                    <div className="repo-header-left">
                        <FaBook style={{ color: '#8b949e', flexShrink: 0 }} />
                        <h1>
                            <Link to={`/profile/${userId}`}>{ownerName}</Link>
                            {' / '}
                            <span>{repoName}</span>
                        </h1>
                        <span className="privacy-badge">{visibility}</span>
                    </div>
                    {/* Actions from Image */}
                    <div className="repo-header-actions">
                         <div className="action-btn-group">
                             <button className="action-btn"><FaEye /> Unwatch</button> {/* Changed text */}
                             <button className="action-btn">1 <FaCaretDown/></button> {/* Count + Dropdown */}
                         </div>
                         <div className="action-btn-group">
                            <button className="action-btn"><FaCodeBranch /> Fork</button>
                            <button className="action-btn">0</button>
                         </div>
                         <div className="action-btn-group">
                             <button className="action-btn"><FaStar /> Star</button>
                             <button className="action-btn">0</button>
                         </div>
                     </div>
                </div>

                {/* Top Navigation Tabs */}
                <nav className="repo-top-nav">
                    {[ // Tabs matching the image
                        { name: 'Code', icon: FaCode, pathSuffix: '' },
                        { name: 'Issues', icon: FaExclamationCircle, count: 0, pathSuffix: '/issues' },
                        { name: 'Pull requests', icon: FaCodeBranch, count: 0, pathSuffix: '/pulls' }, // Added Pull Requests
                        { name: 'Actions', icon: FaPlayCircle, pathSuffix: '/actions' },             // Added Actions
                        { name: 'Projects', icon: FaProjectDiagram, count: 0, pathSuffix: '/projects' },
                        { name: 'Wiki', icon: FaBookOpen, pathSuffix: '/wiki' },                     // Added Wiki
                        { name: 'Security', icon: FaShieldAlt, pathSuffix: '/security' },           // Added Security
                        { name: 'Insights', icon: FaChartLine, pathSuffix: '/insights' },           // Added Insights
                        { name: 'Settings', icon: FaCog, pathSuffix: '/settings' },
                    ].map(tab => (
                        <Link
                            key={tab.name}
                            to={`/repo/${userId}/${repoName}${tab.pathSuffix}`} // Basic routing
                            
                            className={`repo-top-nav-item ${activeTab === tab.name ? 'active' : ''}`}
                        >
                            <tab.icon /> {tab.name} {tab.count !== undefined && <span>{tab.count}</span>}
                        </Link>
                    ))}
                </nav>

                {/* --- Conditional Content Based on Active Tab --- */}

                {/* CODE TAB */}
                {activeTab === 'Code' && (
                    <div className="repo-main-content">
                        {/* Left Side: File List & README */}
                        <div className="repo-file-list-area">
                            {/* File Controls */}
                            <div className="repo-file-controls">
                                <button className="branch-selector">
                                    <FaCodeBranch /> main <FaCaretDown />
                                </button>
                                <div className="file-stats">
                                     <Link to="#"><FaCodeBranch /> <strong>1</strong> branch</Link>
                                     <Link to="#"><FaTag /> <strong>0</strong> tags</Link>
                                 </div>
                                <div className="repo-main-actions">
                                    <button className="action-btn-sm"> Go to file</button>
                                    <button className="action-btn-sm"> <FaPlus/> Add file <FaCaretDown /></button>
                                    <button className="action-dropdown-btn"> <FaCode /> Code <FaChevronDown /></button>
                                </div>
                            </div>

                            {/* File List Container */}
                            <div className="file-list-container">
                                {/* Latest Commit Header */}
                                {latestCommit && (
                                    <div className="file-list-header">
                                        {/* Placeholder avatar */}
                                        <img src={`https://avatars.githubusercontent.com/${latestCommit.author}?s=20`} alt={latestCommit.author} />
                                        <Link to="#" className="author-link">{latestCommit.author}</Link>
                                        <span className="commit-message" title={latestCommit.message}>
                                            {latestCommit.message}
                                        </span>
                                         <div className="commit-details">
                                             <Link to="#" className="commit-hash" title={`View commit ${latestCommit.commitHash}`}>
                                                 {latestCommit.commitHash}
                                             </Link>
                                             <span className="commit-time">{latestCommit.timeAgo}</span>
                                             <Link to="#" className="commit-link">
                                                 <FaCodeCommit /> {latestCommit.commitCount} Commits
                                             </Link>
                                         </div>
                                    </div>
                                )}

                                {/* File List Items */}
                                {files.map((file) => (
                                    <div key={file.name} className="file-list-item">
                                        <div className="file-list-item-icon">{getFileIcon(file.name)}</div>
                                        <Link to={`/repo/${userId}/${repoName}/blob/${encodeURIComponent(file.name)}`} className="file-list-item-name">
                                            {file.name}
                                        </Link>
                                        {/* Use latest commit message/time for all files in this simple view */}
                                        <span className="file-list-item-commit-msg" title={latestCommit?.message || 'Commit message'}>
                                            {latestCommit?.message || 'Commit message'}
                                        </span>
                                        <span className="file-list-item-time">
                                            {latestCommit?.timeAgo || 'some time ago'}
                                        </span>
                                    </div>
                                ))}
                            </div> {/* End File List Container */}

                            {/* README Display */}
                            {readmeContent && (
                                <div className="readme-container">
                                    <div className="readme-header">
                                        <FaBook /> README.md
                                        <Link to="#" style={{ marginLeft: 'auto', color: '#8b949e', textDecoration: 'none' }} title="Edit README">
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
                             {!readmeContent && !loading && !isEmptyRepo && ( // Show prompt only if repo not empty but no README
                                 <div style={{marginTop: '24px', padding: '16px', border: '1px dashed #30363d', borderRadius: '6px', backgroundColor: '#161b22', color: '#8b949e', textAlign: 'center'}}>
                                     <p>Help people interested in this repository understand your project by adding a README.</p>
                                     <button className="action-btn-sm" style={{marginTop: '8px', backgroundColor: '#21262d'}}><FaPlus /> Add a README</button>
                                 </div>
                             )}

                        </div> {/* End Left Side */}

                        {/* Right Sidebar */}
                        <div className="repo-sidebar">
                            {/* About Section */}
                            <div className="sidebar-box">
                                <h3><FaInfoCircle /> About</h3>
                                <div className="sidebar-box-content">
                                     <p>{description}</p>
                                     {/* Mocked links - Replace with actual data later */}
                                      <ul>
                                         <li><FaBook /> <Link to="#">Readme</Link></li>
                                         <li><FaHistory /> Activity</li>
                                         <li><FaStar /> 0 stars</li>
                                         <li><FaEye /> 1 watching</li>
                                         <li><FaCodeBranch /> 0 forks</li>
                                     </ul>
                                 </div>
                            </div>

                            {/* Releases Section */}
                             <div className="sidebar-box">
                                <h3>Releases</h3>
                                <div className="sidebar-box-content">
                                     <p>No releases published</p>
                                     <p><Link to="#">Create a new release</Link></p>
                                 </div>
                            </div>

                            {/* Packages Section */}
                             <div className="sidebar-box">
                                <h3>Packages</h3>
                                 <div className="sidebar-box-content">
                                     <p>No packages published</p>
                                     <p><Link to="#">Publish your first package</Link></p>
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
                                                        key={index} className="language-bar-segment"
                                                        style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                                                        title={`${lang.language}: ${lang.percentage}%`}
                                                    ></div>
                                                ))}
                                            </div>
                                            <div className="language-stats">
                                                <ul>
                                                    {languagesStats.map((lang, index) => (
                                                        <li key={index}>
                                                             <span><span className="lang-color-dot" style={{backgroundColor: lang.color}}></span>{lang.language}</span>
                                                            <span>{lang.percentage}%</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    ) : ( <p>Languages could not be determined.</p> )}
                                </div>
                            </div>
                        </div> {/* End Right Sidebar */}
                    </div> // End .repo-main-content for Code tab
                )}

                {/* --- Placeholder Content for Other Tabs --- */}
                {activeTab !== 'Code' && (
                     <div style={{ padding: '40px 20px', border: '1px solid #30363d', borderRadius: '6px', backgroundColor: '#161b22', marginTop: '24px', textAlign: 'center', color: '#8b949e' }}>
                        <h2>{activeTab}</h2>
                        <p>Functionality for the "{activeTab}" tab is not yet implemented.</p>
                        {/* Add specific placeholder content or buttons if desired */}
                        {activeTab === 'Issues' && <button className="action-dropdown-btn" style={{marginTop: '10px'}}><FaPlus /> New Issue</button>}
                    </div>
                )}
                {/* --- End Placeholder Content --- */}

            </div> {/* End repo-view-container */}
        </>
    );
};

export default RepoView;