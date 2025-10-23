// src/components/Repo/RepoView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import Navbar from '../Navbar';

const RepoView = () => {
    const { userId, repoName } = useParams();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchRepoData = async () => {
             // ... (fetching logic remains the same as before) ...
              if (!userId || !repoName) {
                setError("User ID or Repository Name missing in URL.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            setFiles([]);
            try {
                const contentResponse = await axios.get(`http://localhost:3000/repo/content/${userId}/${repoName}`);
                setFiles(contentResponse.data.files || []);
                 try {
                     const userResponse = await axios.get(`http://localhost:3000/getUser/${userId}`);
                     setUserName(userResponse.data.name || 'User');
                 } catch (userError) {
                      console.warn("Could not fetch user data:", userError);
                      setUserName('User');
                 }
            } catch (err) {
                console.error("Error fetching repository data:", err);
                setError(err.response?.data?.message || 'Failed to load repository content.');
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRepoData();
    }, [userId, repoName]);

    if (loading) {
         return (
             <>
                 <Navbar username="Loading..." />
                 <div style={{ marginTop: '80px', padding: '20px', color: 'white' }}>Loading repository content...</div>
             </>
         );
    }

    return (
        <>
            <Navbar username={userName || 'User'} />
             <div style={{ marginTop: '70px', padding: '24px', color: '#c9d1d9', fontFamily: 'sans-serif', maxWidth: '900px', margin: '70px auto 0 auto' }}>
                {/* Breadcrumbs remain the same */}
                 <nav aria-label="breadcrumb" style={{ marginBottom: '16px' }}>
                    <Link to={`/profile/${userId}`} style={{ color: '#58a6ff', textDecoration: 'none' }}>{userName || userId}</Link>
                    <span style={{ margin: '0 8px', color: '#8b949e' }}>/</span>
                    <span style={{ fontWeight: '600' }}>{repoName}</span>
                </nav>

                <h2>Repository Files</h2>

                {error && <p style={{ color: '#f85149', /*...*/ }}>Error: {error}</p>}

                {!error && files.length === 0 && (
                    <p style={{ color: '#8b949e' }}>This repository appears to be empty.</p>
                )}

                {!error && files.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: '0', border: '1px solid #30363d', borderRadius: '6px' }}>
                        {files.map((file, index) => (
                            <li key={index} style={{ padding: '8px 12px', borderBottom: index < files.length - 1 ? '1px solid #30363d' : 'none' }}>
                                📄
                                {/* --- Make filename a Link --- */}
                                <Link
                                    // Construct the path to the FileView component
                                    // IMPORTANT: Encode the filename for the URL
                                    to={`/repo/${userId}/${repoName}/blob/${encodeURIComponent(file)}`}
                                    style={{ color: '#c9d1d9', textDecoration: 'none', marginLeft: '8px' }}
                                    className="file-link" // Add class for potential hover effect
                                >
                                    {file}
                                </Link>
                                {/* --- End Link --- */}
                            </li>
                        ))}
                    </ul>
                )}
                {/* CLI Instructions remain the same */}
                {!error && (
                     <div style={{marginTop: '20px', /*...*/}}>
                         <p>To add or update files:</p>
                         <ol>
                              {/* ... */}
                         </ol>
                     </div>
                 )}
            </div>
        </>
    );
};

export default RepoView;