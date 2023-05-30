import React from 'react'
import logo from "../images/deepfakeDisplay.png"

import "./navBar.css";

function NavBar() {
  return (
    <nav>
    <div className="nav-wrapper">
      <a href="#" class="brand-logo center">
        <img src={logo} alt="logo" className='productLogo' />
      </a>
      
    </div>
  </nav>
  )
}

export default NavBar