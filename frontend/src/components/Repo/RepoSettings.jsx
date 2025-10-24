// src/components/Repo/RepoSettings.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar'; // Adjust path if needed
import {
    FaCog, FaUsers, FaLock, FaCodeBranch, FaTags, FaExclamationTriangle, FaTrashAlt, FaExchangeAlt, // Icons
    FaBook,
    FaCode,
    FaExclamationCircle,
    FaPlayCircle,
    FaProjectDiagram,
    FaBookOpen,
    FaShieldAlt,
    FaChartLine
} from 'react-icons/fa';

// --- CSS for Repo Settings (Consider moving to RepoSettings.css) ---
const settingsStyles = `
  .settings-container {
    padding: 0; /* Remove padding for full width */
    max-width: 100%; /* Use full width */
    margin: 70px auto 0 auto;
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 14px;
    background-color: #0d1117;
    min-height: calc(100vh - 70px);
  }

  /* Header Section (Re-used from RepoView for consistency) */
   .repo-header-section {
     display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
     margin-bottom: 0; /* Remove bottom margin */
     padding: 16px 24px; /* Add padding */
     border-bottom: 1px solid #30363d;
     background-color: #161b22; /* Header background */
   }
   .repo-header-left { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
   .repo-header-left h1 { font-size: 20px; font-weight: 400; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
   .repo-header-left h1 a { color: #58a6ff; text-decoration: none; }
   .repo-header-left h1 a:hover { text-decoration: underline; }
   .repo-header-left h1 span { font-weight: 600; color: #c9d1d9; }
   .privacy-badge { font-size: 12px; font-weight: 500; color: #8b949e; border: 1px solid #30363d; border-radius: 2em; padding: 1px 7px; margin-left: 8px; white-space: nowrap; vertical-align: middle; }
   /* No actions needed in settings header usually */

  /* Tab Navigation (Re-used from RepoView) */
  .repo-top-nav {
    display: flex; gap: 24px; padding: 0 24px; /* Add padding */
    border-bottom: 1px solid #30363d; overflow-x: auto; scrollbar-width: none; background-color: #161b22; /* Header background */
   }
  .repo-top-nav::-webkit-scrollbar { display: none; }
  .repo-top-nav-item { padding: 8px 4px 10px 4px; font-size: 14px; font-weight: 500; color: #8b949e; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.15s ease-in-out; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
  .repo-top-nav-item:hover { color: #c9d1d9; }
  .repo-top-nav-item.active { color: #c9d1d9; border-color: #f78166; font-weight: 600; }
  .repo-top-nav-item svg { color: #8b949e; font-size: 16px; }
  .repo-top-nav-item.active svg { color: #c9d1d9; }
  .repo-top-nav-item span { background-color: #30363d; color: #c9d1d9; padding: 0px 6px; border-radius: 2em; font-size: 12px; min-width: 18px; text-align: center; line-height: 18px; font-weight: 400; }

  /* Settings Layout */
  .settings-layout {
    display: flex;
    padding: 24px; /* Padding for the content area */
    gap: 24px;
    align-items: flex-start;
  }

  /* Left Sidebar Navigation */
  .settings-sidebar {
    width: 240px;
    flex-shrink: 0;
  }
  .settings-sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .settings-sidebar-nav li {
    margin-bottom: 4px;
  }
  .settings-sidebar-nav a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    color: #c9d1d9;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
  }
  .settings-sidebar-nav a:hover {
    background-color: #21262d;
  }
  .settings-sidebar-nav a.active {
    background-color: #30363d; /* Use a slightly different active bg */
    font-weight: 600;
  }
  .settings-sidebar-nav svg {
    color: #8b949e;
    font-size: 16px;
  }
   .settings-sidebar-nav a.active svg {
     color: #c9d1d9;
   }

  /* Right Content Area */
  .settings-content {
    flex-grow: 1;
    min-width: 0; /* Prevent overflow issues */
  }
  .settings-section {
    border: 1px solid #30363d;
    border-radius: 6px;
    margin-bottom: 24px;
    background-color: #161b22; /* Match header/tab background */
  }
  .settings-section-header {
    padding: 16px;
    border-bottom: 1px solid #30363d;
  }
  .settings-section-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
  .settings-section-body {
    padding: 24px;
  }
  .settings-section-body label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .settings-input {
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 5px 12px;
    color: #c9d1d9;
    font-size: 14px;
    width: 100%;
    max-width: 440px; /* Limit input width */
    box-sizing: border-box;
    height: 32px;
    margin-right: 8px;
  }
  .settings-input:focus {
    outline: none;
    border-color: #58a6ff;
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
  }
  .settings-button {
    background-color: #21262d;
    border: 1px solid rgba(240, 246, 252, 0.1);
    border-radius: 6px;
    color: #c9d1d9;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    height: 32px; /* Match input height */
    vertical-align: middle; /* Align with input */
  }
  .settings-button:hover {
    background-color: #30363d;
    border-color: #8b949e;
  }
  .settings-button:disabled {
     opacity: 0.6;
     cursor: not-allowed;
  }
  .settings-section-body p {
     color: #8b949e;
     font-size: 12px;
     margin-top: 8px;
     margin-bottom: 16px;
  }

  /* Danger Zone */
  .danger-zone {
    border-color: #da3633; /* Red border */
  }
  .danger-zone .settings-section-header h2 {
    color: #da3633; /* Red header text */
  }
  .danger-zone-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #30363d;
  }
   .danger-zone-item:last-child {
      border-bottom: none;
   }
   .danger-zone-item div {
      flex-grow: 1;
      margin-right: 16px;
   }
   .danger-zone-item h4 {
      margin: 0 0 4px 0;
      font-weight: 600;
      font-size: 14px;
      color: #c9d1d9;
   }
   .danger-zone-item p {
      margin: 0;
      color: #8b949e;
      font-size: 12px;
   }
   .danger-zone-button {
      background-color: transparent;
      border: 1px solid #a41e1b; /* Darker red border */
      color: #da3633; /* Red text */
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.1s ease-in-out;
   }
   .danger-zone-button:hover {
       background-color: #da3633; /* Red background on hover */
       color: white;
       border-color: #da3633;
   }
   .danger-zone-button:disabled {
       opacity: 0.6;
       cursor: not-allowed;
       background-color: transparent !important; /* Keep transparent */
       color: #da3633 !important; /* Keep red */
       border-color: #a41e1b !important; /* Keep border */
   }

`;

