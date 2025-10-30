import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../Navbar";
// Removed Profile import, assuming Dashboard doesn't directly render it
// import Profile from "../User/Profile";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios"; // Using axios for consistency if used elsewhere

const Dashboard = () => {
  const [userRepos, setUserRepos] = useState([]); // Repos owned by the current user
  const [allRepos, setAllRepos] = useState([]); // All repos for sidebar suggestion/search (optional)
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedRepos, setDisplayedRepos] = useState([]); // Repos to show in the main grid
  const [userName, setUserName] = useState(''); // For Navbar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Announcements remain static for now
  const [announcements] = useState([
    { title: "New Feature: Repo Insights", time: "3 hours ago", desc: "Now view analytics..." },
    { title: "Security Patch Update", time: "1 day ago", desc: "Improved encryption..." },
    { title: "UI Update", time: "2 days ago", desc: "Dashboard now supports dark mode..." },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User not logged in."); // Or handle redirect via AuthContext
        setLoading(false);
        return;
      }

      try {
        // Fetch user's name for Navbar
        const userRes = await axios.get(`3.7.71.159:3000/getUser/${userId}`);
        setUserName(userRes.data.name || 'User');

        // Fetch repositories owned by the current user
        const userRepoRes = await axios.get(`3.7.71.159:3000/repo/user/${userId}`);
        const fetchedUserRepos = userRepoRes.data.repos || [];
        setUserRepos(fetchedUserRepos);
        setDisplayedRepos(fetchedUserRepos); // Initially display user's repos

         // Fetch all repositories (for sidebar/search, optional)
         // You might want to paginate this or fetch only public ones if the list gets large
        const allRepoRes = await axios.get(`3.7.71.159:3000/repo/all`);
        setAllRepos(allRepoRes.data || []);


      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load repository data.");
        // Set empty arrays on error
        setUserRepos([]);
        setAllRepos([]);
        setDisplayedRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch data only on component mount

  // Effect for handling search filtering
  useEffect(() => {
    if (!searchQuery) {
      setDisplayedRepos(userRepos); // Show user's repos if search is empty
    } else {
      // Filter *all* repos based on search query for display
      const filtered = allRepos.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedRepos(filtered);
    }
  }, [searchQuery, userRepos, allRepos]); // Re-run filter when search, userRepos, or allRepos change


  // Show loading state
   if (loading) {
       return (
           <>
               <Navbar username="Loading..." />
               <div className="dashboard" style={{display:"flex", justifyContent: 'center', alignItems: 'center', color: 'white'}}>Loading Dashboard...</div>
           </>
       );
   }

  return (
    <>
      <Navbar username={userName} allRepo={allRepos}/>
      <div className="dashboard">
        {/* Sidebar - Now maybe shows all repos or recently viewed */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Repositories</h3>
          <input
            type="text"
            placeholder="Find any repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="repo-list">
             {/* Displaying allRepos in sidebar, could be changed */}
            {allRepos.length > 0 ? (
              allRepos.map((r) => ( // Limit displayed repos in sidebar for performance
                // Make sidebar items links too
                <Link to={`/repo/${r.owner}/${r.name}`} key={r._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="repo-item">
                       <span className="repo-dot" style={{ color: r.languageColor || '#8b949e' }}>●</span> {r.name}
                    </div>
                 </Link>
              ))
            ) : (
              !error && <p>No repositories found.</p> // Show only if no error
            )}
             {error && <p style={{color: 'red'}}>Error loading repos.</p>}
          </div>
        </aside>

        {/* Main Content - Displaying Filtered/User Repositories */}
        <main className="main-content">
          <h2 className="section-title">{searchQuery ? "Search Results" : "Your Repositories"}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="repo-grid">
            {!error && displayedRepos.length > 0 ? (
              displayedRepos.map((r) => (
                // --- Updated Link ---
                <Link to={`/repo/${r.owner}/${r.name}`} key={r._id} style={{ textDecoration: 'none' }}>
                  <div className="repo-card">
                    <h4>{r.name}</h4>
                    <p>{r.description || "No description provided."}</p>
                    <div className="repo-meta">
                       {/* Add language display */}
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: r.languageColor || '#8b949e' }}></span>
                           {r.language || 'N/A'}
                       </span>
                      {/* Keep stars/forks if you add that data */}
                      {/* <span>⭐ {r.stars || 0}</span> */}
                      {/* <span>🍴 {r.forks || 0}</span> */}
                      <span>{r.visibility ? 'Public' : 'Private'}</span>
                    </div>
                  </div>
                </Link>
                // --- End Updated Link ---
              ))
            ) : (
              !error && <p>No repositories to display.</p> // Show only if no error
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