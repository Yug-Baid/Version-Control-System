// src/components/User/Contributions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar'; // Adjust import path if needed
import HeatMapProfile from './HeatMap'; // Import the heatmap component
import { useAuth } from '../../AuthContext'; // To get current user for Navbar username
import { FaCalendarAlt } from 'react-icons/fa'; // Icon for year selector

// --- Styles --- (Consider moving to Contributions.css)
const contributionStyles = `
  .contributions-page-container {
    padding: 24px;
    margin: 60px auto 0 auto; /* Adjust top margin for Navbar */
    max-width: 100%; /* Consistent width */
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    background-color: #0d1117;
    min-height: calc(100vh - 70px);
    position:absolute;
    right:0;
    left:0;
    top:0;
    bottom:0;
  }

  .contributions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #3036d;
  }

  .contributions-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  /* Basic Year Selector Button */
  .year-selector-btn {
    background-color: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #c9d1d9;
    padding: 5px 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .year-selector-btn:hover {
    background-color: #30363d;
  }

  /* Heatmap Section */
  .heatmap-section {
    margin-bottom: 32px; /* Space below heatmap */
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 20px;
    background-color: #161b22;
    width: 100%;
    box-sizing: border-box;
  }
  .heatmap-footer {
      display: flex;
      justify-content: flex-end; /* Align legend to the right */
      align-items: center;
      margin-top: 10px;
      font-size: 12px;
      color: #8b949e;
  }
  .heatmap-legend {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-left: 10px; /* Space between 'Less/More' text */
  }
  .legend-square {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background-color: var(--color); /* Use CSS variable */
      opacity: var(--opacity, 1); /* Use CSS variable for opacity */
  }

  /* Placeholder for Activity Feed */
  .activity-feed-placeholder {
      margin-top: 24px;
      padding: 24px;
      border: 1px solid #30363d;
      border-radius: 6px;
      background-color: #161b22;
      color: #8b949e;
      text-align: center;
  }
   .activity-feed-placeholder h3 {
       color: #c9d1d9;
       margin: 0 0 10px 0;
       font-weight: 600;
   }
`;

const Contributions = () => {
    const { currentUser } = useAuth();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear(); // Get current year for display

    // Fetch username for Navbar
    useEffect(() => {
        if (currentUser) {
            setLoading(true);
            axios.get(`http://localhost:3000/getUser/${currentUser}`)
                .then(res => {
                    setUserName(res.data?.name || 'User');
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch user data:", err);
                    setUserName('User'); // Fallback
                    setLoading(false);
                });
        } else {
            setLoading(false); // Not logged in
             setUserName('Guest');
        }
    }, [currentUser]);

    // Placeholder legend colors (match GitHub's dark theme approx)
    const legendColors = [
        { color: '#161b22', opacity: 1 }, // No contributions
        { color: '#0e4429', opacity: 1 }, // Low
        { color: '#006d32', opacity: 1 },
        { color: '#26a641', opacity: 1 },
        { color: '#39d353', opacity: 1 }  // High
    ];


    return (
        <>
            <Navbar username={loading ? '...' : userName} />
            <style>{contributionStyles}</style>
            <div className="contributions-page-container">

                <div className="contributions-header">
                     <h2>{userName}'s Contributions</h2>
                     {/* Basic Year Selector - No actual functionality */}
                     <button className="year-selector-btn">
                         <FaCalendarAlt /> {currentYear} {/* Display current year */}
                     </button>
                </div>

                {/* Heatmap Section */}
                <div className="heatmap-section">
                    {/* Render the heatmap component */}
                    <div  style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}   >
                    <HeatMapProfile minWidthValue={1050} />
                    </div>
                    {/* Heatmap Legend */}
                    <div className="heatmap-footer">
                        Learn how we count contributions. {/* Placeholder text */}
                        <span style={{ marginLeft: 'auto',marginRight:"-5px"}}>Less</span>
                        <div className="heatmap-legend">
                            {legendColors.map((item, index) => (
                                <div
                                    key={index}
                                    className="legend-square"
                                    style={{ '--color': item.color, '--opacity': item.opacity }} // Use CSS variables
                                    title={`Level ${index} contributions`}
                                ></div>
                            ))}
                        </div>
                        <span style={{marginLeft:"10px"}}>More</span>
                    </div>
                </div>

                {/* Activity Feed Placeholder */}
                 <div className="activity-feed-placeholder">
                     <h3>Contribution Activity</h3>
                     <p>Recent activities like commits, issues created, and pull requests are all part of your contributions.</p>
                 </div>

            </div>
        </>
    );
};

export default Contributions;