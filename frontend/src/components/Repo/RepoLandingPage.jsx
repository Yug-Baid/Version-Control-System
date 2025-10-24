// src/components/Repo/RepoLandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar'; // Adjust import path
import { FaClipboard, FaCode, FaGithub, FaCog, FaUserPlus, FaBook } from 'react-icons/fa'; // Import icons

// Basic CSS (Consider moving to a separate RepoLandingPage.css file for better organization)
const landingPageStyles = `
  .repo-landing-container {
    padding: 24px;
    max-width: 1012px;
    margin: 70px auto 0 auto; /* Adjust top margin for Navbar */
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 14px;
  }
  .repo-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #30363d;
  }
  .repo-header h1 {
    font-size: 20px;
    font-weight: 400;
    color: #58a6ff;
    margin: 0;
  }
  .repo-header .privacy-badge {
    font-size: 12px;
    font-weight: 500;
    color: #8b949e;
    border: 1px solid #30363d;
    border-radius: 2em;
    padding: 0 7px;
    margin-left: 8px; /* Space after name */
  }
  .repo-actions {
     margin-left: auto; /* Push actions to the right */
     display: flex;
     gap: 8px;
  }
   .action-btn-group {
    display: flex;
    align-items: center;
    border: 1px solid #30363d;
    border-radius: 6px;
    overflow: hidden; /* Clip corners */
   }
  .action-btn {
    background-color: #21262d;
    color: #c9d1d9;
    border: none;
    padding: 3px 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    border-right: 1px solid #30363d;
  }
   .action-btn:last-child {
      border-right: none;
   }
   .action-btn:hover {
      background-color: #30363d;
   }


  .setup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .setup-box {
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 16px;
    background-color: #161b22; /* Slightly different background */
  }
  .setup-box h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
   .setup-box h2 svg {
      color: #8b949e;
   }
  .setup-box p {
    color: #8b949e;
    font-size: 12px;
    margin: 0 0 12px 0;
  }
  .setup-button {
    background-color: #21262d;
    border: 1px solid rgba(240, 246, 252, 0.1);
    border-radius: 6px;
    color: #c9d1d9;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.1s;
  }
   .setup-button.primary {
      background-color: #238636;
      border-color: rgba(240, 246, 252, 0.1);
      color: white;
   }
   .setup-button:hover {
      background-color: #30363d;
      border-color: #8b949e;
   }
    .setup-button.primary:hover {
      background-color: #2ea043;
   }


  .quick-setup-box {
    border: 1px solid #30363d;
    border-radius: 6px;
    background-color: #0d1117; /* Darker background for code */
    margin-bottom: 24px;
  }
  .quick-setup-box h2 {
     font-size: 16px;
     font-weight: 600;
     margin: 0;
     padding: 16px;
     border-bottom: 1px solid #30363d;
     display: flex;
     align-items: center;
     gap: 8px;
  }
   .quick-setup-box h2 svg {
      color: #8b949e;
   }
  .setup-options {
    padding: 16px;
  }
  .setup-options p {
     color: #8b949e;
     font-size: 12px;
     margin: 0 0 12px 0;
  }
  .setup-options a {
     color: #58a6ff;
     text-decoration: none;
  }
   .setup-options a:hover {
      text-decoration: underline;
   }
   .url-input-group {
      display: flex;
      align-items: center;
      background-color: #010409;
      border: 1px solid #30363d;
      border-radius: 6px;
      margin-top: 8px;
   }
   .url-input-group input {
      flex-grow: 1;
      background: none;
      border: none;
      color: #c9d1d9;
      padding: 5px 12px;
      font-size: 12px;
      font-family: monospace;
      outline: none;
   }
    .copy-btn {
      background: none;
      border: none;
      border-left: 1px solid #30363d;
      color: #8b949e;
      padding: 6px 10px;
      cursor: pointer;
    }
     .copy-btn:hover {
        color: #c9d1d9;
     }

  .command-box {
    border: 1px solid #30363d;
    border-radius: 6px;
    background-color: #0d1117;
    margin-bottom: 24px;
  }
  .command-box h3 {
     font-size: 16px;
     font-weight: 400; /* Lighter weight */
     margin: 0;
     padding: 16px;
     border-bottom: 1px solid #30363d;
  }
  .commands {
    padding: 16px;
    background-color: #010409; /* Even darker for code block */
    border-radius: 0 0 6px 6px;
    position: relative; /* For copy button positioning */
  }
  .commands pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #c9d1d9;
  }
   .commands .copy-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      border: 1px solid #30363d; /* Give button border */
      border-radius: 6px;
      padding: 4px 8px;
   }
    .commands .copy-btn:hover {
      background-color: #21262d;
      border-color: #8b949e;
   }

  .pro-tip {
    font-size: 12px;
    color: #8b949e;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #30363d;
  }
`;

