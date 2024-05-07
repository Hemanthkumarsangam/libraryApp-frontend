import React, { useState } from 'react'
import './navmenu.css'
import { isLoggedIn, user } from '../login/Login'
import { Link, useNavigate } from 'react-router-dom'

function Navmenu() {
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
    <div className='navmenu'>
      <center><h1>Book Lend</h1></center>
      {
        (isLoggedIn) 
        ? <div className="profileActions" onMouseEnter={() => {setShowProfile(true)}} onMouseLeave={() => {setShowProfile(false)}}>
            {user.name}
            <div className="profileMenu" style={{display : showProfile ? 'block' : 'none'}} >
              <center>
              <Link to={'/profile'} id='profile'>Profile</Link><br />
              <button onClick={() => {navigate('/'); window.location.reload()}}>logout</button>
              </center>
            </div>
          </div>
        : <Link to={'/login'} id='lgnbtn'>Login</Link>
      }
    </div>
    <br /><br /><br /><br /><br />
    </>
  )
}

export default Navmenu
