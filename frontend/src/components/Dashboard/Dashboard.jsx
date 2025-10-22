import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../Navbar";
import Profile from "../User/Profile";

const Dashboard = () => {
  const [repo, setRepo] = useState([]);
  const [suggestedRepo, setSuggestedRepo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [announcements] = useState([
    {
      title: "New Feature: Repo Insights",
      time: "3 hours ago",
      desc: "Now view analytics for all your repositories in one place.",
    },
    {
      title: "Security Patch Update",
      time: "1 day ago",
      desc: "Improved encryption for repository access tokens.",
    },
    {
      title: "UI Update",
      time: "2 days ago",
      desc: "Dashboard now supports dark mode by default.",
    },
  ]);

  useEffect(() => {
    const fetchUserRepo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepo(data.repos);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllRepos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepo(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllRepos();
    fetchUserRepo();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResult(repo);
    } else {
      const filterRepo = suggestedRepo.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResult(filterRepo);
    }
  }, [searchQuery, repo]);

  if(!repo[0]){
    return <div></div>
  }
  return (
    <>
    <Navbar username={repo[0].name}/>
    <div className="dashboard">
      {/* Sidebar - Top Repositories */}
      <aside className="sidebar">
        <h3 className="sidebar-title">Top Repositories</h3>
        <input
          type="text"
          placeholder="Find a repository..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="repo-list">
          {suggestedRepo.length > 0 ? (
            suggestedRepo.map((r, index) => (
              <div key={index} className="repo-item">
                <span className="repo-dot">●</span> {r.name}
              </div>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
      </aside>

      {/* Main Content - Your Repositories */}
      <main className="main-content">
        <h2 className="section-title">Your Repositories</h2>
        <div className="repo-grid">
          {searchResult.length > 0 ? (
            searchResult.map((r, index) => (
              <div key={index} className="repo-card">
                <h4>{r.name}</h4>
                <p>{r.description || "No description provided."}</p>
                <div className="repo-meta">
                  <span>⭐ {r.stars || 0}</span>
                  <span>🍴 {r.forks || 0}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No repositories available.</p>
          )}
        </div>
      </main>

      {/* Right Sidebar - Announcements */}
      <aside className="announcements">
        <h3>Latest Announcements</h3>
        <div className="announcement-list">
          {announcements.map((a, i) => (
            <div key={i} className="announcement-card">
              <p className="announcement-time">{a.time}</p>
              <h4>{a.title}</h4>
              <p className="announcement-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
    </>
  );
};

export default Dashboard;
