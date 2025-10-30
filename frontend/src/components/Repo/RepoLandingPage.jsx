// src/components/Repo/RepoLandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar'; // Adjust import path
import { FaClipboard, FaCode, FaGithub, FaCog, FaUserPlus, FaBook } from 'react-icons/fa'; // Import icons
import './RepoLandingPage.css'

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
            axios.get(`3.7.71.159:3000/getUser/${userId}`)
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
                     axios.get(`3.7.71.159:3000/repo/name/${repoName}`) // Need a new backend endpoint for this or adjust existing
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