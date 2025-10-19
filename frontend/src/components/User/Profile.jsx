import React, { useEffect, useState } from 'react';
import './Profile.css';
import Navbar from '../Navbar';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

// --- Fake Data for Repositories ---
const fakeRepos = [
  {
    name: 'Spotify_UI',
    description: 'This is my first project on Frontend using HTML and CSS',
    language: 'HTML',
    languageColor: '#e34c26',
  },
  {
    name: 'Small-CSS-Project',
    description: 'This a Small CSS project which i made to practice CSS and HTML.',
    language: 'HTML',
    languageColor: '#e34c26',
  },
  {
    name: 'Wander-Lust',
    description: 'This is My first Major-project on FULL STACK DEVELOPMENT',
    language: 'JavaScript',
    languageColor: '#f1e05a',
  },
  {
    name: 'Version-Control-System',
    description: '',
    language: 'JavaScript',
    languageColor: '#f1e05a',
  },
  {
    name: 'UI_Projects',
    description: 'These are all the UI Projects i have made so far learning CSS and HTML.',
    language: 'HTML',
    languageColor: '#e34c26',
  },
  {
    name: 'DivFlow',
    description: 'A freelance Website for collaboration',
    language: 'JavaScript',
    languageColor: '#f1e05a',
  },
];

// --- SVG Icons for Tabs ---
const BookIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c.22 0 .415.126.53.318l.09.143h7.677a.75.75 0 0 1 0 1.5H5.623a.75.75 0 0 1-.53-.318L5 2.5H1.5v11h11.75a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 13.25Z"></path>
    <path d="M7.25 2.083c.22 0 .415.126.53.318l.09.143h5.38a.75.75 0 0 1 .75.75v8.125a.75.75 0 0 1-.75.75h-5.38a.75.75 0 0 1-.53-.318L7.25 10.75V2.083Z"></path>
  </svg>
);
const RepoIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Z"></path>
    <path d="M3.75 12.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5.25 11a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.75 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M6.5 4.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.75 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"></path>
  </svg>
);
const ProjectIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon">
    <path d="M1.75 0A1.75 1.75 0 0 0 0 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0 0 16 14.25V1.75A1.75 1.75 0 0 0 14.25 0ZM7.5 11.5h1v-2h-1Zm-2-4h1v-2h-1ZM6 6.5h1v-2H6Zm2.5 1h-1v2h1ZM10 9.5h1v-2h-1Zm-2.5 1h1v-2h-1Z"></path>
  </svg>
);
const PackageIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon">
    <path d="M8.878.398a.75.75 0 0 0-1.756 0l-5.25 3.045A.75.75 0 0 0 1.5 4.132v7.736a.75.75 0 0 0 .372.65l5.25 3.045a.75.75 0 0 0 .878 0l5.25-3.045a.75.75 0 0 0 .372-.65V4.132a.75.75 0 0 0-.372-.684Zm-5.63 3.48L8 1.44l4.752 2.438L8 6.316Zm.502 6.94 4.5 2.608 4.5-2.608V7.189l-4.5 2.608-4.5-2.608Z"></path>
  </svg>
);
const StarIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 13.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.192L.646 6.574a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
  </svg>
);

// --- Main Profile Component ---
const Profile = () => {

  const { currentUser } = useAuth();
  const [repo, setRepo] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      const fetchUserRepo = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
          const data = await response.json();
          setRepo(data.repos);
          setLoading(false)
        } catch (error) {
          console.log(error);
          setLoading(false)
        }
      };
  
      fetchUserRepo();
    }, [repo]);

    useEffect(() => {
    // Only try to fetch if the currentUser ID exists
    if (currentUser) {
      // Make the API call to your backend endpoint
      axios.get(`http://localhost:3000/getUser/${currentUser}`)
        .then(res => {
          // Store the complete user object in state
          console.log(res.data)
          setUserData(res.data); 
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch user data:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);



  if (loading) {
    return <div>Loading user data...</div>;
  }
  return (
    <>
    <Navbar username={userData.name} />
    <div className="profile-container">
      <div className="profile-tabs">
        <a href="#" className="tab-item active">
          <BookIcon />
          <span>Overview</span>
        </a>
        <a href="#" className="tab-item">
          <RepoIcon />
          <span>Repositories</span>
          <span className="tab-count">6</span>
        </a>
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
          <div className="avatar">{userData.name.slice(0,1).toUpperCase()}</div>
          <div className="user-name">{userData.name}</div>
          <button className="edit-profile-btn">Edit profile</button>
        </div>
        <div className="profile-content">
          <div className="repos-header">
              <h2 className="repos-title">Popular repositories</h2>
              <a href="#" className="customize-link">Customize your pins</a>
          </div>
          <div className="repos-grid">
            {repo.map((repo, index) => (
              <div key={index} className="repo-card">
                <div className="repo-card-header">
                  <a href="#" className="repo-name">{repo.name}</a>
                  <span className="public-badge">Public</span>
                </div>
                <p className="repo-description">{repo.description}</p>
                <div className="repo-language">
                  <span
                    className="language-dot"
                    style={{ backgroundColor: repo.languageColor }}
                  ></span>
                  <span>{repo.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;

