import React from 'react'
import './SignInUp.css'; // Importing the CSS for styling

import { SignUp } from '@clerk/clerk-react'

function Signup() {
  return (
    // <div className='d-flex justify-content-center align-items-center h-100 mt-5'>
    //   <SignUp />
    // </div>
    <div className="signin-container ">
    <div className="signin-box ">
      
      <SignUp />
    </div>
  </div>
  )
}

export default Signup
