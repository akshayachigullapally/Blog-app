import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminProfile.css"; // Custom CSS for styling and animations

const UsersnAuthors = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    const userId = currentUser ? currentUser._id : null;
    console.log(userId);

    axios
      .get(`${BACKEND_URL}/user-api/users`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      })
      .then((response) => {
        setUsers(response.data.payload);
      })
      .catch((error) => {
        console.error(error);
        showToast("Failed to load users", "error");
      });
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const toggleBlockStatus = async (id, blocked) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `${BACKEND_URL}/admin-api/admin/block-unblock/${id}`,
        { blocked: !blocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: response.data.payload.blocked } : user
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      showToast("Failed to update user status", "error");
    }
  };

  return (
    <div className="container py-5 box">
      <h1 className="h3 text-center text-primary mb-4">Admin Dashboard</h1>

      <div className="row">
        {users.map((user) => (
          <div key={user._id} className="col-md-4 mb-4">
            <div className="card user-card bg-dark text-white shadow-lg p-3 shiny-border">
              <h5 className="card-title">{user.firstName} {user.lastName}</h5>
              <p className="card-text">{user.email}</p>
              <div className="d-flex gap-2 mt-2">
                <span className={`badge role-badge ${
                  user.role === "admin" ? "bg-primary" :
                  user.role === "author" ? "bg-info" : "bg-secondary"
                }`}>{user.role}</span>
                <span className={`badge status-badge ${
                  user.blocked ? "bg-danger" : "bg-success"
                }`}>{user.blocked ? "Blocked" : "Active"}</span>
              </div>
              <button
                onClick={() => toggleBlockStatus(user._id, user.blocked)}
                className={`btn mt-3 w-100 action-button ${
                  user.blocked ? "btn-success" : "btn-danger"
                }`}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast.show && (
        <div className={`toast align-items-center position-fixed top-0 end-0 m-3 toast-custom ${
          toast.type === "error" ? "bg-danger text-white" : "bg-success text-white"
        }`} role="alert">
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersnAuthors;





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";

// const UsersnAuthors = () => {
//   const [users, setUsers] = useState([]);
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });
//   const { getToken } = useAuth();
//   const BACKEND_URL = "http://localhost:3000";

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("currentuser"));
//     const userId = currentUser ? currentUser._id : null;
//     console.log(userId);

//     axios
//       .get(`${BACKEND_URL}/user-api/users`, {
//         headers: {
//           Authorization: `Bearer ${userId}`,
//         },
//       })
//       .then((response) => {
//         setUsers(response.data.payload);
//       })
//       .catch((error) => {
//         console.error(error);
//         showToast("Failed to load users", "error");
//       });
//   }, []);

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => {
//       setToast({ show: false, message: "", type: "" });
//     }, 3000);
//   };

//   const toggleBlockStatus = async (id, blocked) => {
//     try {
//       const token = await getToken();
//       const response = await axios.put(
//         `${BACKEND_URL}/admin-api/admin/block-unblock/${id}`,
//         { blocked: !blocked },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       showToast(response.data.message);
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user._id === id ? { ...user, blocked: response.data.payload.blocked } : user
//         )
//       );
//     } catch (error) {
//       console.error("Error blocking/unblocking user:", error);
//       showToast("Failed to update user status", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-indigo-400 text-center sm:text-left">
//           Admin Dashboard
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {users.map((user) => (
//             <div key={user._id} className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col items-center">
//               <h2 className="text-lg font-bold text-gray-100">{user.firstName} {user.lastName}</h2>
//               <p className="text-sm text-gray-400">{user.email}</p>
//               <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
//                 user.role === "admin" ? "bg-purple-900 text-purple-200" : 
//                 user.role === "author" ? "bg-blue-900 text-blue-200" : "bg-gray-600 text-gray-200"
//               }`}>
//                 {user.role}
//               </span>
//               <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
//                 user.blocked ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200"
//               }`}>
//                 {user.blocked ? "Blocked" : "Active"}
//               </span>
//               <button
//                 onClick={() => toggleBlockStatus(user._id, user.blocked)}
//                 className={`mt-3 px-4 py-2 rounded text-sm font-medium transition-colors ${
//                   user.blocked
//                     ? "bg-green-700 hover:bg-green-600 text-green-100"
//                     : "bg-red-700 hover:bg-red-600 text-red-100"
//                 }`}
//               >
//                 {user.blocked ? "Unblock" : "Block"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {toast.show && (
//         <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
//           toast.type === "error" ? "bg-red-700 text-red-100" : "bg-green-700 text-green-100"
//         }`}>
//           <p>{toast.message}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersnAuthors;