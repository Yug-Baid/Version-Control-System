// src/components/FileView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; // Adjust import path if needed

// --- Syntax Highlighting Imports ---
import Highlight from 'react-highlight'; // Correct import name
// Import the specific CSS theme you want to use for highlight.js
// Make sure this path is correct within your node_modules
import 'highlight.js/styles/github-dark-dimmed.css'; // Example: GitHub Dark Dimmed theme
// You can try other themes like:
// import 'highlight.js/styles/atom-one-dark.css';
// import 'highlight.js/styles/vs2015.css';
// --- End Syntax Highlighting Imports ---

const FileView = () => {
    const { userId, repoName, fileName: encodedFileName } = useParams();
    const fileName = decodeURIComponent(encodedFileName || '');

    // State from backend response
    const [fileContent, setFileContent] = useState(null);
    const [contentType, setContentType] = useState('text/plain');
    const [isBinaryFile, setIsBinaryFile] = useState(false);
    const [detectedLanguage, setDetectedLanguage] = useState('plaintext');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState(''); // For Navbar

    useEffect(() => {
        const fetchFileData = async () => {
            if (!userId || !repoName || !fileName) {
                setError("Missing user, repository, or file name in URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            // Reset states
            setFileContent(null);
            setContentType('text/plain');
            setIsBinaryFile(false);
            setDetectedLanguage('plaintext');

            try {
                // Fetch user data
                try {
                    const userResponse = await axios.get(`3.7.71.159:3000/getUser/${userId}`);
                    setUserName(userResponse.data.name || 'User');
                } catch (userError) {
                    console.warn("Could not fetch user data:", userError);
                    setUserName('User');
                }

                // Fetch file content
                const fileUrl = `3.7.71.159:3000/repo/file/${userId}/${repoName}/${encodeURIComponent(fileName)}`;
                console.log(`Fetching file: ${fileUrl}`);
                const fileResponse = await axios.get(fileUrl);
                const data = fileResponse.data;

                // Log response for debugging
                console.log("Backend Response for file content:", data);

                // Update state based on backend response
                setFileContent(data.content); // Null if binary
                setContentType(data.contentType);
                setIsBinaryFile(data.isBinary);
                setDetectedLanguage(data.language || 'plaintext'); // Use hint, default plaintext

            } catch (err) {
                console.error("Error fetching file content:", err);
                const errorMessage = err.response?.data?.message || 'Failed to load file content.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchFileData();

    }, [userId, repoName, fileName]);


    const renderFileContent = () => {
        // Log state values used for rendering
        console.log(`Rendering - Loading: ${loading}, IsBinary: ${isBinaryFile}, Language: ${detectedLanguage}, ContentPresent: ${!!fileContent}`);

        if (loading) {
            return <p style={{ color: '#8b949e', textAlign: 'center' }}>Loading file...</p>;
        }

        if (isBinaryFile) {
             return (
                <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px solid #30363d', borderRadius: '6px', background: '#0d1117', color: '#8b949e' }}>
                    <p style={{ fontSize: '3em', margin: '0 0 10px 0' }}>📄</p>
                    <p>Cannot display the content of binary file "{fileName}".</p>
                    <small>MIME Type: {contentType}</small>
                </div>
            );
        }

        if (fileContent === null || fileContent === undefined) {
            // Show if not binary, but content is still missing after loading
            return <p style={{ color: '#8b949e' }}>File content is empty or could not be loaded as text.</p>;
        }

        // --- Use react-highlight ---
        // It renders a <pre><code> block. Styles are applied via the imported CSS.
        return (
             <div className="code-block-container" style={{ border: '1px solid #30363d', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#0d1117' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22', fontSize: '14px' }}>
                    <span>📄 {fileName}</span>
                     <small style={{color: '#8b949e'}}>Detected Language: {detectedLanguage}</small>
                </div>
                 {/* This div controls scrolling */}
                 <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                     {/* Pass language identifier to className or let the component detect */}
                     {/* Using className is often more reliable if backend provides hint */}
                     <Highlight className={`language-${detectedLanguage}`}>
                        {String(fileContent)}
                     </Highlight>
                 </div>
            </div>
        );
    };

    return (
         <>
            <Navbar username={userName || (loading ? "Loading..." : 'User')} />
            <div style={{ marginTop: '70px', padding: '24px', color: '#c9d1d9', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '70px auto 0 auto' }}>
                {/* Breadcrumbs */}
                 <nav aria-label="breadcrumb" style={{ marginBottom: '16px', fontSize: '14px' }}>
                    {/* ... breadcrumb links ... */}
                    <Link to={`/profile/${userId}`} style={{ color: '#58a6ff', textDecoration: 'none' }}>{userName || userId}</Link>
                    <span style={{ margin: '0 8px', color: '#8b949e' }}>/</span>
                    <Link to={`/repo/${userId}/${repoName}`} style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: '600' }}>{repoName}</Link>
                    <span style={{ margin: '0 8px', color: '#8b949e' }}>/</span>
                    <span style={{ color: '#c9d1d9' }}>{fileName}</span>
                 </nav>
                 {/* Error Display */}
                 {error && (
                    <div className="error-message" style={{ color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.4)', padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(248, 81, 73, 0.1)', marginBottom: '16px' }}>
                         Error: {error} <Link to={`/repo/${userId}/${repoName}`} style={{ color: '#58a6ff'}}>Go back to repository</Link>
                     </div>
                )}
                {/* Content Area */}
                {renderFileContent()}
            </div>
        </>
    );
};

export default FileView;