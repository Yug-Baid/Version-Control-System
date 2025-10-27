import React, { useEffect } from "react"; // Keep React import if needed elsewhere, often implicit now
import { useAuth } from "../AuthContext";
import { useNavigate, useRoutes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Profile from "./User/Profile";
import CreateRepo from "./Repo/CreateRepo";
import RepoView from "./Repo/RepoView"; // <-- Import the new component
import FileView from "./FileView";
import RepoSettings from "./Repo/RepoSettings";
import Contributions from "./User/Contributions";
import RecentAnnouncements from "./Info/RecentAnnouncements";
import RepositoriesPage from "./User/RepositoriesPage";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromSystem = localStorage.getItem("userId");

    // Logic for setting user and redirecting remains the same
    if (!userIdFromSystem && !currentUser) {
      // If already on auth/signup, don't redirect
      if (!["/auth", "/signup"].includes(window.location.pathname)) {
        console.log("No user ID found, redirecting to /auth");
        navigate("/auth");
      }
    } else if (userIdFromSystem && !currentUser) {
      setCurrentUser(userIdFromSystem); // Set context if only localStorage has it
    }

    // Redirect from /auth or /signup if user is already logged in
    if (
      userIdFromSystem &&
      ["/auth", "/signup"].includes(window.location.pathname)
    ) {
      console.log("User ID found, redirecting from auth/signup to /");
      navigate("/");
    }

    // Added console logs for debugging redirects
    console.log("Current User (Context):", currentUser);
    console.log("User ID (Storage):", userIdFromSystem);
    console.log("Current Pathname:", window.location.pathname);
  }, [currentUser, navigate, setCurrentUser]); // Dependencies seem correct

  const element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      // Update Profile route if you want it user-specific
      // path: "/profile/:userId", // Example: if profile should show specific user
      path: "/profile", // Keeping it simple for now
      element: <Profile />,
    },
    {
      path: "/create",
      element: <CreateRepo />,
    },
    // --- New Route Definition ---
    {
      path: "/repo/:userId/:repoName", // Matches the structure used in RepoView and Links
      element: <RepoView />,
    },
    {
      path: "/repo/:userId/:repoName/blob/:fileName", // Using 'blob' convention like GitHub
      element: <FileView />,
    },
    {
      path: "/repo/:userId/:repoName/settings",
      element: <RepoSettings />,
    },
    {
      path: "/contributions",
      element: <Contributions />,
    },
    {
      path: "/announcements",
      element: <RecentAnnouncements />,
    },
    {
      path: "/profile/:userId/repositories",
      element: <RepositoriesPage />,
    },
    {
      path: "/profile/:userId/projects",
      element: (
        <h1 style={{ marginTop: "100px", color: "white", textAlign: "center" }}>
          Projects Page (Coming Soon!)
        </h1>
      ),
    },
    {
      path: "/profile/:userId/packages",
      element: (
        <h1 style={{ marginTop: "100px", color: "white", textAlign: "center" }}>
          Packages Page (Coming Soon!)
        </h1>
      ),
    },
    {
      path: "/profile/:userId/stars",
      element: (
        <h1 style={{ marginTop: "100px", color: "white", textAlign: "center" }}>
          Stars Page (Coming Soon!)
        </h1>
      ),
    },
    {
      path: "/profile/:userId/edit",
      element: (
        <h1 style={{ marginTop: "100px", color: "white", textAlign: "center" }}>
          Edit Profile Page (Coming Soon!)
        </h1>
      ),
    },
  ]);

  return element;
};

export default ProjectRoutes;
