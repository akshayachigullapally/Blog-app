import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminProfile.css"; // Custom CSS for additional styling and animations

function AdminProfile() {
  return (
    <div className="admin-container">
      <div className="container py-5">
        {/* Navigation Header */}
        <div className="card bg-dark text-white shadow-lg p-4 mb-4">
          <h1 className="h4 fw-bold mb-4">Admin Dashboard</h1>
          <nav>
            <ul className="nav nav-pills">
              <li className="nav-item">
                <NavLink
                  to="usersnAuthors"
                  className={({ isActive }) =>
                    `nav-link px-4 py-2 fw-semibold transition ${isActive ? "active" : ""}`
                  }
                >
                  Users & Authors
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Outlet Container */}
        <div className="card bg-dark text-white shadow-lg p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
