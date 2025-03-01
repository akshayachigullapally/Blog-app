import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import "./UserProfile.css";
function UserProfile() {
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
    <div className="user-profile-container">
      {userStatus ? (
          <div className="text-center text-danger fw-semibold fs-3">Your account is blocked. Please contact the admin.</div>
      ) : (
        <>
            <nav className="nav-bar border-bottom pb-3">
                      <NavLink to="articles" className="nav-link">
                                    Articles
                      </NavLink>
                     
                    </nav>
                    <div className="mt-6">
                      <Outlet />
                    </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;