import React from 'react'
import './Navbar.scss'

const Navbar = () => {
  return (
    <div>
      <div className="all">
        <div className="navbar">
            <div className="left">
                <img src="/public/logo.jpg" alt="" />
            </div>
            <div className="right">
               <ul type='none'>
               <li><a href="" className='cool-link'>ABOUT US</a></li>
                <li><a href="" className='cool-link'>PRODUCTS</a></li>
                <li><a href="" className='cool-link'>SERVICES</a></li>
                <li><a href="" className='cool-link'>CONTACT US</a></li>
               </ul>
            </div>
        </div>
       


      </div>
    </div>
  )
}

export default Navbar
