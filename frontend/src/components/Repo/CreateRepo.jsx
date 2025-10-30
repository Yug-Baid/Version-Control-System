import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

// --- Self-Contained Styles ---
const Style = () => (
<style>{`
    .create-repo-container {
        max-width: 896px;
        margin: 0 auto;
        color: #c9d1d9;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        padding: 24px;
    }

    .create-repo-header h1 {
        font-size: 24px;
        font-weight: 400;
        margin-bottom: 8px;
    }

    .create-repo-header p {
        color: #8b949e;
        font-size: 14px;
        margin-top: 0;
        margin-bottom: 4px;
    }

    .create-repo-header a {
        color: #58a6ff;
        text-decoration: none;
    }

    .create-repo-header a:hover {
        text-decoration: underline;
    }

    .required-fields-note {
        font-size: 12px;
        color: #8b949e;
        margin-top: 16px;
        border-bottom: 1px solid #30363d;
        padding-bottom: 24px;
    }

    .form-section {
        display: flex;
        margin-top: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #30363d;
    }

    .section-number {
        width: 32px;
        height: 32px;
        border: 1px solid #30363d;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-right: 16px;
        color: #8b949e;
    }

    .section-content {
        flex-grow: 1;
    }

    .section-content h2 {
        font-size: 18px;
        font-weight: 600;
        margin-top: 4px;
        margin-bottom: 16px;
    }

    .owner-repo-container {
        display: flex;
        align-items: flex-end;
        gap: 8px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
    }

    .input-group label {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .owner-dropdown {
        display: flex;
        align-items: center;
        background-color: #0d1117;
        border: 1px solid #30363d;
        border-radius: 6px;
        padding: 5px 12px;
        color: #c9d1d9;
        cursor: pointer;
    }

    .owner-avatar {
        width: 20px;
        height: 20px;
        background-color: #a371f7;
        border-radius: 50%;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    }

    .owner-name {
        margin-right: 8px;
    }

    .separator {
        font-size: 20px;
        color: #8b949e;
        padding-bottom: 5px;
    }

    .repo-name-group {
        flex-grow: 1;
    }

    #repo-name, #description {
        background-color: #0d1117;
        border: 1px solid #30363d;
        border-radius: 6px;
        padding: 5px 12px;
        color: #c9d1d9;
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
    }

    #repo-name:focus, #description:focus {
        outline: none;
        border-color: #58a6ff;
        box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
    }

    .repo-name-suggestion {
        font-size: 14px;
        color: #8b949e;
        margin-top: 8px;
    }

    .shiny-waddle {
        color: #3fb950;
        font-weight: 600;
    }

    .description-group {
        margin-top: 16px;
    }

    .description-group small {
        font-size: 12px;
        color: #8b949e;
        margin-top: 4px;
        text-align: right;
    }

    .config-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-top: 1px solid #30363d;
    }

    .config-option:first-of-type {
        border-top: none;
    }

    .config-option p {
        font-size: 12px;
        color: #8b949e;
        margin: 4px 0 0;
    }

    .visibility-option {
        align-items: flex-start;
        flex-direction: column;
    }

    .visibility-buttons {
        display: inline-flex;
        border: 1px solid #30363d;
        border-radius: 6px;
        margin-top: 8px;
    }

    .visibility-btn {
        background-color: transparent;
        border: none;
        color: #c9d1d9;
        padding: 5px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .visibility-btn:first-child {
        border-right: 1px solid #30363d;
    }

    .visibility-btn.active {
        background-color: #21262d;
    }

    .toggle-switch {
        background-color: #30363d;
        color: #8b949e;
        padding: 2px 8px;
        border-radius: 2em;
        font-size: 12px;
    }

    .config-dropdown {
        background-color: #21262d;
        color: #c9d1d9;
        border: 1px solid #30363d;
        border-radius: 6px;
        padding: 3px 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
    }

    .create-repo-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
    }

    .create-repo-btn {
        background-color: #238636;
        color: white;
        border: 1px solid rgba(240, 246, 252, 0.1);
        padding: 5px 16px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
    }

    .create-repo-btn:hover {
        background-color: #2ea043;
    }
`}</style>
);


