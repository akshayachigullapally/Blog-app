import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { motion } from 'framer-motion';
import blog from '../../assets/blog.png'

const Header = () => {
  //const { userId } = useAuth();
  const { signOut } = useClerk();
  const { currentUser,setCurrentUser } = useContext(userAuthorContextObj);
  // console.log(currentUser);

 const navigate=useNavigate()
  // Add these lines
  const { isSignedIn, user, isLoaded } = useUser();
  
  const handleSignOut = async () => {
    console.log("signout called")
    try {
      await signOut();
      // Clear local storage after successful sign out
      setCurrentUser(null)
      localStorage.clear();
      navigate('/')
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    
    <div className=''>
      <nav className="header   d-flex justify-content-between align-content-center ">
        <div className="d-flex justify-content-center ">
          <Link href="/" className='logo ms-5'>
          <img src={blog}  alt="Logo" className='logo '/>
        
            {/* <img src="https://thumbs.dreamstime.com/b/blog-icon-dark-background-simple-vector-116865750.jpg" href=''  className='logo'/> */}
          </Link>
        </div>
        <ul className="text-white mt-3 d-flex justify-content-center align-items-center  list-unstyled">
          {!isSignedIn ? (
            <>
              <li>
                <Link to="signin" className="link me-5 ">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="signup" className="link me-5">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <div
              className="d-flex justify-content-around align-items-center"
              style={{ width: "300px" }}
            >
              <div className="user-button d-flex">
                <div style={{position:"relative"}} className=' '>
                  <img
                    src={user.imageUrl}
                    width="40px"
                    className="rounded-circle mt-2"
                    alt=""
                    
                  />
                  <p className="role" style={{position:"absolute", top:"0px",right:"-20px"}}>{currentUser.role}</p>
                </div>
                <p className="mb-0 user-name ms-5 me-1 text-white"> {user.firstName}</p>
                {/* <div >
                  {currentUser.role}
                </div> */}
              </div>

              {/* <UserButton /> */}
              <button onClick={handleSignOut} className="signout-btn me-5 ">
                Signout
              </button>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header