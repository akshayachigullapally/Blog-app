import React from 'react'
import './SignInUp.css'; // Importing the CSS for styling

import { SignIn } from '@clerk/clerk-react'

function Signin() {
  return (
     
    <div className="signin-container ">
    <div className="signin-box ">
      <SignIn />
    </div>
  </div>
  )
}

export default Signin