// --- SVG Icons ---
const LockIcon = () => <svg height="16" viewBox="0 0 16 16" version="1.1" width="16"><path fillRule="evenodd" d="M4 4a4 4 0 0 1 8 0v2h.75A1.25 1.25 0 0 1 14 7.25v5.5A1.25 1.25 0 0 1 12.75 14h-9.5A1.25 1.25 0 0 1 2 12.75v-5.5A1.25 1.25 0 0 1 3.25 6H4Zm.5 2V4a3.5 3.5 0 1 1 7 0v2ZM3.5 7.5v5h9V7.5Z"></path></svg>;
const RepoIcon = () => <svg height="16" viewBox="0 0 16 16" version="1.1" width="16"><path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Z"></path><path d="M3.75 12.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5.25 11a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.75 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M6.5 4.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.75 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"></path></svg>;
const CaretDownIcon = () => <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path></svg>;

const CreateRepo = () => {
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const {userName} = useAuth()

  
      
        const repoCreator = async ()=>{
            const owner = localStorage.getItem('userId')
            const response = await axios.post("http://localhost:3000/repo/create",{
                name:repoName,
                owner:owner,
                description:description,
                visibility:isPublic
            })
            window.location.href = `/repo/${owner}/${repoName}`
        }
   

    return (
        <div className="create-repo-container">
            <Style />
            <div className="create-repo-header">
                <h1>Create a new repository</h1>
                <p>Repositories contain a project's files and version history. Have a project elsewhere? <a href="#">Import a repository</a>.</p>
                <p className="required-fields-note">Required fields are marked with an asterisk (*).</p>
            </div>

            <div className="form-section">
                <div className="section-number">1</div>
                <div className="section-content">
                    <h2>General</h2>
                    <div className="owner-repo-container">
                        <div className="input-group">
                            <label htmlFor="owner">Owner *</label>
                            <button id="owner" className="owner-dropdown">
                                <span className="owner-avatar">{userName.slice(0,1)}</span>
                                <span className="owner-name">{userName}</span>
                                <CaretDownIcon />
                            </button>
                        </div>
                        <div className="separator">/</div>
                        <div className="input-group repo-name-group">
                            <label htmlFor="repo-name">Repository name *</label>
                            <input
                                type="text"
                                id="repo-name"
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                            />
                        </div>
                    </div>
                    <p className="repo-name-suggestion">Great repository names are short and memorable. How about <span className="shiny-waddle">shiny-waddle</span>?</p>
                    
                    <div className="input-group description-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <small>{description.length} / 350 characters</small>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="section-number">2</div>
                <div className="section-content">
                    <h2>Configuration</h2>

                    <div className="config-option visibility-option">
                        <label>Choose visibility *</label>
                        <p>Choose who can see and commit to this repository</p>
                        <div className="visibility-buttons">
                            <button
                                className={`visibility-btn ${isPublic ? 'active' : ''}`}
                                onClick={() => setIsPublic(true)}
                            >
                                <RepoIcon /> Public
                            </button>
                             <button
                                className={`visibility-btn ${!isPublic ? 'active' : ''}`}
                                onClick={() => setIsPublic(false)}
                            >
                                <LockIcon /> Private
                            </button>
                        </div>
                    </div>
                    
                    <div className="config-option">
                        <div>
                            <label>Add README</label>
                            <p>READMEs can be used as longer descriptions. <a href="#">About READMEs</a></p>
                        </div>
                        <div className="toggle-switch">Off</div>
                    </div>

                    <div className="config-option">
                        <div>
                            <label>Add .gitignore</label>
                            <p>.gitignore tells which files not to track. <a href="#">About ignoring files</a></p>
                        </div>
                        <button className="config-dropdown">No .gitignore <CaretDownIcon /></button>
                    </div>

                    <div className="config-option">
                        <div>
                            <label>Add license</label>
                            <p>Licenses explain how others can use your code. <a href="#">About licenses</a></p>
                        </div>
                        <button className="config-dropdown">No license <CaretDownIcon /></button>
                    </div>
                </div>
            </div>

            <div className="create-repo-footer">
                <button onClick={()=>repoCreator()} className="create-repo-btn">Create repository</button>
            </div>
        </div>
    );
};

export default CreateRepo;