// --- Component ---
const RepoSettings = () => {
    const { userId, repoName } = useParams();
    const location = useLocation(); // For active tab state
    const [ownerName, setOwnerName] = useState('');
    const [repoDetails, setRepoDetails] = useState(null);
    const [currentRepoName, setCurrentRepoName] = useState(''); // Original name
    const [newRepoName, setNewRepoName] = useState(''); // Input field value
    const [isPublic, setIsPublic] = useState(true); // Fetched visibility
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Active tab state based on URL (copied from RepoView)
    const [activeTab, setActiveTab] = useState('Settings');
     useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const secondLastSegment = pathSegments[pathSegments.length - 2];
        if (secondLastSegment === repoName && ['issues', 'projects', 'settings'].includes(lastSegment)) {
            setActiveTab(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
        } else if (secondLastSegment === repoName && lastSegment !== 'settings') {
             // If URL is like /repo/user/name but not /settings, set Code active
             setActiveTab('Code');
        } else {
             setActiveTab('Settings'); // Default to settings on this page
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
            setError('');
            try {
                // Fetch User in parallel
                const userPromise = axios.get(`http://localhost:3000/getUser/${userId}`)
                    .then(res => setOwnerName(res.data?.name || userId))
                    .catch(err => { console.warn("Could not fetch user", err); setOwnerName(userId); });

                // Fetch Repo Details (using the name route and filtering)
                 const repoPromise = axios.get(`http://localhost:3000/repo/name/${repoName}`)
                     .then(res => {
                         const foundRepo = res.data.find(r => r.owner === userId || r.owner?._id === userId);
                         if (!foundRepo) throw { response: { status: 404, data: { message: "Repo not found for user." }}};
                         setRepoDetails(foundRepo);
                         setCurrentRepoName(foundRepo.name);
                         setNewRepoName(foundRepo.name); // Initialize input field
                         setIsPublic(foundRepo.visibility);
                         return foundRepo; // Pass to await
                     });

                await Promise.all([userPromise, repoPromise]);

            } catch (err) {
                console.error("Error loading settings data:", err);
                setError(err.response?.data?.message || 'Failed to load repository settings.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId, repoName]);


    // --- Placeholder Handlers (No backend calls) ---
    const handleRenameClick = () => {
        // In a real app, call backend PUT /repo/update/:id with { name: newRepoName }
        console.log(`Frontend: Attempting to rename to "${newRepoName}" (Backend call not implemented)`);
        alert(`Rename to "${newRepoName}" requested (backend update not implemented).`);
        // Maybe update currentRepoName visually after mock 'success'
        // setCurrentRepoName(newRepoName);
    };

    const handleChangeVisibilityClick = () => {
        // In a real app, call backend PATCH /repo/toggle/:id
        console.log(`Frontend: Toggling visibility from ${isPublic ? 'Public' : 'Private'} (Backend call not implemented)`);
        alert(`Change visibility requested (backend update not implemented). Current: ${isPublic ? 'Public' : 'Private'}`);
        // Optimistically toggle UI state for feedback
        // setIsPublic(!isPublic);
    };

     const handleDeleteClick = () => {
        // IMPORTANT: Add a confirmation dialog here in a real app
        // const confirmed = window.confirm(`Are you sure you want to delete ${currentRepoName}? This action CANNOT be undone.`);
        // if (confirmed) {
        //    Call backend DELETE /repo/delete/:id
             console.log(`Frontend: Attempting to delete repo "${currentRepoName}" (Backend call not implemented)`);
             alert(`Delete repository requested (backend update not implemented).`);
        // }
    };
    // --- End Placeholder Handlers ---


    if (loading) {
        return <> <Navbar username="Loading..." /> <div className="settings-container">Loading settings...</div> </>;
    }
    if (error) {
        return <> <Navbar username={ownerName || 'Error'} /> <div className="settings-container" style={{ color: 'red', padding: '24px'}}>Error: {error}</div> </>;
    }
     if (!repoDetails) {
         return <> <Navbar username={ownerName || 'Error'} /> <div className="settings-container" style={{ padding: '24px'}}>Repository details could not be loaded.</div> </>;
     }

    // --- Render ---
    return (
        <>
            <Navbar username={ownerName} />
            <style>{settingsStyles}</style>
            <div className="settings-container">
                {/* Repo Header */}
                <div className="repo-header-section">
                    <div className="repo-header-left">
                        <FaBook style={{ color: '#8b949e', flexShrink: 0 }} />
                        <h1>
                            <Link to={`/profile/${userId}`}>{ownerName}</Link>
                            {' / '}
                            {/* Link back to the main repo view */}
                            <Link to={`/repo/${userId}/${repoName}`} style={{ fontWeight: 600, color: '#c9d1d9' }}>{repoName}</Link>
                        </h1>
                        <span className="privacy-badge">{repoDetails.visibility ? 'Public' : 'Private'}</span>
                    </div>
                </div>

                {/* Top Navigation Tabs */}
                <nav className="repo-top-nav">
                     {/* Links point back to RepoView but trigger state change */}
                     {['Code', 'Issues', 'Pull requests', 'Actions', 'Projects', 'Wiki', 'Security', 'Insights', 'Settings'].map(tabName => {
                         const tabInfo = { // Find icon etc. - adapt from RepoView if needed
                             'Code': { icon: FaCode, pathSuffix: '', count: undefined },
                             'Issues': { icon: FaExclamationCircle, pathSuffix: '/issues', count: 0 },
                             'Pull requests': { icon: FaCodeBranch, pathSuffix: '/pulls', count: 0 },
                             'Actions': { icon: FaPlayCircle, pathSuffix: '/actions', count: undefined },
                             'Projects': { icon: FaProjectDiagram, pathSuffix: '/projects', count: 0 },
                             'Wiki': { icon: FaBookOpen, pathSuffix: '/wiki', count: undefined },
                             'Security': { icon: FaShieldAlt, pathSuffix: '/security', count: undefined },
                             'Insights': { icon: FaChartLine, pathSuffix: '/insights', count: undefined },
                             'Settings': { icon: FaCog, pathSuffix: '/settings', count: undefined },
                         }[tabName];

                          return (
                            <Link
                                key={tabName}
                                // Link back to RepoView, letting it handle the tab state
                                to={`/repo/${userId}/${repoName}${tabInfo.pathSuffix}`}
                                // onClick={(e) => { e.preventDefault(); /* Let RepoView handle state */}}
                                className={`repo-top-nav-item ${activeTab === tabName ? 'active' : ''}`}
                            >
                                <tabInfo.icon /> {tabName} {tabInfo.count !== undefined && <span>{tabInfo.count}</span>}
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
                                <li><a href="#" className="active"><FaCog /> General</a></li>
                                {/* Placeholders for other sections */}
                                <li><a href="#"><FaUsers /> Access</a></li>
                                <li><a href="#"><FaCodeBranch /> Branches</a></li>
                                <li><a href="#"><FaTags /> Tags</a></li>
                                {/* ... more items */}
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
                                    />
                                    <button
                                        className="settings-button"
                                        onClick={handleRenameClick}
                                        // Disable if input hasn't changed or is empty
                                        disabled={newRepoName === currentRepoName || !newRepoName.trim()}
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
                                        <p>This repository is currently <strong>{isPublic ? 'public' : 'private'}</strong>.</p>
                                    </div>
                                    <button className="danger-zone-button" onClick={handleChangeVisibilityClick}>
                                        Change visibility
                                    </button>
                                </div>

                                {/* Placeholder: Transfer */}
                                <div className="danger-zone-item">
                                    <div>
                                         <h4>Transfer ownership</h4>
                                         <p>Transfer this repository to another user or to an organization where you have the ability to create repositories.</p>
                                    </div>
                                    <button className="danger-zone-button" disabled>Transfer</button> {/* Disabled */}
                                </div>

                                {/* Placeholder: Archive */}
                                <div className="danger-zone-item">
                                    <div>
                                         <h4>Archive this repository</h4>
                                         <p>Mark this repository as archived and read-only.</p>
                                    </div>
                                     <button className="danger-zone-button" disabled>Archive this repository</button> {/* Disabled */}
                                </div>


                                {/* Delete Repository */}
                                <div className="danger-zone-item">
                                    <div>
                                        <h4>Delete this repository</h4>
                                        <p>Once you delete a repository, there is no going back. Please be certain.</p>
                                    </div>
                                    <button className="danger-zone-button" onClick={handleDeleteClick}>
                                        Delete this repository
                                    </button>
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