// Simple copy-to-clipboard helper
const copyToClipboard = (text, setCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  }, (err) => {
    console.error('Failed to copy: ', err);
    // You could show an error state here
  });
};

// Component for displaying command blocks
const CommandBlock = ({ commands }) => {
  const [copied, setCopied] = useState(false);
  const commandString = commands.join('\n');

  return (
    <div className="commands">
      <pre><code>{commandString}</code></pre>
      <button className="copy-btn" onClick={() => copyToClipboard(commandString, setCopied)} title="Copy commands">
        {copied ? 'Copied!' : <FaClipboard />}
      </button>
    </div>
  );
};


const RepoLandingPage = () => {
    // Get owner (userId maps to name here) and repoName from URL params
    const { userId, repoName } = useParams();
    const [ownerName, setOwnerName] = useState(''); // Use username for display
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [httpsUrl, setHttpsUrl] = useState('');
    const [sshUrl, setSshUrl] = useState(''); // Assuming an SSH format if needed
    const [copiedHttps, setCopiedHttps] = useState(false);
    const [repoVisibility, setRepoVisibility] = useState('private'); // Default or fetch

    // Fetch owner's username for display and constructing URLs
    useEffect(() => {
        setLoading(true);
        setError('');
        if (userId) {
            axios.get(`http://localhost:3000/getUser/${userId}`)
                .then(res => {
                    const name = res.data?.name || userId; // Fallback to ID if name missing
                    setOwnerName(name);
                    // Construct URLs - adjust domain/path as per your setup
                    // This assumes a simple structure like github.com/username/repo.git
                    const baseUrl = `https://your-domain.com/${name}/${repoName}.git`; // REPLACE your-domain.com
                    setHttpsUrl(baseUrl);
                    // Example SSH URL structure
                    setSshUrl(`git@your-domain.com:${name}/${repoName}.git`); // REPLACE your-domain.com

                    // Optionally fetch repo details to get visibility
                     axios.get(`http://localhost:3000/repo/name/${repoName}`) // Need a new backend endpoint for this or adjust existing
                       .then(repoRes => {
                            setRepoVisibility(repoRes.data.visibility ? 'Public' : 'Private')
                       }).catch(repoErr => console.warn("Could not fetch repo visibility"));

                })
                .catch(err => {
                    console.error("Failed to fetch owner data:", err);
                    setError("Could not load repository owner information.");
                    setOwnerName(userId); // Fallback to showing ID
                     // Still set URLs using userId as fallback
                     const baseUrl = `https://your-domain.com/${userId}/${repoName}.git`; // REPLACE your-domain.com
                    setHttpsUrl(baseUrl);
                    setSshUrl(`git@your-domain.com:${userId}/${repoName}.git`); // REPLACE your-domain.com
                })
                .finally(() => setLoading(false));
        } else {
             setError("Repository owner ID not found in URL.");
             setLoading(false);
        }
    }, [userId, repoName]);


    // Define command sets dynamically
    const createNewCommands = [
        `echo "# ${repoName}" >> README.md`,
        'git init',
        'git add README.md',
        'git commit -m "first commit"',
        'git branch -M main',
        `git remote add origin ${httpsUrl}`,
        'git push -u origin main'
    ];

    const pushExistingCommands = [
        `git remote add origin ${httpsUrl}`,
        'git branch -M main',
        'git push -u origin main'
    ];

    if (loading) {
        // Render a basic loading state, Navbar might show loading too
        return <> <Navbar username="Loading..." /> <div className="repo-landing-container">Loading repository setup...</div> </>;
    }

    if (error) {
         return <> <Navbar username="Error" /> <div className="repo-landing-container" style={{color: 'red'}}>Error: {error}</div> </>;
    }


    return (
        <>
            <Navbar username={ownerName} /> {/* Pass owner name to Navbar */}
            <style>{landingPageStyles}</style> {/* Embed styles */}
            <div className="repo-landing-container">
                {/* Header */}
                <div className="repo-header">
                    <FaBook style={{ color: '#8b949e' }} /> {/* Icon before name */}
                    <h1>
                        <Link to={`/profile/${userId}`} style={{ color: '#58a6ff', textDecoration: 'none' }}>{ownerName}</Link>
                        {' / '}
                        <span style={{ fontWeight: 600, color: '#c9d1d9' }}>{repoName}</span>
                    </h1>
                     <span className="privacy-badge">{repoVisibility}</span> {/* Show visibility */}
                     {/* Placeholder Action Buttons */}
                     <div className="repo-actions">
                         <div className="action-btn-group">
                            <button className="action-btn">Watch 0</button>
                            <button className="action-btn">Fork 0</button>
                         </div>
                         <div className="action-btn-group">
                             <button className="action-btn">Star 0</button>
                         </div>
                     </div>
                </div>

                {/* Setup Grid (Optional Copilot/Collaborators) */}
                 <div className="setup-grid">
                     <div className="setup-box">
                         <h2><FaGithub /> Set up GitHub Copilot</h2>
                         <p>Use GitHub's AI pair programmer for autocomplete suggestions as you code.</p>
                         <button className="setup-button">Get started with GitHub Copilot</button>
                     </div>
                      <div className="setup-box">
                         <h2><FaUserPlus /> Add collaborators to this repository</h2>
                         <p>Search for people using their GitHub username or email address.</p>
                         <button className="setup-button">Invite collaborators</button>
                     </div>
                 </div>

                {/* Quick setup box */}
                <div className="quick-setup-box">
                    <h2><FaCode /> Quick setup — if you've done this kind of thing before</h2>
                    <div className="setup-options">
                        {/* Add HTTPS/SSH Tabs later if needed */}
                        <p>Get started by <a href="#">creating a new file</a> or <a href="#">uploading an existing file</a>. We recommend every repository include a <a href="#">README</a>, <a href="#">LICENSE</a>, and <a href="#">.gitignore</a>.</p>
                        <div className="url-input-group">
                             {/* Read-only input showing the HTTPS URL */}
                            <input type="text" value={httpsUrl} readOnly aria-label="HTTPS clone URL" />
                             <button className="copy-btn" onClick={() => copyToClipboard(httpsUrl, setCopiedHttps)} title="Copy HTTPS clone URL">
                                {copiedHttps ? 'Copied!' : <FaClipboard />}
                             </button>
                        </div>
                    </div>
                </div>

                {/* Create new repo commands */}
                <div className="command-box">
                    <h3>…or create a new repository on the command line</h3>
                    <CommandBlock commands={createNewCommands} />
                </div>

                {/* Push existing repo commands */}
                <div className="command-box">
                    <h3>…or push an existing repository from the command line</h3>
                     <CommandBlock commands={pushExistingCommands} />
                </div>

                 {/* Pro Tip */}
                 <p className="pro-tip">
                     <FaCog style={{ marginRight: '4px' }}/> ProTip! Use the URL for this page when adding GitHub as a remote.
                 </p>

            </div>
        </>
    );
};

export default RepoLandingPage;