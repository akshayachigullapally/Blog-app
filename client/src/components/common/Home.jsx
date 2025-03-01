import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faPenAlt, faUser } from '@fortawesome/free-solid-svg-icons';


function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)

  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // console.log("isSignedIn :", isSignedIn)
   console.log("User :", user)
  // console.log("isLolded :", isLoaded)



  async function onSelectRole(e) {
    //clear error property
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', currentUser)
        let { message, payload } = res.data;
        // console.log(message, payload)
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload })
          //save user to localstorage
          localStorage.setItem("currentuser",JSON.stringify(payload))
          // setError(null)
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        console.log(currentUser)
        res = await axios.post('http://localhost:3000/user-api/user', currentUser)
        let { message, payload } = res.data;
        console.log(message)
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload })
           //save user to localstorage
           localStorage.setItem("currentuser",JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'admin') {
        res = await axios.post('http://localhost:3000/admin-api/admin', currentUser);
        let { message, payload } = res.data;
        if (message === 'admin') {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }


  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded])



  useEffect(() => {

    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      console.log("first")
      navigate(`/author-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "admin" && error.length === 0) {
      navigate(`/admin-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  // console.log("cu",currentUser)
  //console.log("is loaded",isLoaded)

  return (
    <div className=''>
      {
        isSignedIn === false && 
        <div className='hero-container'>
          <div className='hero-section'>
            <div className='hero-content'>

              <h1 className='hero-title'>Welcome to My Blog App</h1>
              <p className='hero-subtitle'>
                Explore, read, and share your thoughts with the world.
              </p>
            </div>
          </div>
        </div>
      }


  {isSignedIn === true &&
        <div className='role-selection-container '>
          <div className='user-welcome'>
            <div className='profile-circle'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            </div>
            <h1>Welcome, {user.firstName}!</h1>
            <p>{user.emailAddresses[0].emailAddress}</p>
          </div>
          
          <h2 className='journey-title'>Select role</h2>
          
          {error.length !== 0 && (
            <p className="error-message">{error}</p>
          )}
          
          <div className='role-cards'>
            <div className='role-card'>
              <label className='role-option'>
                <input 
                  type="radio" 
                  name="role" 
                  value="admin" 
                  className="role-input" 
                  onChange={onSelectRole} 
                />
                <div className='role-content'>
                <div className='role-icon admin-icon'>
          <FontAwesomeIcon icon={faUserShield} /> {/* Admin Icon */}
        </div>
                  <h3>Admin</h3>
                  <p>Manage the platform and maintain standards</p>
                </div>
              </label>
            </div>
            
            <div className='role-card'>
              <label className='role-option'>
                <input 
                  type="radio" 
                  name="role" 
                  value="author" 
                  className="role-input" 
                  onChange={onSelectRole} 
                />
                <div className='role-content'>
                <div className='role-icon author-icon'>
          <FontAwesomeIcon icon={faPenAlt} /> {/* Author Icon */}
        </div>
         <h3>Author</h3>
                  <p>Create and publish articles</p>
                </div>
              </label>
            </div>
            
            <div className='role-card'>
              <label className='role-option'>
                <input 
                  type="radio" 
                  name="role" 
                  value="user" 
                  className="role-input" 
                  onChange={onSelectRole} 
                />
                <div className='role-content'>
                <div className='role-icon user-icon'>
          <FontAwesomeIcon icon={faUser} /> {/* User Icon */}
        </div>
         <h3>User</h3>
                  <p>Explore articles and engage</p>
                </div>
              </label>
            </div>
          </div>
          
          <p className='role-info'>Your role defines your interaction with the BlogVerse community.</p>
        </div>
      }





      {/* {
        isSignedIn === true &&
        <div className='role-selection-container'>
          <div className='align-items-center bg-black text-light p-3 m-5'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            <p className="display-6">{user.firstName}</p>
            <p className="lead">{user.emailAddresses[0].emailAddress}</p>
          </div>
          <p className="lead">Select role</p>
          {error.length !== 0 && (
            <p
              className="text-danger fs-5"
              style={{ fontFamily: "sans-serif" }}
            >
              {error}
            </p>
          )}
          <div className='d-flex role-radio py-3 justify-content-center'>

            <div className="form-check me-4">
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="author" className="form-check-label">Author</label>
            </div>
            <div className="form-check">
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="user" className="form-check-label">User</label>
            </div>
            <div className="form-check">
              <input type="radio" name="role" id="admin" value="admin" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="admin" className="form-check-label">Admin</label>
            </div>
          </div>
        </div>



      } */}
    </div>
  )
}

export default Home






// import { useContext, useEffect, useState } from 'react'
// import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
// import { useUser } from '@clerk/clerk-react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import './Home.css';

// function Home() {
//   const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
//   const { isSignedIn, user, isLoaded } = useUser()
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   async function onSelectRole(e) {
//     setError('');
//     const selectedRole = e.target.value;
//     currentUser.role = selectedRole;
//     let res = null;
  
//     try {
//       if (selectedRole === 'author') {
//         res = await axios.post('http://localhost:3000/author-api/author', currentUser);
//         let { message, payload } = res.data;
//         if (message === 'author') {
//           setCurrentUser({ ...currentUser, ...payload });
//           localStorage.setItem("currentuser", JSON.stringify(payload));
//         } else {
//           setError(message);
//         }
//       } else if (selectedRole === 'user') {
//         res = await axios.post('http://localhost:3000/user-api/user', currentUser);
//         let { message, payload } = res.data;
//         if (message === 'user') {
//           setCurrentUser({ ...currentUser, ...payload });
//           localStorage.setItem("currentuser", JSON.stringify(payload));
//         } else {
//           setError(message);
//         }
//       } else if (selectedRole === 'admin') {
//         res = await axios.post('http://localhost:3000/admin-api/admin', currentUser);
//         let { message, payload } = res.data;
//         if (message === 'admin') {
//           setCurrentUser({ ...currentUser, ...payload });
//           localStorage.setItem("currentuser", JSON.stringify(payload));
//           navigate(`/admin-profile/${currentUser.email}`);
//         } else {
//           setError(message);
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   }
  
//   useEffect(() => {
//     if (isSignedIn === true) {
//       setCurrentUser({
//         ...currentUser,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.emailAddresses[0].emailAddress,
//         profileImageUrl: user.imageUrl,
//       });
//     }
//   }, [isLoaded]);

//   useEffect(() => {
//     if (currentUser?.role === "user" && error.length === 0) {
//       if (currentUser?.isBlocked) {
//         setError("Your account is blocked. Please contact admin.");
//       } else {
//         navigate(`/user-profile/${currentUser.email}`);
//       }
//     }
//     if (currentUser?.role === "author" && error.length === 0) {
//       if (currentUser?.isBlocked) {
//         setError("Your account is blocked. Please contact admin.");
//       } else {
//         navigate(`/author-profile/${currentUser.email}`);
//       }
//     }
//     if (currentUser?.role === "admin" && error.length === 0) {
//       navigate(`/admin-profile`);
//     }
//   }, [currentUser]);

//   return (
//     <div className='container'>
//       {isSignedIn === false &&
//         <div className='hero-container'>
//           <div className='hero-content'>
//             <h1 className='hero-title'>Welcome to My Blog App</h1>
//             <p className='hero-subtitle'>Explore, read, and share your thoughts with the world.</p>
//           </div>
//         </div>
//       }

//       {isSignedIn === true &&
//         <div>
//           <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
//             <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
//             <p className="display-6">{user.firstName}</p>
//             <p className="lead">{user.emailAddresses[0].emailAddress}</p>
//           </div>
//           <p className="lead">Select role</p>
//           {error.length !== 0 && <p className="text-danger fs-5">{error}</p>}

//           <div className='d-flex role-radio py-3 justify-content-center'>
//             <div className="form-check me-4">
//               <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
//               <label htmlFor="author" className="form-check-label">Author</label>
//             </div>
//             <div className="form-check me-4">
//               <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
//               <label htmlFor="user" className="form-check-label">User</label>
//             </div>
//             <div className="form-check">
//               <input type="radio" name="role" id="admin" value="admin" className="form-check-input" onChange={onSelectRole} />
//               <label htmlFor="admin" className="form-check-label">Admin</label>
//             </div>
//           </div>
//         </div>
//       }
//     </div>
//   )
// }

// export default Home;