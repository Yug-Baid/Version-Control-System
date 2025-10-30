// src/components/Info/RecentAnnouncements.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar"; // Adjust import path if needed
import { useAuth } from "../../AuthContext"; // To get current user for Navbar username
import { FaGithub, FaGitAlt, FaInfoCircle, FaBullhorn } from "react-icons/fa"; // Icons

// Basic styles (Consider moving to a separate CSS file)
const announcementStyles = `
  .announcements-container {
    padding: 24px;
    margin: 55px auto 0 auto; /* Adjust top margin for Navbar */
    max-width: 100%; /* Centered content */
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    background-color: #0d1117;
    min-height: calc(100vh - 70px);
    line-height: 1.6;
    position:absolute;
    right:0;
    left:0;
  }

  .page-header {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #30363d;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section {
    margin-bottom: 32px;
    padding: 20px;
    border: 1px solid #30363d;
    border-radius: 6px;
    background-color: #161b22;
  }

  .section h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #c9d1d9; /* White heading */
  }
   .section h3 svg {
       color: #8b949e; /* Icon color */
   }


  .announcement-item {
    border-bottom: 1px solid #30363d;
    padding: 12px 0;
  }
  .announcement-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
   .announcement-item:first-child {
       padding-top: 0;
   }
  .announcement-time {
    color: #8b949e;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .announcement-title {
    font-weight: 600;
    margin: 0 0 6px 0;
    font-size: 15px;
  }
  .announcement-desc {
    color: #c9d1d9;
    font-size: 14px;
    margin: 0;
  }

  .info-section p {
      margin-bottom: 1em;
      color: #c9d1d9;
  }
   .info-section h4 {
       font-size: 16px;
       font-weight: 600;
       margin: 1.5em 0 0.5em 0;
       color: #adbac7; /* Slightly lighter gray */
   }
    .info-section ul {
        margin-left: 20px;
        margin-bottom: 1em;
        padding-left: 1em; /* Added padding for bullets */
    }
     .info-section code {
      background-color: rgba(110,118,129,0.4);
      border-radius: 6px;
      padding: .2em .4em;
      font-family: monospace;
      font-size: 85%;
     }
`;

const RecentAnnouncements = () => {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // Hardcoded announcements
  const announcements = [
    //
    {
      title: "New Feature: Repo Insights", //
      time: "October 25, 2025", //
      desc: "Now view analytics for all your repositories in one place.", //
    },
    {
      title: "Security Patch Update", //
      time: "October 24, 2025", //
      desc: "Improved encryption for repository access tokens and S3 uploads.", //
    },
    {
      title: "UI Update: Dark Mode Default", //
      time: "October 23, 2025", //
      desc: "The Dashboard and repository views now support dark mode by default for a better viewing experience.", //
    },
    {
      title: "CLI Enhancements", //
      time: "October 20, 2025", //
      desc: "Improved error handling and feedback for 'add', 'commit', and 'push' commands.", //
    },
  ];

  // Fetch username for Navbar
  useEffect(() => {
    //
    if (currentUser) {
      //
      setLoading(true); //
      axios
        .get(`3.7.71.159:3000/getUser/${currentUser}`) //
        .then((res) => {
          setUserName(res.data?.name || "User"); //
          setLoading(false); //
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err); //
          setUserName("User"); // Fallback //
          setLoading(false); //
        });
    } else {
      setLoading(false); // Not logged in //
      setUserName("Guest"); //
    }
  }, [currentUser]); //

  // Rigorous check for tag closure:
  return (
    // Fragment Start
    <>
      {/* Navbar Component */}
      <Navbar username={loading ? "..." : userName} />

      {/* Style Tag */}
      <style>{announcementStyles}</style>

      {/* Main Container Div */}
      <div className="announcements-container">
        {/* Page Header */}
        <h2 className="page-header">
          <FaBullhorn /> Announcements & Info
        </h2>

        {/* Announcements Section */}
        <section className="section">
          <h3>
            <FaBullhorn /> Recent Updates
          </h3>
          {/* Map through announcements */}
          {announcements.map((a, i) => (
            <div key={i} className="announcement-item">
              <p className="announcement-time">{a.time}</p>
              <h4 className="announcement-title">{a.title}</h4>
              <p className="announcement-desc">{a.desc}</p>
              {/* Closing div for announcement-item */}
            </div>
          ))}
          {/* Closing section tag */}
        </section>

        {/* Git & GitHub Info Section */}
        <section className="section info-section">
          <h3>
            <FaInfoCircle /> About Git & Version Control
          </h3>

          <h4>
            <FaGitAlt /> What is Git?
          </h4>
          <p>
            Git is a powerful, distributed version control system (DVCS) created
            by Linus Torvalds in 2005. It's designed to handle everything from
            small to very large projects with speed and efficiency. Unlike older
            centralized systems, Git gives every developer a full copy of the
            repository history, allowing for offline work and robust branching
            and merging.
            {/* Closing p tag */}
          </p>
          <p>
            Key concepts include:
            {/* Unordered list */}
            <ul>
              <li>
                <strong>Repositories (Repos):</strong> A collection of files and
                the history of their changes.
              </li>
              <li>
                <strong>Commits:</strong> Snapshots of your project at a
                specific point in time.
              </li>
              <li>
                <strong>Branches:</strong> Independent lines of development
                allowing you to work on features or fixes without affecting the
                main codebase (often called <code>main</code> or{" "}
                <code>master</code>).
              </li>
              <li>
                <strong>Merging:</strong> Combining changes from different
                branches back together.
              </li>
              <li>
                <strong>Working Directory, Staging Area, Repository:</strong>{" "}
                Git tracks files through these three states before they become
                part of the permanent history.
              </li>
              {/* Closing ul tag */}
            </ul>
            {/* Closing p tag */}
          </p>

          <h4>
            <FaGithub /> What is GitHub (or a similar platform)?
          </h4>
          <p>
            GitHub (and platforms like GitLab, Bitbucket, or this custom one) is
            a web-based hosting service for Git repositories. It provides a
            central place to store your code remotely, collaborate with others,
            and manage projects.
            {/* Closing p tag */}
          </p>
          <p>
            While Git is the underlying tool run on your command line, GitHub
            adds features on top, such as:
            {/* Unordered list */}
            <ul>
              <li>
                Remote repository hosting (like your S3 storage in this
                project).
              </li>
              <li>Web interface for browsing code, history, and changes.</li>
              <li>
                Collaboration tools: Pull Requests (for proposing changes),
                Issues (for tracking tasks/bugs), Project boards.
              </li>
              <li>Access control and user management.</li>
              <li>Automation features (like GitHub Actions).</li>
              {/* Closing ul tag */}
            </ul>
            {/* Closing p tag */}
          </p>
          <h4>How This Project Works (Simplified)</h4>
          <p>
            This project mimics some core Git concepts:
            {/* Unordered list */}
            <ul>
              <li>
                The{" "}
                <strong>
                  CLI (<code>node index.js ...</code>)
                </strong>{" "}
                acts like the <code>git</code> command.
              </li>
              <li>
                <code>node index.js add ...</code> copies files to a local
                "staging area" (
                <code>.Git/&lt;user&gt;/&lt;repo&gt;/staged_files</code>).
              </li>
              <li>
                <code>node index.js commit ...</code> moves staged files to a
                local "committed state" (
                <code>.Git/&lt;user&gt;/&lt;repo&gt;/commit_files</code>),
                overwriting the previous commit's files in this simple version.
              </li>
              <li>
                <code>node index.js push ...</code> uploads the files from the
                local "committed state" to Amazon S3, which acts as the remote
                "origin" repository.
              </li>
              <li>
                The <strong>Web UI (Frontend)</strong> reads repository lists
                from the MongoDB database and file content directly from S3 to
                display the current state.
              </li>
              {/* Closing ul tag */}
            </ul>
            This is a simplified model, lacking features like branching,
            merging, detailed commit history tracking, and diffing that full Git
            provides.
            {/* Closing p tag */}
          </p>
          {/* Closing section tag */}
        </section>
        {/* Closing div for announcements-container */}
      </div>
      {/* Fragment End */}
    </>
  );
};

export default RecentAnnouncements;
