import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./AuthorProfile.css"; // Custom CSS for additional styling

function AuthorProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser) {
      setUserStatus(currentUser.blocked);
    }
  }, []);

  if (userStatus === null) {
    return <div className="text-center text-secondary fs-4">Loading...</div>;
  }

  return (
    <div className="author-profile-container">
      {userStatus ? (
        <div className="text-center text-danger fw-semibold fs-3">
          Your account is blocked. Please contact the admin.
        </div>
      ) : (
        <>
          <nav className="nav-bar border-bottom pb-3">
            <NavLink to="articles" className="nav-link">
              Articles
            </NavLink>
            <NavLink to="article" className="nav-link">
              Add New Article
            </NavLink>
          </nav>
          <div className="mt-4">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default AuthorProfile;
